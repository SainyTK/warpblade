import { DAMAGE } from "../../../constants/combat";
import { KEEN } from "../../../constants/combo";
import { enemyCenter } from "../../../game/enemies/enemy";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { OwnHit } from "../../../types/kit";
import type { MoveHit } from "../../../types/move";
import { INK_CUT } from "../constants/skillLook";
import { SKILL } from "../constants/skills/ids";
import { STRING_POWER } from "../constants/string";
import { calmBonus } from "./calm";
import { cleanSheathe } from "./clean";
import { createInkArc } from "./effects/inkArc";
import { createInkCut } from "./effects/inkCut";
import { drawReach, drawStore } from "./focus";
import { STORE_ANGLE } from "./moves/slashes";
import { sayaFx } from "./skillFx";
import { saya } from "./state";
import { releaseCuts, releasing, storeCut } from "./store";

/** what each storing move stores, as a multiple of attack damage, with the skills that grow it */
function storeOf(move: string): number {
  if (move === "drawCut") {
    const edge = skillValues(SKILL.edge);
    const twice = saya.breathDraw && edge.breathStore ? edge.breathStore : 1;
    return STRING_POWER.drawCut.store * drawStore() * (edge.store ?? 1) * twice;
  }
  if (move === "returnCut") return STRING_POWER.returnCut.store * (skillValues(SKILL.reverse).store ?? 1);
  if (move === "airDraw") return STRING_POWER.airDraw.store * drawStore() * (skillValues(SKILL.falling).store ?? 1);
  return 0;
}

/** a blow as her skills shape it: a breath draw reaches farther and with Honed Draw is a sure crit, Honed Draw makes
 *  the return cut break guards, and Reverse Edge's return cut cuts behind and throws foes up */
export function shapeHit(id: string, hit: MoveHit): MoveHit {
  if (id === "drawCut" || id === "airDraw") {
    const edge = skillValues(SKILL.edge);
    const more = drawReach() + (id === "drawCut" ? (edge.reach ?? 0) : 0);
    const [x0, y0, x1, y1] = hit.box;
    const slash = hit.slash && more ? { ...hit.slash, R: hit.slash.R + more * 0.6, W: hit.slash.W + 2 } : hit.slash;
    const crit = hit.crit || (saya.breathDraw && !!edge.crit);
    return { ...hit, box: [x0, y0, x1 + more, y1], slash, crit };
  }
  if (id === "returnCut") {
    const v = skillValues(SKILL.reverse);
    const big = hit.big || !!skillValues(SKILL.edge).guard;
    return { ...hit, around: hit.around || !!v.behind, launch: v.launch ?? hit.launch, big };
  }
  return hit;
}

/** one of her own hits landed: a string blow stores its cut in the foe, and the thrown katana stores with Passing
 *  Draw, unless the blow felled the foe */
export function landed(e: Enemy, hit: { crit: boolean; kill: boolean }): void {
  if (releasing() || hit.kill) return;
  const ad = progress.stats.ad;
  if (hero.state === "throwWait") {
    const path = skillValues(SKILL.pass).pathStore;
    if (path) storeCut(e, ad * path, STORE_ANGLE.warp);
    return;
  }
  if (hero.state !== "move" || !hero.move) return;
  const store = storeOf(hero.move);
  skillLanded(e, hero.move, store);
  if (store) storeCut(e, ad * store, STORE_ANGLE[hero.move as keyof typeof STORE_ANGLE]);
}

/** Honed Draw shows on the draw cut and Reverse Edge on the return cut, each as large as the cut it stores */
function skillLanded(e: Enemy, move: string, store: number): void {
  const id = move === "drawCut" ? SKILL.edge : move === "returnCut" ? SKILL.reverse : null;
  if (!id || !skillLevel(id)) return;
  const [x, y] = enemyCenter(e);
  const face = id === SKILL.reverse ? -hero.face : hero.face;
  sayaFx(id, { x, y, face }, { damage: progress.stats.ad * (1 + store) * (skillEvolved(id) ? 2 : 1) });
}

/** extra damage on her own hits: Calm Mind, and Falling Moon's sure crit on foes in the air */
export function hitBonus(e: Enemy, _hit: OwnHit): number {
  const air = hero.move === "airDraw" && e.air && skillValues(SKILL.falling).airCrit ? DAMAGE.crit - 1 : 0;
  return calmBonus() + air;
}

/** the Keen beat after a blow lands: wider with Clean Sheathe */
export const keenWindow = (): number => skillValues(SKILL.clean).window ?? KEEN.window;

/** Honed Draw's ink cut, sent ahead from a draw */
function sendInkCut(): void {
  const edge = skillValues(SKILL.edge);
  if (!edge.wave || !(saya.breathDraw || edge.waveAlways)) return;
  const ad = progress.stats.ad;
  game.fx.push(
    createInkCut({
      ...INK_CUT,
      x: hero.x + hero.face * 10,
      y: hero.y - 18,
      dir: hero.face,
      now: 0,
      store: ad * edge.wave,
      source: "attacks",
    }),
  );
}

/** Reverse Edge's crescent, left where the return cut swept, or its ring round her */
function leaveCrescent(): void {
  const v = skillValues(SKILL.reverse);
  if (!v.crescent) return;
  const ad = progress.stats.ad;
  const ring = !!v.ring;
  const life = ring ? withBuild("duration", v.ring) : withBuild("duration", v.crescentTime);
  game.fx.push(createInkArc({ life, now: ad * v.crescent, store: v.crescentStore ? ad * v.crescent : 0, ring }));
}

/** a blow is out: the draw may send its ink cut, the return cut may leave its crescent, and the sheathe's click
 *  releases every stored cut, as a clean sheathe when J came in the Keen beat */
export function afterStrike(id: string): void {
  if (id === "drawCut") sendInkCut();
  if (id === "returnCut") leaveCrescent();
  if (id !== "sheathe") return;
  if (hero.keen) cleanSheathe();
  else releaseCuts(true);
}
