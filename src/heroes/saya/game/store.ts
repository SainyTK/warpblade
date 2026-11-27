import { usesDrill } from "../../../drill";
import { place } from "../../../engine/frame";
import { dealDamage } from "../../../game/damage";
import { enemyCenter } from "../../../game/enemies/enemy";
import { stacksOf } from "../../../game/enemies/skillStatus";
import { feat } from "../../../game/feat";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillLevel, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { hitStop, shake, surfaceBelow } from "../../../game/world";
import type { HeroSource } from "../../../types/build";
import type { Enemy } from "../../../types/enemy";
import { RELEASE_STAT } from "../constants/achievements";
import { RELEASE, STORE_LOOK } from "../constants/release";
import { SKILL } from "../constants/skills/ids";
import type { ReleasedCut } from "../types/events";
import { bladeOut } from "./blade";
import { calmRelease } from "./calm";
import { createInkBurst } from "./effects/inkBurst";
import { drawStoredLine } from "./effects/storedLines";
import { sayaFx } from "./skillFx";
import { sayaSound } from "./sound";

/** the cuts stored in one foe for one of Saya's sources: their sum, how many, the angle of each line, their age */
export interface Stored {
  foe: Enemy;
  source: HeroSource;
  amount: number;
  count: number;
  angles: number[];
  age: number;
  /** released as from the foe's front, so it never counts as a back attack */
  front: boolean;
}

/** how one release pays: a clean sheathe's sure crits and its bonus on the first foe, and a factor on every cut */
export interface ReleaseOptions {
  clean?: boolean;
  bonus?: number;
  factor?: number;
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
    held.count++;
    held.angles = [...held.angles, angle].slice(-STORE_LOOK.lines);
    return;
  }
  store.cuts = [...store.cuts, { foe, source, amount, count: 1, angles: [angle], age: 0, front }];
}

/** a release is under way: its own hits store nothing */
export const releasing = (): boolean => store.releasing;

/** the cuts waiting now, for the skills that read them */
export const storedCuts = (): readonly Stored[] => store.cuts;

/** the factor on one foe's release from her skills: more for each cut past the first, on a bleeding or stained foe,
 *  and while she is calm */
function releaseFactor(c: Stored): number {
  const flow = skillValues(SKILL.flow);
  const weep = skillValues(SKILL.weep);
  const stain = skillValues(SKILL.stain);
  const bleeding = weep.weak && stacksOf(c.foe, SKILL.weep) > 0 ? weep.weak : 0;
  return 1 + (flow.perLine ?? 0) * (c.count - 1) + bleeding + (stain.consume ?? 0) + calmRelease();
}

/** a release's splash: foes near a released one take a share of it, and may store a share of that */
function splash(from: Enemy, amount: number, source: HeroSource): void {
  const flow = skillValues(SKILL.flow);
  if (!flow.splash) return;
  const [x, y] = enemyCenter(from);
  for (const e of game.enemies) {
    if (e === from || e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, ey - y) > flow.reach) continue;
    dealDamage(e, amount * flow.splash, { fromX: x, kx: Math.sign(ex - x) * 30, source });
    if (flow.splashStore) storeCut(e, amount * flow.splash * flow.splashStore, Math.atan2(ey - y, ex - x), source);
  }
}

/** one foe takes its stored cuts */
function payOut(c: Stored, amount: number, full: boolean, clean: boolean): void {
  const [cx, cy] = enemyCenter(c.foe);
  const dir = Math.sign(cx - hero.x) || hero.face;
  game.fx.push(createInkBurst(cx, cy, c.angles, full));
  dealDamage(c.foe, amount, {
    fromX: c.front ? c.foe.x + c.foe.face * 10 : hero.x,
    kx: dir * (full ? RELEASE.kx : RELEASE.kx * 0.4),
    ky: full ? RELEASE.ky : 0,
    stun: full ? RELEASE.stun : undefined,
    stagger: full ? undefined : RELEASE.stagger,
    heavy: full,
    sureCrit: clean,
    source: c.source,
  });
  splash(c.foe, amount, c.source);
}

/**
 * The blade goes home: every foe she cut takes its stored cuts in one hit per source. `full` is a keyed sheathe, which
 * pays in full and knocks the foes down; otherwise the early share and a stagger. A clean sheathe makes every release a
 * sure critical hit and adds its bonus on the nearest foe. Returns what each foe took.
 */
export function releaseCuts(full: boolean, o: ReleaseOptions = {}): ReleasedCut[] {
  const cuts = store.cuts
    .filter((c) => c.foe.hp > 0)
    .sort((a, b) => Math.abs(a.foe.x - hero.x) - Math.abs(b.foe.x - hero.x));
  const keep = skillValues(SKILL.stain).keep ?? 0;
  store.cuts = keep ? cuts.map((c) => ({ ...c, amount: c.amount * keep, age: 0 })) : [];
  store.resting = 0;
  if (!cuts.length) return [];
  store.releasing = true;
  const share = (full ? 1 : RELEASE.early) * (o.factor ?? 1);
  const released: ReleasedCut[] = cuts.map((c, i) => {
    const amount = c.amount * share * releaseFactor(c) * (i === 0 ? 1 + (o.bonus ?? 0) : 1);
    payOut(c, amount, full, !!o.clean);
    return { foe: c.foe, count: c.count, amount };
  });
  store.releasing = false;
  if (full && skillLevel(SKILL.flow) && !usesDrill()) {
    const [fx, fy] = enemyCenter(cuts[0].foe);
    const total = released.reduce((sum, cut) => sum + cut.amount, 0);
    sayaFx(SKILL.flow, { x: fx, y: surfaceBelow(fx, fy), face: hero.face }, { damage: total });
  }
  const foes = new Set(cuts.map((c) => c.foe)).size;
  const flow = skillValues(SKILL.flow);
  if (full && flow.mp) hero.mp = Math.min(progress.stats.mp, hero.mp + flow.mp * foes);
  sayaSound.release(full);
  hitStop(full ? 0.09 : 0.05);
  shake(full ? 0.18 : 0.1, full ? 2.2 : 1.2);
  feat({ kind: "heroBest", stat: RELEASE_STAT, value: foes });
  emitSkillEvent({ type: "release", cuts: released, full, clean: !!o.clean });
  return released;
}

/** stored cuts age, and foes holding them are slowed with Ink Flow; once the blade has rested a moment with cuts still
 *  waiting, they release at the early share */
export function tickStore(dt: number): void {
  if (!store.cuts.length) {
    store.resting = 0;
    return;
  }
  const slow = !!skillValues(SKILL.flow).slow;
  for (const c of store.cuts) {
    c.age += dt;
    if (slow) c.foe.chill = Math.max(c.foe.chill, RELEASE.slow);
  }
  store.cuts = store.cuts.filter((c) => c.foe.hp > 0);
  store.resting = bladeOut() ? 0 : store.resting + dt;
  if (store.resting >= RELEASE.grace) releaseCuts(false);
}

/** every stored cut grows by this factor (Ink Stain) */
export function growStored(factor: number): void {
  for (const c of store.cuts) c.amount *= factor;
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
