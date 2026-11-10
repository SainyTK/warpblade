import { PAL } from "../../../constants/palette";
import { HAMSTRING } from "../../../constants/tallis/abilities";
import { KNIFE_BLOWS } from "../../../constants/tallis/knives";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
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
import { canCast } from "./castCheck";
import { tallis } from "./memory";
import { smear } from "./smear";
import { strikeBox } from "./strike";

/** the Crippling Line's wave runs this far along the floor */
const WAVE_REACH = 90;
/** Black Lotus coats every foe this near with full Nightshade */
const LOTUS_REACH = 40;

/** I with Hamstring: paid in MP, its recharge started, the low sweep played */
export function pressHamstring(): boolean {
  if (!canCast(tallis.hamCd, HAMSTRING.mp)) return true;
  hero.mp -= HAMSTRING.mp;
  tallis.hamCd = HAMSTRING.cooldown;
  tallis.casting = "hamstring";
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
  dealDamage(e, power, { fromX: hero.x, kx: hero.face * KNIFE_BLOWS.hamstring.kx, source: "abilities" });
  if (e.hp <= 0) return;
  const time = tripTime(e);
  if (time > 0 && !kindOf(e.type).flies) {
    e.stun = Math.max(e.stun, time);
    e.vx = 0;
  }
  if (v.bleed) bleed(e, "t_cutTendon");
  if (v.chill) e.chill = Math.max(e.chill, time + 1);
}

/** the foes the sweep reaches, nearest first: the box ahead, or the floor ahead with Crippling Line */
function swept(): Enemy[] {
  const wave = !!skillValues("t_cutTendon").wave;
  const box = strikeBox(KNIFE_BLOWS.hamstring);
  const reach = wave ? withCharms("area", WAVE_REACH) : 0;
  return game.enemies
    .filter((e) => {
      if (e.hp <= 0) return false;
      if (!wave) return boxHit(box, enemyBox(e));
      const ahead = (e.x - hero.x) * hero.face;
      return ahead > 0 && ahead <= reach && !kindOf(e.type).flies && Math.abs(e.y - hero.y) < 12;
    })
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

/** the sweep lands on its hit frame: it trips the first foe (or more, with Cut Tendon), then he rises from the crouch */
export function runHamstring(): void {
  const h = hero;
  if (!h.hitDone && h.st >= HAMSTRING.hit) {
    h.hitDone = true;
    smear("hamstring");
    const foes = swept().slice(0, skillValues("t_cutTendon").foes || 1);
    for (const e of foes) trip(e);
    if (skillValues("t_cutTendon").wave)
      game.fx.push(createFloorRing(h.x + h.face * 45, h.y, 45, PAL.gloam, 0.3, 0.12));
    if (skillValues("t_nightshade").lotus)
      for (const e of game.enemies) if (e.hp > 0 && Math.abs(e.x - h.x) <= LOTUS_REACH) nightshade(e, true);
    if (foes.length) {
      hitStop(0.04);
      shake(0.08, 1);
      sfx.hit(true, 0.9);
    }
  }
  if (h.st >= HAMSTRING.dur) settle();
}
