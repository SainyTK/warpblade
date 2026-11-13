import { ASHEN_WAKE, FLAME_PILLAR } from "../../../../constants/ysra/rites";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { skillEvolved, skillLevel, skillValues } from "../../../skills/query";
import { type CinderPatch, clearCinders, layCinder } from "../../../spells/rites/cinder";
import { castFlamePillar } from "../../../spells/rites/flamePillar";
import { game } from "../../../state";
import { surfaceBelow } from "../../../world";
import { onYsra } from "../events";

/** Ashen Wake's fire slows foes by holding their feet this long each tick */
const SLOW_HALT = 0.12;
/** Scorched Earth: the small pillar each patch erupts as, patches younger than `settle` seconds stay, and at most
 *  `most` erupt at once */
const ERUPTION = {
  shape: { ...FLAME_PILLAR, height: 36, halfWidth: 5, warn: 0.12, stand: 0.3, sigil: 0.5, shake: 0.08, amp: 1.5 },
  settle: 0.3,
  most: 14,
} as const;

/** lastX: where the last patch was laid, so patches fall every ASHEN_WAKE.spacing pixels of travel; laid: patches
 *  still burning, for Scorched Earth */
const wake: { lastX: number; laid: { x: number; y: number; at: number }[] } = {
  lastX: Number.NaN,
  laid: [],
};
rememberPerSeat(objectMemory(wake, true));

/** a patch as Ashen Wake's level makes it */
function patch(): CinderPatch {
  const v = skillValues("y_ashen");
  return {
    life: v.life,
    power: v.tick,
    halfWidth: v.halfWidth,
    overlap: v.overlap,
    halt: v.slow ? SLOW_HALT : 0,
    source: "y_ashen",
  };
}

function lay(x: number, y: number): void {
  if (Math.abs(x - wake.lastX) < ASHEN_WAKE.spacing) return;
  wake.lastX = x;
  const floor = surfaceBelow(x, y);
  layCinder(x, floor, patch());
  wake.laid.push({ x, y: floor, at: game.t });
}

/** Scorched Earth: every settled patch erupts in a small pillar */
function erupt(): void {
  const power = skillValues("y_ashen").erupt ?? 0;
  const life = skillValues("y_ashen").life ?? 0;
  wake.laid = wake.laid.filter((p) => game.t - p.at < life);
  const settled = wake.laid.filter((p) => game.t - p.at >= ERUPTION.settle).slice(-ERUPTION.most);
  for (const p of settled) game.fx.push(castFlamePillar(p.x, p.y, { ...ERUPTION.shape, power }, "y_ashen"));
  wake.laid = wake.laid.filter((p) => !settled.includes(p));
}

/** the ring of fire a landing lays both ways */
function ring(x: number, y: number, reach: number): void {
  for (let dx = -reach; dx <= reach; dx += ASHEN_WAKE.spacing) {
    wake.lastX = Number.NaN;
    lay(x + dx, y);
  }
}

/** the floor under the line she warped along, from where she threw to where she landed */
function burnLine(x0: number, x: number, y: number): void {
  wake.lastX = Number.NaN;
  const step = Math.sign(x - x0) * ASHEN_WAKE.spacing;
  if (step) for (let at = x0; Math.abs(at - x0) < Math.abs(x - x0); at += step) lay(at, y);
  lay(x, y);
  wake.lastX = Number.NaN;
}

/** Ashen Wake: vaults and dives leave burning ground behind her, warps and charges too from its level 2 */
export function listenAshenWake(): void {
  onYsra("travel", ({ x, y, from }) => {
    if (!skillLevel("y_ashen")) return;
    if (from === "charge" && !skillValues("y_ashen").warp) return;
    lay(x, y);
  });
  onYsra("land", ({ x, y }) => {
    if (!skillLevel("y_ashen")) return;
    if (skillEvolved("y_ashen")) erupt();
    const reach = skillValues("y_ashen").ring ?? 0;
    if (reach) ring(x, y, reach);
    wake.lastX = Number.NaN;
    lay(x, y);
    wake.lastX = Number.NaN;
  });
  onYsra("warp", ({ x0, x, y }) => {
    if (skillValues("y_ashen").warp) burnLine(x0, x, y);
  });
}

export function resetAshenWake(): void {
  wake.lastX = Number.NaN;
  wake.laid = [];
  clearCinders();
}
