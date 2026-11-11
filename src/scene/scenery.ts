import { FH, FN, FW } from "../constants/stage";
import { STAGE_WAVES } from "../constants/waves";
import { bayerAt } from "../engine/frame";
import { game } from "../game/state";
import { eraOf, eraProgress } from "../utils/eras";
import { clamp } from "../utils/math";
import { buildBackground } from "./background";
import { SCENES } from "./eras";
import type { SceneDef } from "./eras/sceneDef";

/** seconds for one scene to dissolve into the next */
const DISSOLVE = 2.4;

interface Look {
  key: string;
  def: SceneDef;
  k: number;
  bg: Uint32Array;
  /** the layer of each art pixel of bg */
  layers: Uint8Array;
}

/** the wave whose look the stage wears: the one being fought, or during the lull the one about to come */
export function sceneWave(): number {
  const wave = game.lull === "fight" ? game.wave : game.wave + 1;
  return clamp(wave, 1, STAGE_WAVES);
}

function lookFor(wave: number): Omit<Look, "bg" | "layers"> {
  const era = eraOf(wave);
  const k = eraProgress(wave);
  return { key: `${era.id}:${k}`, def: SCENES[era.id], k };
}

let current: Look | null = null;
let previous: Uint32Array | null = null;
let fade = 1;
const mixed = new Uint32Array(FN);
const listeners: (() => void)[] = [];

/** call back when the look changes, to repaint whatever is drawn from it outside the game, such as the backdrop */
export function onSceneChange(fn: () => void): void {
  listeners.push(fn);
}

/** the scene being shown now */
export function scene(): { def: SceneDef; k: number } {
  if (!current) refresh();
  const c = current as Look;
  return { def: c.def, k: c.k };
}

/** the finished static picture of the scene being shown, at full detail, with the layer of each art pixel */
export function scenePlate(): { plate: Uint32Array; layers: Uint8Array } {
  if (!current) refresh();
  const c = current as Look;
  return { plate: c.bg, layers: c.layers };
}

/** rebuild the background when the wave's look differs from the one shown, and start the dissolve */
function refresh(): void {
  const next = lookFor(sceneWave());
  if (current && current.key === next.key) return;
  previous = current ? sceneBackground().slice() : null;
  const first = !current;
  const built = buildBackground(next.def, next.k);
  current = { ...next, bg: built.plate, layers: built.layers };
  fade = first ? 1 : 0;
  for (const fn of listeners) fn();
}

/** one step of the scenery: change the look when the wave asks for it, run the dissolve and the era's own motion */
export function updateScenery(dt: number): void {
  refresh();
  fade = Math.min(1, fade + dt / DISSOLVE);
  const c = current as Look;
  c.def.update?.(dt, c.k);
}

/** the static picture this frame: during a dissolve, the old one breaks up into the new in a Bayer pattern */
export function sceneBackground(): Uint32Array {
  if (!current) refresh();
  const c = current as Look;
  if (fade >= 1 || !previous) return c.bg;
  for (let y = 0, i = 0; y < FH; y++)
    for (let x = 0; x < FW; x++, i++) mixed[i] = fade > bayerAt(x, y) ? c.bg[i] : previous[i];
  return mixed;
}
