import { COMBO } from "../../../constants/combat";
import { GROOVE } from "../../../constants/jory/beat";
import { DRUMROLL } from "../../../constants/jory/moves";
import { PAL } from "../../../constants/palette";
import { PACE } from "../../../constants/stage";
import { ULT_LEVELS } from "../../../constants/ultimate";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createAccentRing } from "../../effects/jory/accentRing";
import { createBoomRing } from "../../effects/jory/boomRing";
import { enemyCenter } from "../../enemies/enemy";
import { withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { shake } from "../../world";
import { setState, settle } from "../actions";
import { ultimateValues } from "../ultimate";
import { addGroove, raiseGroove } from "./beat";
import { jory } from "./memory";

/** game seconds between the beats of the roll: 150 real beats a minute whatever his tempo */
const ROLL_BEAT = (60 / DRUMROLL.bpm) * PACE;

/** the ring of each beat, wider with the Drumroll skill */
const ringOf = (level: number): number =>
  withCharms("area", DRUMROLL.rings[level - 1] * (1 + (ultimateValues().wider ?? 0)));

/** U: Drumroll, 2, 3, 4 or 6 heavy beats by charge level, more with the Drumroll skill's extra beat and Encore of Thunder */
export function castDrumroll(level: number): void {
  const v = ultimateValues();
  jory.ultLevel = level;
  jory.rings = (DRUMROLL.beats[level - 1] + (v.extra ?? 0)) * (v.encore ? 2 : 1);
  jory.rung = 0;
  jory.ringT = 0;
  hero.vx = 0;
  setState("drumroll");
}

/** a cymbal crash on a foe a ring reached: an Accent ring over it and a share of the ring's damage again */
function cymbal(e: Enemy, power: number): void {
  if (e.hp <= 0) return;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createAccentRing(cx, cy - 6));
  dealDamage(e, power, { fromX: cx, source: "ultimate" });
}

/** one ring reaches a foe: the hit and stagger, a knockdown on the last ring (every ring with Encore of Thunder) */
function strikeFoe(e: Enemy, power: number, last: boolean): void {
  const v = ultimateValues();
  const [cx] = enemyCenter(e);
  const knock = last || !!v.encore;
  const minion = e.rank === "minion";
  dealDamage(e, power, {
    fromX: hero.x,
    kx: Math.sign(cx - hero.x) * 40,
    stagger: COMBO.stagger,
    launch: knock && minion && !e.elite ? DRUMROLL.launch : undefined,
    stun: knock && e.elite ? 0.8 : minion ? v.stun || undefined : undefined,
    source: "ultimate",
  });
  if (v.cymbal) cymbal(e, power * v.cymbal);
  if (v.pull && e.hp > 0 && minion)
    e.x += Math.sign(hero.x - e.x) * Math.max(0, Math.min(v.pull, Math.abs(hero.x - e.x) - 8));
}

/** one beat of the roll: a ring out of the drum that strikes and staggers, the last one throwing minions up */
function ring(): void {
  const level = jory.ultLevel;
  const last = jory.rung === jory.rings - 1;
  const r = ringOf(level);
  const power =
    ULT_LEVELS[level - 1].power *
    DRUMROLL.share *
    (progress.stats.ad + progress.stats.ap) *
    (ultimateValues().power ?? 1);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - hero.x) > r || Math.abs(cy - (hero.y - 14)) > r * 0.8) continue;
    strikeFoe(e, power, last);
  }
  game.fx.push(createBoomRing(hero.x + hero.face * 6, hero.y - 14, hero.y, r, true, 0.32));
  game.fx.push(createFloorRing(hero.x, hero.y, r, PAL.beat, 0.4));
  shake(0.12, last ? DRUMROLL.lastShake : DRUMROLL.shake);
  sfx.thump();
  sfx.boom();
}

/** the last ring has played: Groove at least tier 3, a grace before silence costs it, and the skill's MP and Crescendo */
function finish(): void {
  const v = ultimateValues();
  raiseGroove(DRUMROLL.groove);
  // the roll counts as playing: silence only starts to cost Groove once the grace has run out
  jory.silent = -DRUMROLL.grace;
  if (v.refund) hero.mp = Math.min(progress.stats.mp, hero.mp + v.refund);
  if (!v.lock) return;
  addGroove(GROOVE.max);
  jory.lockBeats = v.lock;
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
  finish();
}

/** nothing touches him from the release to the last ring */
export const rolling = (): boolean => hero.state === "drumroll" && jory.rung < jory.rings;
