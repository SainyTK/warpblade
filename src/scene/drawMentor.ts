import { W } from "../constants/stage";
import { castShadow, fleck, glow, hairline, place, polygon, px } from "../engine/frame";
import { nearbyMentor, stageMentor } from "../game/adventure";
import { rgb } from "../utils/color";

const INK = rgb(26, 23, 37);
const CLOAK = rgb(55, 103, 103);
const CLOAK_EDGE = rgb(105, 160, 144);
const LEATHER = rgb(107, 65, 52);
const FACE = rgb(212, 166, 114);
const GOLD = rgb(245, 195, 101);
const SPARK = rgb(255, 235, 180);

const OUTLINE = [
  [-11, -1],
  [-9, -14],
  [-6, -20],
  [-7, -25],
  [-3, -31],
  [4, -32],
  [9, -26],
  [8, -19],
  [11, -11],
  [9, 0],
] as const;
const ROBE = [
  [-9, -2],
  [-7, -14],
  [-3, -20],
  [4, -20],
  [8, -14],
  [8, -2],
  [2, -4],
  [-3, -1],
] as const;
const HOOD = [
  [-5, -19],
  [-6, -25],
  [-3, -29],
  [3, -30],
  [7, -25],
  [6, -20],
  [2, -18],
] as const;
const MASK = [
  [-2, -23],
  [3, -26],
  [6, -25],
  [5, -21],
  [1, -19],
] as const;

export function drawMentor(cameraX: number, time: number): void {
  const mentor = stageMentor();
  if (!mentor || mentor.x < cameraX - 22 || mentor.x > cameraX + W + 22) return;
  castShadow(mentor.x, mentor.y, 12, 2.5, 0.45);
  place(mentor.x, mentor.y);
  polygon(OUTLINE, INK);
  polygon(ROBE, CLOAK);
  polygon(HOOD, CLOAK_EDGE);
  polygon(MASK, LEATHER);
  hairline(1, -23, 5, -24, FACE);
  px(3, -24, SPARK);
  hairline(-6, -14, -8, -4, CLOAK_EDGE);
  hairline(-3, -16, 5, -14, GOLD);
  hairline(10, -22, 12, 0, INK);
  hairline(11, -22, 13, -1, LEATHER);
  px(10, -23, GOLD);
  px(11, -24, SPARK);
  glow(11, -24, 12, GOLD, 0.26 + Math.sin(time * 5) * 0.05);
  if (!nearbyMentor()) drawMarker(time);
}

function drawMarker(time: number): void {
  const y = -39 + Math.sin(time * 3) * 1.4;
  polygon(
    [
      [0, y - 3],
      [3, y],
      [0, y + 3],
      [-3, y],
    ],
    INK,
  );
  polygon(
    [
      [0, y - 2],
      [2, y],
      [0, y + 2],
      [-2, y],
    ],
    GOLD,
  );
  fleck(0, y, SPARK);
}
