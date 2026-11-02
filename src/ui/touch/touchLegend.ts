import { ELEMENTS } from "../../constants/combat";
import { STICK_DIRECTIONS, TOUCH_BUTTONS } from "../../constants/touch";
import { game } from "../../game/state";
import type { ButtonLook } from "../../types/touch";
import { hex } from "../../utils/color";
import { buttonLook } from "./buttonLook";
import { drawButtonFace } from "./drawButtonFace";
import { stickIcon, touchIcon } from "./icons";
import { PixelCanvas } from "./pixelCanvas";

/** every face in the legend: its size in controller art pixels, and CSS pixels per art pixel */
const LEGEND_SIZE = 17;
const LEGEND_SCALE = 2;
const STICK_LOOK: ButtonLook = {
  pressed: false,
  ready: true,
  cooldown: 0,
  accent: hex("#9a94c4"),
  affordable: 0,
  charge: -1,
};

function face(draw: (canvas: PixelCanvas) => void): HTMLElement {
  const box = document.createElement("span");
  box.className = "touch-face";
  const canvas = new PixelCanvas(LEGEND_SIZE);
  draw(canvas);
  canvas.el.style.width = `${LEGEND_SIZE * LEGEND_SCALE}px`;
  box.append(canvas.el);
  return box;
}

/** each stick direction and each button with what it does, drawn as on screen, for the Controls screen */
export function touchLegend(): [HTMLElement, string][] {
  const element = ELEMENTS[game.spell];
  const stick = STICK_DIRECTIONS.map((d): [HTMLElement, string] => [
    face((c) => drawButtonFace(c, STICK_LOOK, stickIcon(d.direction), false)),
    `Stick ${d.direction}: ${d.label}`,
  ]);
  const buttons = TOUCH_BUTTONS.map((spec): [HTMLElement, string] => {
    const look = { ...buttonLook(spec, false), ready: true, cooldown: 0, affordable: 4, charge: -1 };
    return [
      face((c) => drawButtonFace(c, look, touchIcon(spec.action, element), spec.action === "ultimate")),
      `${spec.label}: ${spec.hint}`,
    ];
  });
  return [...stick, ...buttons];
}
