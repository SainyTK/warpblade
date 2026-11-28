import { CARDS_AWAY_TEXT } from "../../constants/input";
import { DRILL_WARP_ACCENT, TOUCH_BUTTONS } from "../../constants/touch";
import { DRILL_WARP_LABEL, drillActionText, heroDrill } from "../../drill";
import { heroJob } from "../../game/hero/job";
import { character } from "../../game/state";
import type { ButtonLook } from "../../types/touch";
import { hex } from "../../utils/color";
import { stickDirections, touchText } from "../../utils/controls";
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
export function touchLegend(adventure: boolean): [HTMLElement, string][] {
  const profile = adventure ? heroDrill() : undefined;
  const drillText = profile ? drillActionText(profile) : undefined;
  const drill = drillText !== undefined;
  const selection = touchSelection(profile);
  const texts = touchText(character, heroJob());
  const stick = stickDirections(character, heroJob()).map((d): [HTMLElement, string] => [
    face((c) => drawButtonFace(c, STICK_LOOK, stickIcon(d.direction), false)),
    `Stick ${d.direction}: ${adventure && d.direction === "down" ? "Drop through a ledge" : d.label}`,
  ]);
  const buttons = TOUCH_BUTTONS.map((spec): [HTMLElement, string] => {
    const look = { ...buttonLook(spec, false), ready: true, cooldown: 0, affordable: 4, charge: -1 };
    const text = texts[spec.action];
    let hint = text.hint;
    if (adventure && spec.action === "up") {
      hint = "Tap again to double jump. Jump upward along a wall or steer away to kick off.";
    }
    if (adventure && spec.action === "dash") hint = `${hint}. Jump during the dodge to keep your speed.`;
    let label = text.label;
    if (drillText) {
      hint = spec.action === "attack" ? `${drillText.attack} ${drillText.ultimate}` : (drillText[spec.action] ?? hint);
    }
    if (drillText && spec.action === "ultimate") {
      look.accent = DRILL_WARP_ACCENT;
      label = DRILL_WARP_LABEL;
      hint = drillText.warp ?? hint;
    }
    return [
      face((c) =>
        drawButtonFace(
          c,
          look,
          touchIcon(spec.action, selection, drill),
          drill ? spec.action === "attack" : spec.action === "ultimate",
        ),
      ),
      `${label}: ${hint}`,
    ];
  });
  if (!adventure) return [...stick, ...buttons];
  const leave = document.createElement("span");
  leave.className = "cap cap-wide";
  leave.textContent = "Leave";
  return [...stick, ...buttons, [leave, CARDS_AWAY_TEXT]];
}
