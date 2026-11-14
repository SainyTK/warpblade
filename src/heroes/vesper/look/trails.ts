import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";

/** the scarf runs on past the end of its rope by this many more segments, the last segment's direction kept */
const SCARF_MORE = 3;

/** the rope's points, then more points carried on along its last segment, drooping a little each */
function lengthened(rope: readonly Vec[], more: number): Vec[] {
  const out = [...rope];
  if (rope.length < 2) return out;
  const [a, b] = [rope[rope.length - 2], rope[rope.length - 1]];
  let [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  for (let i = 0; i < more; i++) {
    dy += 0.35;
    const last = out[out.length - 1];
    out.push([last[0] + dx, last[1] + dy]);
  }
  return out;
}

/** her long hair behind the head: thick locks along the tail rope, lit along the top */
function drawHair(s: SpriteCanvas, tail: readonly Vec[]): void {
  const locks = lengthened(tail, 1);
  s.begin();
  for (let i = 1; i < locks.length; i++) {
    const [a, b] = [locks[i - 1], locks[i]];
    s.stroke(a[0], a[1], b[0], b[1], i < 2 ? 1.7 : i < 4 ? 1.3 : 0.8, HC.hairDark);
  }
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
}

/** the long violet scarf: wide at the neck, narrowing to a split end, lit along its top edge */
function drawScarf(s: SpriteCanvas, rope: readonly Vec[]): void {
  const scarf = lengthened(rope, SCARF_MORE);
  s.begin();
  for (let i = 1; i < scarf.length; i++) {
    const [a, b] = [scarf[i - 1], scarf[i]];
    s.stroke(a[0], a[1], b[0], b[1], Math.max(0.55, 1.35 - i * 0.07), HC.scarf);
  }
  const [y, z] = [scarf[scarf.length - 2], scarf[scarf.length - 1]];
  const [dx, dy] = [z[0] - y[0], z[1] - y[1]];
  s.stroke(z[0], z[1], z[0] + dx * 0.6 - dy * 0.4, z[1] + dy * 0.6 + dx * 0.4, 0.45, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}

/** behind everything: her hair, then the scarf */
export function drawVesperTrails(s: SpriteCanvas, rig: RigFrame): void {
  drawHair(s, rig.tail);
  drawScarf(s, rig.scarf);
}
