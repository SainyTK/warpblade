import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { GATOR_COLORS as C } from "./colors";
import { across, add, at, type Point, toward } from "./frame";
import type { GatorPose } from "./pose";
import { type GatorCanvas } from "./scaled";

const SEGMENTS = 7;
const LENGTH = 3.2;

interface TailBone {
  at: Point;
  up: Point;
  r: number;
}

function bones(p: GatorPose): TailBone[] {
  const list: TailBone[] = [];
  let point = at(p, -12, -7.5);
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = Math.PI - 0.14 + p.sway * i + p.tail * (0.22 + i * 0.21);
    const side = across(angle);
    list.push({ at: point, up: [-side[0], -side[1]], r: 4.6 - i * 0.48 });
    point = add(point, toward(angle), LENGTH);
  }
  return list;
}

export function drawTail(s: GatorCanvas, p: GatorPose, hide: number): void {
  const list = bones(p);
  s.begin();
  for (let i = 0; i < SEGMENTS; i++) {
    const a = list[i];
    const b = list[i + 1];
    s.taper(a.at[0], a.at[1], b.at[0], b.at[1], a.r, b.r, hide);
  }
  s.shadeEdges(hide, C.hideLight, C.hideDark, 2);
  for (let i = 1; i < SEGMENTS; i++) {
    const a = list[i];
    const b = list[i + 1];
    s.hairline(...add(a.at, a.up, -a.r * 0.6), ...add(a.at, a.up, a.r * 0.5), C.hideDark);
    s.hairline(...add(a.at, a.up, a.r * 0.75), ...add(b.at, b.up, b.r * 0.75), i < 4 ? R.wetSky : C.hideRim);
  }
  s.commit();
  s.begin();
  list.slice(0, SEGMENTS).forEach((bone, i) => {
    const base = add(bone.at, bone.up, bone.r * 0.7);
    const tip = add(base, bone.up, 1.8 - i * 0.12);
    const side = [-bone.up[1], bone.up[0]] as Point;
    s.poly([add(base, side, 1.1), add(base, side, -1.1), tip], C.scute);
  });
  s.shadeEdges(C.scute, C.scuteLight, C.scuteDark);
  list.slice(0, SEGMENTS).forEach((bone, i) => {
    const glowing = p.tail > 0.2 ? i / SEGMENTS < p.scutes : i === Math.floor(p.time * 3) % SEGMENTS && p.scutes > 0.3;
    if (!glowing) return;
    const core = add(bone.at, bone.up, bone.r * 0.7 + 0.6);
    s.set(core[0], core[1], R.wart);
    if (p.hot) s.set(core[0] + 0.5, core[1], R.wartHot);
  });
  s.commit();
}

export function tailTip(p: GatorPose): Point {
  return bones(p)[SEGMENTS].at;
}
