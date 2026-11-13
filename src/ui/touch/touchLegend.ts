import { STICK_DIRECTIONS, TOUCH_BUTTONS, TOUCH_TEXT } from "../../constants/touch";
import { character } from "../../game/state";
import type { ButtonLook } from "../../types/touch";
import { hex } from "../../utils/color";
import { buttonLook } from "./buttonLook";
import { drawButtonFace } from "./drawButtonFace";
import { stickIcon, touchIcon } from "./icons";
import { PixelCanvas } from "./pixelCanvas";
import { touchSelection } from "./selection";

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
  costShare: 0,
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

/** each stick direction and each button with what it does for the chosen hero, drawn as on screen, for the Controls screen */
export function touchLegend(): [HTMLElement, string][] {
  const selection = touchSelection();
  const texts = TOUCH_TEXT[character.kit];
  const stick = STICK_DIRECTIONS[character.kit].map((d): [HTMLElement, string] => [
    face((c) => drawButtonFace(c, STICK_LOOK, stickIcon(d.direction), false)),
    `Stick ${d.direction}: ${d.label}`,
  ]);
  const buttons = TOUCH_BUTTONS.map((spec): [HTMLElement, string] => {
    const look = { ...buttonLook(spec, false), ready: true, cooldown: 0, affordable: 4, charge: -1 };
    return [
      face((c) => drawButtonFace(c, look, touchIcon(spec.action, selection), spec.action === "ultimate")),
      `${texts[spec.action].label}: ${texts[spec.action].hint}`,
    ];
  });
  return [...stick, ...buttons];
}
