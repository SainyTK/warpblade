import type { SpriteCanvas } from "../../../../engine/sprite";
import { mix, WHITE } from "../../../../utils/color";
import { RAY_COLORS as C } from "./colors";
import type { RayPose } from "./pose";

export type Turn = (x: number, y: number) => [number, number];
type Point = [number, number];

const VEINS: readonly Point[] = [
  [8, -1],
  [5, 0.6],
  [2, -1.2],
  [-1, 0.4],
  [-4, -0.8],
  [-7, 0.3],
];

export function farWing(s: SpriteCanvas, turn: Turn, p: RayPose): void {
  const tipX = -3 - p.fold * 9;
  const tipY = -12 - p.flap * 5 + p.fold * 7;
  s.begin();
  s.poly([turn(8, -1.5), turn(tipX + 4, tipY + 1), turn(tipX, tipY), turn(-9, -1)], C.dark);
  s.shadeEdges(C.dark, C.hide, C.deep);
  s.hairline(...turn(6, -2), ...turn(tipX + 2, tipY + 1), C.light);
  s.set(...turn(tipX + 1, tipY + 0.5), C.wetSky);
  s.commit();
}

export function nearWing(s: SpriteCanvas, turn: Turn, p: RayPose, time: number): void {
  const tipX = -1 - p.fold * 10;
  const tipY = 13 - p.flap * 7 - p.fold * 8;
  const lead: Point = [tipX + 5, tipY - 1.5];
  s.begin();
  s.poly([turn(9, 1.5), turn(...lead), turn(tipX, tipY), turn(-3, tipY * 0.45), turn(-10, 1.5)], C.hide);
  s.shadeEdges(C.hide, C.light, C.dark, 2);
  s.hairline(...turn(8.5, 2), ...turn(...lead), C.belly);
  s.hairline(...turn(8, 2.8), ...turn(lead[0] - 0.8, lead[1] - 0.2), C.bellyDark);
  s.hairline(...turn(...lead), ...turn(tipX, tipY), C.rim);
  s.set(...turn(lead[0] - 1, lead[1] - 0.8), C.glint);
  const spark = Math.floor(time * 8) % 3;
  for (let i = 0; i < 3; i++) {
    const u = 0.35 + i * 0.2;
    const x0 = lerpPoint(-2, tipX, u);
    const y0 = lerpPoint(3, tipY, u);
    const lit = p.charge > 0.2 || i === spark;
    const color = p.charge > 0.7 ? C.veinHot : lit ? C.vein : C.veinDeep;
    s.hairline(...turn(x0 + 2.5, y0 - 1.5), ...turn(x0, y0), color);
    s.hairline(...turn(x0, y0), ...turn(x0 - 1.5, y0 + 1.6), color);
  }
  s.commit();
}

const lerpPoint = (a: number, b: number, u: number): number => a + (b - a) * u;

export function tail(s: SpriteCanvas, turn: Turn, p: RayPose, time: number): void {
  let x0 = -9;
  let y0 = 0.5;
  s.begin();
  for (let i = 1; i <= 10; i++) {
    const x = -9 - i * 2.1;
    const y = 0.5 + Math.sin(time * 5 - i * 0.6) * i * 0.18 * p.whip;
    s.stroke(...turn(x0, y0), ...turn(x, y), i < 4 ? 0.6 : 0.35, C.dark);
    x0 = x;
    y0 = y;
  }
  s.shadeEdges(C.dark, C.hide, C.deep);
  s.commit(false);
  const hot = p.charge > 0.4 || Math.sin(time * 6) > 0.3;
  s.begin();
  s.poly([turn(x0 + 1, y0 - 1.2), turn(x0 - 2.8, y0), turn(x0 + 1, y0 + 1.2)], hot ? C.barb : C.vein);
  s.set(...turn(x0 - 1, y0), hot ? WHITE : C.veinHot);
  s.commit();
}

export function body(s: SpriteCanvas, turn: Turn, p: RayPose, time: number): void {
  s.begin();
  s.dot(...turn(3, 0), 4.2, C.hide);
  s.dot(...turn(-3, 0.3), 3.6, C.hide);
  s.dot(...turn(-7.5, 0.6), 2.2, C.hide);
  s.dot(...turn(8, 0.2), 3, C.hide);
  s.shadeEdges(C.hide, C.light, C.dark, 2);
  s.dot(...turn(2, -1.6), 2.4, C.light);
  s.hairline(...turn(-8, -1.4), ...turn(9, -2.6), C.rim);
  s.hairline(...turn(-5, -2.8), ...turn(6, -3.9), C.wetSky);
  s.hairline(...turn(-2, 3.4), ...turn(9, 2.6), C.belly);
  for (let i = 0; i < 3; i++) s.hairline(...turn(6 - i * 1.3, 1.4), ...turn(5.4 - i * 1.3, 3), C.gill);
  const spark = Math.floor(time * 10) % VEINS.length;
  for (let i = 1; i < VEINS.length; i++) {
    const lit = p.charge > 0.15 || i === spark || i === spark + 1;
    const color = p.charge > 0.65 ? (Math.sin(time * 60 + i) > 0 ? WHITE : C.veinHot) : lit ? C.vein : C.veinDeep;
    s.hairline(...turn(...VEINS[i - 1]), ...turn(...VEINS[i]), color);
  }
  s.commit();
}

export function head(s: SpriteCanvas, turn: Turn, p: RayPose, time: number): void {
  const curl = Math.sin(time * 3) * 0.4;
  s.begin();
  s.taper(...turn(10, -1.5), ...turn(14, -3 + curl), 1.1, 0.4, C.dark, -0.8);
  s.taper(...turn(10.5, 1.5), ...turn(14.5, 2.2 - curl), 1.1, 0.4, C.hide, 0.8);
  s.shadeEdges(C.dark, C.hide, C.deep);
  s.shadeEdges(C.hide, C.light, C.dark);
  s.commit();
  s.begin();
  const eye = p.charge > 0.5 ? WHITE : C.eye;
  s.dot(...turn(9, -1.2), 1, C.deep);
  s.dot(...turn(9.2, -1.3), 0.6, mix(eye, C.vein, p.charge > 0.5 ? 0 : 0.3));
  s.set(...turn(8.8, -1.8), WHITE);
  s.commit(false);
}
