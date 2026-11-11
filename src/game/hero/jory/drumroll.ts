import { COMBO } from "../../../constants/combat";
import { GROOVE } from "../../../constants/jory/beat";
import { DRUMROLL } from "../../../constants/jory/moves";
import { PAL } from "../../../constants/palette";
import { PACE } from "../../../constants/stage";
import { ULT_LEVELS } from "../../../constants/ultimate";
import { sfx } from "../../../services/audio";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createAccentRing } from "../../effects/jory/accentRing";
import { createBoomRing } from "../../effects/jory/boomRing";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { shake } from "../../world";
import { setState, settle } from "../actions";
import { addGroove, raiseGroove } from "./beat";
import { jory } from "./memory";

/** game seconds between the beats of the roll: 150 real beats a minute whatever his tempo */
const ROLL_BEAT = (60 / DRUMROLL.bpm) * PACE;

/** the ring of each beat, wider with Grand Finale */
const ringOf = (level: number): number =>
  withCharms("area", DRUMROLL.rings[level - 1] * (1 + (skillValues("j_finale").wider ?? 0)));

function begin(level: number, rings: number): void {
  jory.ultLevel = level;
  jory.rings = rings;
  jory.rung = 0;
  jory.ringT = 0;
  hero.vx = 0;
  setState("drumroll");
}

/** U: Drumroll, 2, 3, 4 or 6 heavy beats by charge level */
export function castDrumroll(level: number): void {
  begin(level, DRUMROLL.beats[level - 1]);
}

/** Grand Finale: the roll with wider rings, a cymbal crash on every foe in each, and Crescendo locked after it */
export function castGrandFinale(level: number): void {
  const v = skillValues("j_finale");
  begin(level, v.encore ? 12 : DRUMROLL.beats[level - 1] + (v.extra ?? 0));
}

/** a cymbal crash dropped on a foe in a Grand Finale ring */
function cymbal(x: number, y: number, power: number): void {
  game.fx.push(createAccentRing(x, y));
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, cy - y) > 6) continue;
    dealDamage(e, power, { fromX: x, source: "ultimate" });
  }
}

/** one beat of the roll: a ring out of the drum that strikes and staggers, the last one throwing minions up */
function ring(): void {
  const level = jory.ultLevel;
  const last = jory.rung === jory.rings - 1;
  const r = ringOf(level);
  const finale = skillValues("j_finale");
  const power =
    ULT_LEVELS[level - 1].power * DRUMROLL.share * (progress.stats.ad + progress.stats.ap) * (finale.power ?? 1);
  const crashes: [number, number][] = [];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - hero.x) > r || Math.abs(cy - (hero.y - 14)) > r * 0.8) continue;
    const knock = last || !!finale.encore;
    dealDamage(e, power, {
      fromX: hero.x,
      kx: Math.sign(cx - hero.x) * 40,
      stagger: COMBO.stagger,
      launch: knock && e.rank === "minion" && !e.elite ? DRUMROLL.launch : undefined,
      stun: knock && e.elite ? 0.8 : e.rank === "minion" ? finale.stun || undefined : undefined,
      source: "ultimate",
    });
    if (finale.cymbal) crashes.push([cx, cy - 6]);
    if (finale.pull && e.hp > 0 && e.rank === "minion")
      e.x += Math.sign(hero.x - e.x) * Math.max(0, Math.min(finale.pull, Math.abs(hero.x - e.x) - 8));
  }
  for (const [x, y] of crashes) cymbal(x, y, power * (finale.cymbal ?? 0));
  game.fx.push(createBoomRing(hero.x + hero.face * 6, hero.y - 14, hero.y, r, true, 0.32));
  game.fx.push(createFloorRing(hero.x, hero.y, r, PAL.beat, 0.4));
  shake(0.12, last ? DRUMROLL.lastShake : DRUMROLL.shake);
  sfx.thump();
  sfx.boom();
}

/** the roll under way: the plant, the beats, and the settle, untouchable from the release to the last ring */
export function runDrumroll(dt: number): void {
  const h = hero;
  h.vx = 0;
  if (jory.rung >= jory.rings) {
    if (h.st >= DRUMROLL.settle) settle();
    return;
  }
  jory.ringT += dt;
  const due = DRUMROLL.plant + jory.rung * ROLL_BEAT;
  if (jory.ringT < due) return;
  ring();
  jory.rung++;
  if (jory.rung < jory.rings) return;
  h.st = 0;
  raiseGroove(DRUMROLL.groove);
  // the roll counts as playing: silence only starts to cost Groove once the grace has run out
  jory.silent = -DRUMROLL.grace;
  const refund = skillValues("j_finale").refund ?? 0;
  if (refund) h.mp = Math.min(progress.stats.mp, h.mp + refund);
  const lock = skillValues("j_finale").lock ?? 0;
  if (lock) {
    addGroove(GROOVE.max);
    jory.lockBeats = lock;
  }
}

/** nothing touches him from the release to the last ring */
export const rolling = (): boolean => hero.state === "drumroll" && jory.rung < jory.rings;
