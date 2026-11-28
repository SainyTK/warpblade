import { CRYSTAL } from "../constants/defense";
import { PAL } from "../constants/palette";
import { GROUND, W } from "../constants/stage";
import { drawText } from "../engine/font";
import { place, polygon } from "../engine/frame";
import { crystalView, nextSides, openSides, reviveLeft } from "../game/adventure";
import { game, hero } from "../game/state";
import type { Color } from "../types/color";
import type { DefenseSide } from "../types/defense";
import { hex } from "../utils/color";

const EDGE = 5;
const CHEVRON = { half: 5, depth: 4 } as const;
const GEM = { half: 3 } as const;
const SIDE_Y = GROUND - 26;
const CRYSTAL_Y = GROUND - CRYSTAL.floatY - CRYSTAL.height / 2;
const STRUCK_ALERT_SECONDS = 1;
const OUTLINE = hex("#0c0a18");
const REVIVE_LIFT = 44;

function chevron(x: number, y: number, way: number, c: Color, a: number): void {
  const tip = x + way * CHEVRON.depth;
  polygon(
    [
      [x, y - CHEVRON.half],
      [tip, y],
      [x, y + CHEVRON.half],
      [x + way * 1.5, y],
    ],
    c,
    a,
  );
}

function crystalPointer(cameraX: number): void {
  const view = crystalView();
  if (!view || view.shattered) return;
  const sx = view.x - cameraX;
  if (sx >= 0 && sx <= W) return;
  const way = sx < 0 ? -1 : 1;
  const x = way < 0 ? EDGE : W - EDGE;
  const struck = game.t - view.struckAt < STRUCK_ALERT_SECONDS;
  const blink = struck && Math.floor(game.t * 8) % 2 === 0;
  const color = view.low || blink ? PAL.heart[3] : PAL.crystal[4];
  chevron(x - way * CHEVRON.depth, CRYSTAL_Y, way, color, 1);
  gem(x - way * 12, CRYSTAL_Y, color);
}

function gem(x: number, y: number, c: Color): void {
  polygon(
    [
      [x, y - GEM.half * 2],
      [x + GEM.half, y],
      [x, y + GEM.half * 2],
      [x - GEM.half, y],
    ],
    OUTLINE,
  );
  polygon(
    [
      [x, y - GEM.half * 2 + 1],
      [x + GEM.half - 1, y],
      [x, y + GEM.half * 2 - 1],
      [x - GEM.half + 1, y],
    ],
    c,
  );
}

const sideWay = (side: DefenseSide): number => (side === "west" ? -1 : side === "east" ? 1 : 0);

function sideChevrons(): void {
  const coming = nextSides();
  const blink = Math.floor(game.t * 4) % 2 === 0;
  for (const side of new Set([...openSides(), ...coming])) {
    const way = sideWay(side);
    if (!way) continue;
    const warning = coming.includes(side) && !openSides().includes(side);
    if (warning && !blink) continue;
    const x = way < 0 ? EDGE + CHEVRON.depth : W - EDGE - CHEVRON.depth;
    const color = warning ? PAL.heart[4] : PAL.heart[3];
    chevron(x, SIDE_Y + 14, way, color, 0.85);
    chevron(x - way * 5, SIDE_Y + 14, way, color, 0.5);
  }
}

export function drawReviveCountdown(): void {
  const left = reviveLeft();
  if (left === null) return;
  place();
  drawText(`${Math.ceil(left)}`, hero.x, hero.y - REVIVE_LIFT, PAL.crystal[4], OUTLINE, 2);
}

export function drawDefenseMarks(cameraX: number): void {
  if (!crystalView()) return;
  place();
  sideChevrons();
  crystalPointer(cameraX);
}
