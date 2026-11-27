import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES } from "../../../../game/enemies/rain/colors";
import type { Enemy } from "../../../../types/enemy";
import { mix } from "../../../../utils/color";
import { GATOR_COLORS as C } from "./colors";
import { drawHead } from "./drawHead";
import { drawFarLegs, drawNearLegs } from "./drawLegs";
import { drawTail } from "./drawTail";
import { drawScutes, drawTorso, drawWeed } from "./drawTorso";
import { gatorPose } from "./pose";
import { scaled } from "./scaled";

const canvas = detailCanvas(132, 78, 66, 64);
const art = scaled(canvas);

export function drawStormgator(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = gatorPose(e, t);
  const hide = p.scutes > 0.6 ? mix(C.hide, C.scuteLight, (p.scutes - 0.6) * 0.3) : C.hide;
  s.clear();
  drawFarLegs(art, p);
  drawTail(art, p, hide);
  drawTorso(art, p, hide);
  drawScutes(art, p);
  drawHead(art, p, hide);
  drawNearLegs(art, p, hide);
  drawWeed(art, p);
  s.outline(RAIN_FOES.outline);
  return s;
}
