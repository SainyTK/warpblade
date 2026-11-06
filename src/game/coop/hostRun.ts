import { DOWN_DELAY, RISE_HP } from "../../constants/coop";
import { ENEMIES } from "../../constants/enemies";
import { HEAD_START_LEVEL } from "../../constants/shopSkills";
import { GROUND } from "../../constants/stage";
import { track } from "../../services/analytics";
import { recordFeat } from "../../store/achievements";
import { addCoins, ownsSkill, wearOwned } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import type { GuestHud, PickWire } from "../../types/coop";
import type { EnemyRank, EnemyType } from "../../types/enemy";
import type { RunOutcome } from "../../types/run";
import type { PickOption } from "../../types/skill";
import { scaleFoeHealth, scaleFoeList } from "../../utils/coopScaling";
import { xpToReach } from "../../utils/progression";
import { toWire } from "../../utils/wire";
import { type CoopHooks, setCoopHooks } from "../coopHooks";
import { choosePick, gainXp } from "../progress";
import { resetRun } from "../run";
import { seatMemories } from "../seatMemory";
import { game, hero, ponytail, progress, scarf, setCharacter } from "../state";
import { drawMark } from "./drawMark";
import { drawTag, stackTags, type TagSpot, tagSpot } from "./drawTag";
import { freshSaved, type Seat } from "./seat";

/** where each player starts, by place in the room */
const START_XS = [70, 110, 50, 130];

/** what a co-op run tells the room it runs in */
export interface RunEvents {
  /** the run is over: each seat's coins, and the wave reached */
  ended(outcome: RunOutcome, wave: number, coins: Map<Seat, number>): void;
}

/** the player a co-op seat starts as */
export interface SeatStart {
  slot: number;
  peer: string | null;
  character: CharacterDef;
  owned: Record<string, number> | null;
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

  constructor(
    starts: readonly SeatStart[],
    private readonly events: RunEvents,
  ) {
    this.seats = starts.map((s) => ({ ...s, saved: [], down: false, at: { x: 0, y: 0, standing: true } }));
    this.home = this.seats[0];
    this.current = this.home;
    for (const seat of this.seats) if (seat !== this.home) seat.saved = freshSaved();
    setCoopHooks(this);
    for (const seat of this.seats) {
      this.enter(seat);
      this.startSeat(seat);
    }
    this.enter(this.home);
    track("run_start", { hero: this.home.character.id, coop: true, players: this.seats.length });
  }

  /** a fresh hero at their own spot, with Head Start if their shop has it */
  private startSeat(seat: Seat): void {
    resetRun("");
    const x = START_XS[seat.slot] ?? START_XS[0];
    scarf.shift(x - hero.x, GROUND - hero.y);
    ponytail.shift(x - hero.x, GROUND - hero.y);
    hero.x = x;
    hero.face = x > 160 ? -1 : 1;
    if (ownsSkill("headStart")) gainXp(xpToReach(HEAD_START_LEVEL));
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
    wearOwned(seat.owned);
    this.current = seat;
  }

  /** effects made since the last swap belong to the hero in play */
  private adoptEffects(): void {
    for (const f of game.fx) if (!this.owners.has(f)) this.owners.set(f, this.current);
  }

  /** where a seat's hero stands, and whether foes, coins and orbs can go for it */
  private spot(seat: Seat): Seat["at"] {
    return seat === this.current ? { x: hero.x, y: hero.y, standing: hero.state !== "dead" } : seat.at;
  }

  nearest(x: number, y: number): void {
    let best: Seat | null = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const seat of this.seats) {
      const s = this.spot(seat);
      if (!s.standing) continue;
      const d = Math.abs(s.x - x) + Math.abs(s.y - y) * 0.5;
      if (d < bestD) {
        best = seat;
        bestD = d;
      }
    }
    if (best) this.enter(best);
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

  shareXp(amount: number): void {
    const from = this.current;
    for (const seat of this.seats) {
      this.enter(seat);
      gainXp(amount);
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

  /** the game waits on the skill cards while anyone has points to spend */
  refreshPicks(): void {
    if (game.mode === "clear") return;
    game.mode = this.choosing().length ? "pick" : "play";
  }

  /** the slots of players with picks waiting, once a wave is cleared */
  choosing(): number[] {
    const from = this.current;
    const slots: number[] = [];
    for (const seat of this.seats) {
      this.enter(seat);
      if (progress.picks > 0) slots.push(seat.slot);
    }
    this.enter(from);
    return game.lull === "toNext" ? slots : [];
  }

  /** the host's own card: the dialog already acts on the host's seat */
  chooseHome(option: PickOption): void {
    choosePick(option);
    this.refreshPicks();
  }

  /** a guest's card, by id; refused quietly when it is not theirs to take */
  chooseFor(seat: Seat, pick: PickWire, read: (c: CharacterDef, pick: PickWire) => PickOption | null): void {
    if (game.mode !== "pick") return;
    this.enter(seat);
    const option = progress.picks > 0 ? read(seat.character, pick) : null;
    if (option) choosePick(option);
    this.enter(this.home);
    this.refreshPicks();
  }

  endRun(outcome: RunOutcome): void {
    if (this.over) return;
    if (outcome === "fallen") {
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
  finish(outcome: RunOutcome): void {
    if (this.over) return;
    this.over = true;
    const wave = game.wave;
    const loose = game.coinDrops.length;
    const coins = new Map<Seat, number>();
    this.seats.forEach((seat, i) => {
      this.enter(seat);
      const share = Math.floor(loose / this.seats.length) + (i < loose % this.seats.length ? 1 : 0);
      coins.set(seat, game.coins + share);
      game.coins = 0;
    });
    this.enter(this.home);
    game.coinDrops = [];
    this.close();
    addCoins(coins.get(this.home) ?? 0);
    recordFeat({ kind: "banked", coins: coins.get(this.home) ?? 0 });
    resetRun("");
    hero.inv = 0;
    this.events.ended(outcome, wave, coins);
  }

  /** stop acting on other heroes: the host's own is left in play */
  close(): void {
    this.enter(this.home);
    wearOwned(null);
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
      banner: { ...game.banner },
      leader: leader ? { type: leader.type, rank: leader.rank, hp: leader.hp, max: leader.max } : null,
      choosing: game.mode === "pick" ? this.choosing() : [],
      down,
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
