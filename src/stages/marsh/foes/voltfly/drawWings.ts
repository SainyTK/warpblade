import type { SpriteCanvas } from "../../../../engine/sprite";
import { VOLTFLY_COLORS as C } from "./colors";

type Turn = (x: number, y: number) => [number, number];

export function wing(
  s: SpriteCanvas,
  turn: Turn,
  base: [number, number],
  angle: number,
  length: number,
  width: number,
  far: boolean,
): void {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const nx = -uy;
  const ny = ux;
  const at = (u: number, side: number): [number, number] =>
    turn(base[0] + ux * length * u + nx * width * side, base[1] + uy * length * u + ny * width * side);
  const fill = far ? C.wingDark : C.wing;
  s.begin();
  s.poly([at(0, 0), at(0.3, 1), at(0.75, 0.85), at(1, 0.1), at(0.95, -0.55), at(0.5, -0.8)], fill);
  s.shadeEdges(fill, far ? C.wing : C.wingLight, far ? C.wingVein : C.wingDark);
  s.hairline(...at(0.05, 0.1), ...at(0.9, 0.15), C.wingVein);
  s.hairline(...at(0.3, 0.2), ...at(0.55, 0.75), C.wingVein);
  s.hairline(...at(0.45, 0.1), ...at(0.7, -0.6), C.wingVein);
  if (!far) s.hairline(...at(0.15, 0.55), ...at(0.7, 0.75), C.wingLight);
  s.block(...at(0.86, 0.35), far ? C.veinDeep : C.vein, 1, 1);
  s.commit(false);
}
