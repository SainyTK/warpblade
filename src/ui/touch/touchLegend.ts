import { TOUCH_BUTTONS } from "../../constants/touch";
import { heroJob } from "../../game/hero/job";
import { character } from "../../game/state";
import { CERISE_DRILL_TEXT, isCerise } from "../../heroes";
import { DRILL_ACTION_TEXT, isBaseKael } from "../../kaelDrill";
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
  const drill = adventure && isBaseKael();
  const cerise = adventure && isCerise();
  const selection = touchSelection(drill);
  const texts = touchText(character, heroJob());
  const stick = stickDirections(character, heroJob()).map((d): [HTMLElement, string] => [
    face((c) => drawButtonFace(c, STICK_LOOK, stickIcon(d.direction), false)),
    `Stick ${d.direction}: ${adventure && d.direction === "down" ? "Drop through a ledge" : d.label}`,
  ]);
  const buttons = TOUCH_BUTTONS.filter(({ action }) => !(drill || cerise) || action !== "ultimate").map(
    (spec): [HTMLElement, string] => {
      const look = { ...buttonLook(spec, false), ready: true, cooldown: 0, affordable: 4, charge: -1 };
      const text = texts[spec.action];
      let hint = text.hint;
      if (adventure && spec.action === "up") {
        hint = "Tap again to double jump. Jump upward along a wall or steer away to kick off.";
      }
      if (adventure && spec.action === "dash") hint = `${hint}. Jump during the dodge to keep your speed.`;
      if (drill) {
        hint =
          spec.action === "attack"
            ? `${DRILL_ACTION_TEXT.attack} ${DRILL_ACTION_TEXT.ultimate}`
            : (DRILL_ACTION_TEXT[spec.action as keyof typeof DRILL_ACTION_TEXT] ?? hint);
      }
      if (cerise) {
        hint =
          spec.action === "attack"
            ? `${CERISE_DRILL_TEXT.attack} ${CERISE_DRILL_TEXT.ultimate}`
            : (CERISE_DRILL_TEXT[spec.action] ?? hint);
      }
      return [
        face((c) =>
          drawButtonFace(
            c,
            look,
            touchIcon(spec.action, selection),
            drill || cerise ? spec.action === "attack" : spec.action === "ultimate",
          ),
        ),
        `${text.label}: ${hint}`,
      ];
    },
  );
  if (!adventure) return [...stick, ...buttons];
  const talk = document.createElement("span");
  talk.className = "cap";
  talk.textContent = "Talk";
  return [...stick, ...buttons, [talk, "Tap Talk by a mentor to spend skill points."]];
}
