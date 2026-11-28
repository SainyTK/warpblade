import { DOWN_DELAY, RISE_HP } from "../../constants/coop";
import { ENEMIES } from "../../constants/enemies";
import { track } from "../../services/analytics";
import { recordFeat, startRunAchievements } from "../../store/achievements";
import { ownLoadout } from "../../store/loadout";
import { addCoins, wearLevels } from "../../store/meta";
import { startRunUnlocks, wearSkills } from "../../store/unlocks";
import type { Feat } from "../../types/achievement";
import type { Card } from "../../types/build";
import type { StageChoice } from "../../types/campaign";
import type { CharacterDef } from "../../types/character";
import type { GuestHud, HeroSpot, Loadout, PickWire } from "../../types/coop";
import type { EnemyRank, EnemyType } from "../../types/enemy";
import type { PickAnswer } from "../../types/pick";
import type { RunOutcome, RunReport, StageResult } from "../../types/run";
import { scaleFoeHealth, scaleFoeList } from "../../utils/coopScaling";
import { toWire } from "../../utils/wire";
import {
  beginAdventure,
  crystalShattered,
  crystalWatch,
  currentStage,
  stageProgress,
  stageRunId,
  stageStatus,
  startAdventureAt,
} from "../adventure";
import { type CoopHooks, setCoopHooks } from "../coopHooks";
import { feat } from "../feat";
import { answerPick, earnXp } from "../progress";
import { resetRun } from "../run";
import { stageOutcome } from "../runEnd";
import { recordStageResult, runReport, stageResult } from "../runReport";
import { seatMemories } from "../seatMemory";
import { grantUnlocks } from "../startRun";
import { character, game, hero, progress, rng, setCharacter } from "../state";
import { drawMark } from "./drawMark";
import { drawTag, stackTags, type TagSpot, tagSpot } from "./drawTag";
import { freshSaved, type Seat } from "./seat";

/** how far each player starts from the stage's start, by place in the room */
const START_OFFSETS = [0, 40, -20, 60];

/** what a co-op run tells the room it runs in */
export interface RunEvents {
  /** the run is over: each seat's coins, report and stage result */
  ended(outcome: RunOutcome, results: Map<Seat, SeatResult>): void;
  feat(seat: Seat, feat: Feat): void;
}

const SHARED_FEATS: ReadonlySet<Feat["kind"]> = new Set([
  "kill",
  "waveReached",
  "waveCleared",
  "runEnd",
  "stageCleared",
]);

const asHero = (feat: Feat, hero: string): Feat => ("hero" in feat ? { ...feat, hero } : feat);

export interface SeatResult {
  coins: number;
  report: RunReport;
  stage: StageResult;
}

/** the player a co-op seat starts as */
export interface SeatStart {
  slot: number;
  peer: string | null;
  character: CharacterDef;
  loadout: Loadout | null;
  /** the guest's measured round trip in seconds, -1 until measured, 0 for the host */
  rtt: number;
}

/**
 * A co-op run on the host: every player's hero lives in the one shared game, and the host swaps a player's hero state
 * in before running or drawing that hero. Seat 0 is the host's own and is the one swapped in between steps, so the
 * host's keyboard, HUD and pick dialog act on it as in solo play.
 */
export class HostRun implements CoopHooks {
  readonly seats: Seat[];
  private current: Seat;
  private readonly home: Seat;
  private readonly owners = new WeakMap<object, Seat>();
  private over = false;
  private pickTime = false;

  constructor(
    starts: readonly SeatStart[],
    choice: StageChoice,
    private readonly events: RunEvents,
  ) {
    this.seats = starts.map((s) => ({
      ...s,
      saved: [],
      down: false,
      leftPicks: false,
      at: { x: 0, y: 0, standing: true },
    }));
    this.home = this.seats[0];
    this.current = this.home;
    // every seat plays its hero's own job, the host's included
    setCharacter(this.home.character);
    for (const seat of this.seats) if (seat !== this.home) seat.saved = freshSaved();
    setCoopHooks(this);
    for (const seat of this.seats) {
      this.enter(seat);
      resetRun("");
    }
    beginAdventure(rng, choice.stage, choice.hyper);
    for (const seat of this.seats) {
      this.enter(seat);
      startAdventureAt(1, START_OFFSETS[seat.slot] ?? 0);
      hero.face = 1;
      const loadout = seat.loadout ?? ownLoadout();
      grantUnlocks(loadout.arts, loadout.tools);
    }
    this.enter(this.home);
    startRunAchievements();
    startRunUnlocks();
    track("run_start", {
      hero: this.home.character.id,
      coop: true,
      players: this.seats.length,
      stage: choice.stage,
      hyper: choice.hyper ? 1 : 0,
    });
  }

