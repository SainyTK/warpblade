import { PAL } from "../../../constants/palette";
import { HAMSTRING } from "../../../constants/tallis/abilities";
import { KNIFE_BLOWS } from "../../../constants/tallis/knives";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { Box } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxHit, hitStop, markStruck, newSwing, shake } from "../../world";
import { setState, settle } from "../actions";
import { bleed, nightshade } from "./blowSkills";
import { startAbility } from "./castCheck";
import { tallis } from "./memory";
import { smear } from "./smear";
import { strikeBox } from "./strike";

/** the Crippling Line's wave runs this far along the floor */
const WAVE_REACH = 90;
/** Black Lotus coats every foe this near with full Nightshade */
const LOTUS_REACH = 40;

/** MP Hamstring costs, more for the spinning sweep of a long press */
export const hamstringMp = (wide: boolean): number => (wide ? HAMSTRING.wideMp : HAMSTRING.mp);

/** I on Hamstring: paid in MP, its recharge started, the low sweep played; held, a sweep on both sides */
export function pressHamstring(wide: boolean): boolean {
  if (!startAbility()) return false;
  const spin = wide && hero.mp >= hamstringMp(true);
  hero.mp -= hamstringMp(spin);
  tallis.hamCd = HAMSTRING.cooldown;
  tallis.casting = "hamstring";
  tallis.castWide = spin;
  tallis.current = "hamstring";
  hero.vx = 0;
  newSwing();
  setState("hamstring");
  sfx.swing(0.8);
  emitSkillEvent({ type: "cast", ability: "hamstring" });
  return true;
}

/** how long a foe of this rank lies tripped; the Warden does not trip */
function tripTime(e: Enemy): number {
  const more = skillValues("t_cutTendon").stun ?? 0;
  if (e.rank === "boss") return 0;
  if (e.rank === "mini") return HAMSTRING.stun.mini + more;
  return (e.elite ? HAMSTRING.stun.elite : HAMSTRING.stun.minion) + more;
}

/** one foe swept: the cut, and the trip */
function trip(e: Enemy): void {
  const v = skillValues("t_cutTendon");
  const power = (progress.stats.ap * HAMSTRING.ap + progress.stats.ad * HAMSTRING.ad) * (1 + (v.power ?? 0));
  markStruck(e);
  const side = Math.sign(e.x - hero.x) || hero.face;
  dealDamage(e, power, { fromX: hero.x, kx: side * KNIFE_BLOWS.hamstring.kx, source: "abilities" });
  if (e.hp <= 0) return;
  const time = tripTime(e);
  if (time > 0 && !kindOf(e.type).flies) {
    e.stun = Math.max(e.stun, time);
    e.vx = 0;
  }
  if (v.bleed) bleed(e, "t_cutTendon");
  if (v.chill) e.chill = Math.max(e.chill, time + 1);
}

/** the sweep's box on one side of him */
function sideBox(face: number): Box {
  const [x0, y0, x1, y1] = strikeBox(KNIFE_BLOWS.hamstring);
  if (face === hero.face) return [x0, y0, x1, y1];
  return [2 * hero.x - x1, y0, 2 * hero.x - x0, y1];
}

/** the foes the sweep reaches on one side, nearest first: its box, or the floor that way with Crippling Line */
function swept(face: number): Enemy[] {
  const wave = !!skillValues("t_cutTendon").wave;
  const box = sideBox(face);
  const reach = wave ? withCharms("area", WAVE_REACH) : 0;
  return game.enemies
    .filter((e) => {
      if (e.hp <= 0) return false;
      if (!wave) return boxHit(box, enemyBox(e));
      const ahead = (e.x - hero.x) * face;
      return ahead > 0 && ahead <= reach && !kindOf(e.type).flies && Math.abs(e.y - hero.y) < 12;
    })
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

/** the sweep on one side: it trips the first foe (or more, with Cut Tendon); returns how many */
function sweep(face: number): number {
  smear("hamstring", face);
  const foes = swept(face).slice(0, skillValues("t_cutTendon").foes || 1);
  for (const e of foes) trip(e);
  if (skillValues("t_cutTendon").wave)
    game.fx.push(createFloorRing(hero.x + face * 45, hero.y, 45, PAL.gloam, 0.3, 0.12));
  return foes.length;
}

/** the sweep lands on its hit frame, ahead or with the long press on both sides, then he rises from the crouch */
export function runHamstring(): void {
  const h = hero;
  if (!h.hitDone && h.st >= HAMSTRING.hit) {
    h.hitDone = true;
    const hits = sweep(h.face) + (tallis.castWide ? sweep(-h.face) : 0);
    if (tallis.castWide) game.fx.push(createFloorRing(h.x, h.y, 30, PAL.gloam, 0.3));
    if (skillValues("t_nightshade").lotus)
      for (const e of game.enemies) if (e.hp > 0 && Math.abs(e.x - h.x) <= LOTUS_REACH) nightshade(e, true);
    if (hits) {
      const { feel } = KNIFE_BLOWS.hamstring;
      hitStop(feel.stop);
      shake(feel.shake[0], feel.shake[1]);
      sfx.hit(true, feel.pitch);
    }
  }
  if (h.st >= HAMSTRING.dur) settle();
}
