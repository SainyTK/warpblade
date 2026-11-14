import { place } from "../../../engine/frame";
import { dealDamage } from "../../../game/damage";
import { enemyCenter } from "../../../game/enemies/enemy";
import { feat } from "../../../game/feat";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { emitSkillEvent } from "../../../game/skills/events";
import { game, hero } from "../../../game/state";
import { hitStop, shake } from "../../../game/world";
import type { HeroSource } from "../../../types/build";
import type { Enemy } from "../../../types/enemy";
import { RELEASE_STAT } from "../constants/achievements";
import { RELEASE } from "../constants/release";
import { bladeOut } from "./blade";
import { createInkBurst } from "./effects/inkBurst";
import { drawStoredLine } from "./effects/storedLines";
import { sayaSound } from "./sound";

/** the cuts stored in one foe for one of Saya's sources, with the angle of each line and how long they have waited */
interface Stored {
  foe: Enemy;
  source: HeroSource;
  amount: number;
  angles: number[];
  age: number;
  /** released as from the foe's front, so it never counts as a back attack */
  front: boolean;
}

/** what Saya's blade has stored in foes, and how long it has rested with cuts still waiting. Holds foes, so the host
 *  keeps it */
const store: { cuts: Stored[]; resting: number; releasing: boolean } = { cuts: [], resting: 0, releasing: false };
rememberPerSeat(objectMemory(store, true));

/** a cut lands in a foe: `amount` damage waits in it for the next sheathe, drawn as a line at `angle` */
export function storeCut(
  foe: Enemy,
  amount: number,
  angle: number,
  source: HeroSource = "attacks",
  front = false,
): void {
  if (foe.hp <= 0 || amount <= 0) return;
  const held = store.cuts.find((c) => c.foe === foe && c.source === source && c.front === front);
  if (held) {
    held.amount += amount;
    held.angles = [...held.angles, angle].slice(-4);
    return;
  }
  store.cuts = [...store.cuts, { foe, source, amount, angles: [angle], age: 0, front }];
}

/** a release is under way: its own hits store nothing */
export const releasing = (): boolean => store.releasing;

/** foes with cuts stored in them now */
export const storedFoes = (): number => new Set(store.cuts.map((c) => c.foe)).size;

/**
 * The blade goes home: every foe she cut takes its stored cuts in one hit per source. `full` is a keyed sheathe, which
 * pays in full and knocks the foes down; otherwise the early share and a stagger. `keen` makes every release a sure
 * critical hit. Returns how many foes it struck.
 */
export function releaseCuts(full: boolean, keen = false): number {
  const cuts = store.cuts.filter((c) => c.foe.hp > 0);
  store.cuts = [];
  store.resting = 0;
  if (!cuts.length) return 0;
  store.releasing = true;
  const share = full ? 1 : RELEASE.early;
  for (const c of cuts) {
    const [cx, cy] = enemyCenter(c.foe);
    const dir = Math.sign(cx - hero.x) || hero.face;
    game.fx.push(createInkBurst(cx, cy, c.angles, full));
    dealDamage(c.foe, c.amount * share, {
      fromX: c.front ? c.foe.x + c.foe.face * 10 : hero.x,
      kx: dir * (full ? RELEASE.kx : RELEASE.kx * 0.4),
      ky: full ? RELEASE.ky : 0,
      stun: full ? RELEASE.stun : undefined,
      stagger: full ? undefined : RELEASE.stagger,
      heavy: full,
      sureCrit: keen,
      source: c.source,
    });
  }
  store.releasing = false;
  const foes = new Set(cuts.map((c) => c.foe)).size;
  sayaSound.release(full);
  hitStop(full ? 0.09 : 0.05);
  shake(full ? 0.18 : 0.1, full ? 2.2 : 1.2);
  feat({ kind: "heroBest", stat: RELEASE_STAT, value: foes });
  emitSkillEvent({ type: "release", foes, full, keen });
  return foes;
}

/** stored cuts age; once the blade has rested a moment with cuts still waiting, they release at the early share */
export function tickStore(dt: number): void {
  if (!store.cuts.length) {
    store.resting = 0;
    return;
  }
  for (const c of store.cuts) c.age += dt;
  store.cuts = store.cuts.filter((c) => c.foe.hp > 0);
  store.resting = bladeOut() ? 0 : store.resting + dt;
  if (store.resting >= RELEASE.grace) releaseCuts(false);
}

/** the stored lines on every foe still waiting */
export function drawStoredCuts(): void {
  if (!store.cuts.length) return;
  place();
  for (const c of store.cuts) {
    const [cx, cy] = enemyCenter(c.foe);
    for (const a of c.angles) drawStoredLine(cx, cy, a, c.age);
  }
}

/** a fresh run: nothing stored */
export function resetStore(): void {
  store.cuts = [];
  store.resting = 0;
  store.releasing = false;
}
