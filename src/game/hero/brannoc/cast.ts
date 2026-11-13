import { CRESCENT_CAST, CRY_CAST, RED_CRESCENT, SPELL_CAST, WAR_CRY } from "../../../constants/brannoc/moves";
import { sfx } from "../../../services/audio";
import type { BrannocAbility } from "../../../types/brannoc";
import { dealDamage } from "../../damage";
import { createBloodCrescent } from "../../effects/brannoc/bloodCrescent";
import { createCryArcs } from "../../effects/brannoc/cryArcs";
import { enemyCenter } from "../../enemies/enemy";
import { markFoe } from "../../enemies/skillStatus";
import { staggerFoe } from "../../enemies/stagger";
import { emitSkillEvent } from "../../skills/events";
import { withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { newSwing, shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { deny } from "../deny";
import { abilityCost, abilityWait, startWait } from "./abilities";
import { spendHp } from "./debt";
import { brannoc } from "./memory";
import { inRecovery } from "./string";

/** his mouth, where War Cry's arcs leave from, from his feet facing right */
const MOUTH = { x: 3, y: -27 } as const;

/** the ability pose: his two abilities have their own, the spell skills share one */
const spell = (id: BrannocAbility): boolean => id !== "warCry" && id !== "redCrescent";

/** I: an ability may start from a free state or a blow's recovery, ready and paid for in HP */
export function pressCast(id: BrannocAbility): boolean {
  if (!isFree() && !inRecovery()) return false;
  if (abilityWait(id) > 0) {
    deny("cast");
    return true;
  }
  if (!spendHp(abilityCost(id))) return true;
  startWait(id);
  brannoc.casting = id;
  if (hero.ground) hero.vx = 0;
  setState(spell(id) ? "spellCast" : "abilityCast");
  sfx.cast();
  return true;
}

/**
 * War Cry: minions and elites near him are struck and staggered, mini bosses and bosses only struck, and every foe near
 * him is marked; three crimson arcs leave his mouth
 */
function warCry(): void {
  const r = withCharms("area", WAR_CRY.radius);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - hero.x, (cy - (hero.y - 16)) * 0.8) > r) continue;
    markFoe(e, "warCry", WAR_CRY.mark.seconds, WAR_CRY.mark.bonus);
    dealDamage(e, progress.stats.ap * WAR_CRY.ap + progress.stats.ad * WAR_CRY.ad, {
      fromX: hero.x,
      source: "abilities",
    });
    if (e.hp > 0 && e.rank === "minion") staggerFoe(e, WAR_CRY.stagger);
  }
  game.fx.push(createCryArcs(hero.x + hero.face * MOUTH.x, hero.y + MOUTH.y, hero.face, r));
  shake(0.12, 1);
  sfx.tone(120, 60, 0.3, "sawtooth", 0.06);
}

/** Red Crescent: the overhead swing throws a crescent of blood along the floor that passes through foes */
function redCrescent(): void {
  game.fx.push(
    createBloodCrescent({
      x: hero.x + hero.face * 16,
      floor: hero.y,
      dir: hero.face,
      reach: withCharms("area", RED_CRESCENT.reach),
      speed: RED_CRESCENT.speed,
      damage: progress.stats.ad * RED_CRESCENT.ad + progress.stats.ap * RED_CRESCENT.ap,
      height: RED_CRESCENT.height,
    }),
  );
  shake(0.1, 1.5);
}

/** the cast under way: the ability leaves on its frame, then he settles */
export function runCast(): void {
  const h = hero;
  if (h.ground) h.vx = 0;
  const id = brannoc.casting;
  const clip = h.state === "spellCast" ? SPELL_CAST : id === "warCry" ? CRY_CAST : CRESCENT_CAST;
  if (!h.hitDone && h.st >= clip.hit) {
    h.hitDone = true;
    // what the ability strikes counts as one blow of his for the debt it wins back
    newSwing();
    if (id === "warCry") warCry();
    if (id === "redCrescent") redCrescent();
    emitSkillEvent({ type: "cast", ability: id });
  }
  if (h.st >= clip.dur) settle();
}