  /** swap this seat's hero in, saving the one in play */
  private enter(seat: Seat): void {
    if (seat === this.current) return;
    this.adoptEffects();
    this.current.at = this.spot(this.current);
    const memories = seatMemories();
    this.current.saved = memories.map((m) => m.save());
    memories.forEach((m, i) => {
      m.load(seat.saved[i]);
    });
    setCharacter(seat.character);
    wearLevels(seat.loadout?.items ?? null);
    wearSkills(seat.loadout?.skills ?? null);
    this.current = seat;
  }

  /** effects made since the last swap belong to the hero in play */
  private adoptEffects(): void {
    for (const f of game.fx) if (!this.owners.has(f)) this.owners.set(f, this.current);
  }

  /** where a seat's hero stands, and whether foes, coins and orbs can go for it */
  private spot(seat: Seat): Seat["at"] {
    if (seat !== this.current) return seat.at;
    return { x: hero.x, y: hero.y, standing: hero.state !== "dead" };
  }

  /** the nearest standing hero */
  nearest(x: number, y: number): void {
    const spots = this.seats.map((seat) => this.spot(seat));
    let best: Seat | null = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const [i, seat] of this.seats.entries()) {
      const s = spots[i];
      if (!s.standing) continue;
      const d = Math.abs(s.x - x) + Math.abs(s.y - y) * 0.5;
      if (d < bestD) {
        best = seat;
        bestD = d;
      }
    }
    if (best) this.enter(best);
  }

  heroSpots(): HeroSpot[] {
    return this.seats.map((seat) => {
      const { x, standing } = this.spot(seat);
      return { slot: seat.slot, x, standing };
    });
  }

  anyStanding(): void {
    const standing = this.seats.find((s) => this.spot(s).standing);
    this.enter(standing ?? this.home);
  }

  owner(effect: object): void {
    const seat = this.owners.get(effect);
    if (seat && this.seats.includes(seat)) this.enter(seat);
    else this.owners.set(effect, this.current);
  }

  eachHero(run: () => void): void {
    for (const seat of this.seats) {
      this.enter(seat);
      run();
    }
    this.enter(this.home);
  }

  eachStanding(run: () => void): void {
    const from = this.current;
    for (const seat of this.seats) {
      if (!this.spot(seat).standing) continue;
      this.enter(seat);
      run();
    }
    this.enter(from);
  }

  slot(): number {
    return this.current.slot;
  }

  inputLag(): number {
    return this.current.peer ? this.current.rtt : 0;
  }

  shareFeat(feat: Feat): void {
    const seats = SHARED_FEATS.has(feat.kind) ? this.seats : [this.current];
    for (const seat of seats) {
      const own = asHero(feat, seat.character.id);
      if (seat.peer) this.events.feat(seat, own);
      else recordFeat(own);
    }
  }

  shareXp(amount: number): void {
    const from = this.current;
    for (const seat of this.seats) {
      this.enter(seat);
      earnXp(amount);
    }
    this.enter(from);
  }

  waveCleared(): void {
    const from = this.current;
    for (const seat of this.seats) {
      this.enter(seat);
      if (seat.down || hero.state === "dead") this.rise(seat);
    }
    this.enter(from);
    this.refreshPicks();
  }

  /** a downed hero stands up with part of their HP */
  private rise(seat: Seat): void {
    seat.down = false;
    Object.assign(hero, { hp: Math.round(progress.stats.hp * RISE_HP), vx: 0, vy: 0, inv: 1.5, st: 0 });
    hero.state = "idle";
  }

  /** skill cards open for every player with points, at a mentor or between a stage's beats */
  openPicks(): void {
    if (game.mode !== "play") return;
    this.pickTime = true;
    for (const seat of this.seats) seat.leftPicks = false;
    this.refreshPicks();
  }

  /** the game waits while anyone looks at an opened chest, then on the skill cards while anyone has points to spend */
  refreshPicks(): void {
    if (game.mode === "clear") return;
    if (!this.choosing().length) this.pickTime = false;
    game.mode = this.anyChest() ? "chest" : this.choosing().length ? "pick" : "play";
  }

  /** someone has an opened chest still on their screen */
  private anyChest(): boolean {
    const from = this.current;
    let open = false;
    for (const seat of this.seats) {
      this.enter(seat);
      open ||= progress.build.chest.length > 0;
    }
    this.enter(from);
    return open;
  }

  /** the host has seen their chest: the dialog already acts on the host's seat */
  chestSeenHome(): void {
    progress.build.chest = [];
    this.refreshPicks();
  }

  /** a guest has seen their chest */
  chestSeenFor(seat: Seat): void {
    this.enter(seat);
    progress.build.chest = [];
    this.enter(this.home);
    this.refreshPicks();
  }

  /** the slots of players still choosing while the cards are open */
  choosing(): number[] {
    if (!this.pickTime) return [];
    const from = this.current;
    const slots: number[] = [];
    for (const seat of this.seats) {
      this.enter(seat);
      if (progress.picks > 0 && !seat.leftPicks) slots.push(seat.slot);
    }
    this.enter(from);
    return slots;
  }

  /** the host's own answer to the cards: the dialog already acts on the host's seat */
  answerHome(answer: PickAnswer<Card>): void {
    if (answer.t === "leave") this.home.leftPicks = true;
    else answerPick(answer);
    this.refreshPicks();
  }

  /** a guest's answer, by card ids; refused quietly when it is not theirs to give */
  answerFor(
    seat: Seat,
    wire: PickAnswer<PickWire>,
    read: (c: CharacterDef, answer: PickAnswer<PickWire>) => PickAnswer<Card> | null,
  ): void {
    if (game.mode !== "pick") return;
    this.enter(seat);
    const answer = progress.picks > 0 ? read(seat.character, wire) : null;
    if (answer?.t === "leave") seat.leftPicks = true;
    else if (answer) answerPick(answer);
    this.enter(this.home);
    this.refreshPicks();
  }

  endRun(outcome: RunOutcome): void {
    if (this.over) return;
    if (outcome === "fallen" && !crystalShattered()) {
      if (hero.st >= DOWN_DELAY) this.current.down = true;
      if (!this.seats.every((s) => s.down)) return;
    }
    this.finish(outcome);
  }

  /** a player left: their hero leaves the field, and the run ends if no one is left standing */
  removeSeat(seat: Seat): void {
    if (seat === this.home) return;
    this.enter(this.home);
    this.seats.splice(this.seats.indexOf(seat), 1);
    if (this.seats.every((s) => s.down)) this.finish("fallen");
    else this.refreshPicks();
  }

  /** bank every player's coins, clear the field and hand the result to the room */
  finish(fate: RunOutcome): void {
    if (this.over) return;
    this.over = true;
    const outcome = stageOutcome(fate);
    const loose = game.coinDrops.length;
    const results = new Map<Seat, SeatResult>();
    const stage = currentStage();
    feat({ kind: "runEnd", outcome, wave: game.wave, hero: character.id });
    if (stage && outcome === "clear")
      feat({ kind: "stageCleared", stage: stage.id, hyper: stageProgress().hyper, hero: character.id });
    this.seats.forEach((seat, i) => {
      this.enter(seat);
      const report = runReport();
      const share = Math.floor(loose / this.seats.length) + (i < loose % this.seats.length ? 1 : 0);
      results.set(seat, { coins: game.coins + share, report, stage: stageResult(report, outcome) });
      game.coins = 0;
    });
    this.enter(this.home);
    game.coinDrops = [];
    this.close();
    const own = results.get(this.home);
    addCoins(own?.coins ?? 0);
    recordFeat({ kind: "banked", coins: own?.coins ?? 0 });
    if (own) own.stage = recordStageResult(own.stage, own.report);
    resetRun("");
    hero.inv = 0;
    this.events.ended(outcome, results);
  }

  /** stop acting on other heroes: the host's own is left in play */
  close(): void {
    this.enter(this.home);
    wearLevels(null);
    wearSkills(null);
    setCoopHooks(null);
  }

  drawUnderlay(): void {
    if (this.seats.length < 2) return;
    this.eachHero(() => drawMark(this.current.slot));
  }

  drawOverlay(): void {
    if (this.seats.length < 2) return;
    const spots: TagSpot[] = [];
    this.eachHero(() => spots.push(tagSpot(this.current.slot)));
    for (const spot of stackTags(spots)) drawTag(spot);
  }

  scaleFoes(foes: readonly EnemyType[]): EnemyType[] {
    return scaleFoeList(foes, this.seats.length, (t) => ENEMIES[t].rank === "minion");
  }

  scaleFoeHp(rank: EnemyRank, hp: number): number {
    return scaleFoeHealth(rank, hp, this.seats.length);
  }

  /** what a guest's HUD shows: their own hero and the shared game */
  hudFor(seat: Seat): GuestHud {
    this.enter(seat);
    const memories = seatMemories();
    const bags = memories.map((m) => (m.hostOnly ? null : toWire(m.save())));
    const down = seat.down || hero.state === "dead";
    this.enter(this.home);
    const leader = game.enemies.find((e) => e.rank !== "minion");
    return {
      bags,
      mode: game.mode,
      wave: game.wave,
      kills: game.kills,
      clock: game.clock,
      banner: { ...game.banner },
      leader: leader ? { type: leader.type, rank: leader.rank, hp: leader.hp, max: leader.max } : null,
      choosing: game.mode === "pick" ? this.choosing() : [],
      down,
      status: stageStatus(),
      runId: stageRunId(),
      crystal: crystalWatch(game.t),
    };
  }

  seatOf(peer: string): Seat | undefined {
    return this.seats.find((s) => s.peer === peer);
  }

  /** keys a guest pressed or let go, into their seat's input */
  applyKey(seat: Seat, apply: () => void): void {
    this.enter(seat);
    apply();
    this.enter(this.home);
  }
}
