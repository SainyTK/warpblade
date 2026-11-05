import { SEAT_COLORS, SEAT_SHADES } from "../../constants/coop";
import { drawText } from "../../engine/font";
import { place, px } from "../../engine/frame";
import { hex } from "../../utils/color";
import { hero } from "../state";

/** how far over the hero's feet the tag floats, standing and lying down */
const LIFT = { up: 50, down: 20 } as const;
/** tags closer than this side to side stack upward instead of overlapping */
const CROWD = { width: 14, step: 9 } as const;

/** where one player's tag goes */
export interface TagSpot {
  slot: number;
  x: number;
  y: number;
  down: boolean;
}

/** the tag spot over the hero in play */
export function tagSpot(slot: number): TagSpot {
  const down = hero.state === "dead";
  return { slot, x: Math.round(hero.x), y: Math.round(hero.y - (down ? LIFT.down : LIFT.up)), down };
}

/** raise tags that would overlap one another, so each stays readable when heroes stand together */
export function stackTags(spots: TagSpot[]): TagSpot[] {
  const placed: TagSpot[] = [];
  for (const spot of [...spots].sort((a, b) => b.y - a.y)) {
    let y = spot.y;
    while (placed.some((p) => Math.abs(p.x - spot.x) < CROWD.width && Math.abs(p.y - y) < CROWD.step)) y -= CROWD.step;
    placed.push({ ...spot, y });
  }
  return placed;
}

/** a player's place: P1 to P4 in their colour over a small pointer, dimmed while down */
export function drawTag({ slot, x, y, down }: TagSpot): void {
  const c = hex(SEAT_COLORS[slot]);
  const shade = hex(SEAT_SHADES[slot]);
  const a = down ? 0.45 : 1;
  place();
  drawText(`P${slot + 1}`, x, y, c, shade, 1, a);
  for (let i = -1; i <= 1; i++) px(x + i, y + 7, c, a);
  px(x, y + 8, c, a);
}
