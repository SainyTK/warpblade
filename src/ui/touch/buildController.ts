import { CLUSTER_ANCHOR, STICK, TOUCH_BUTTONS } from "../../constants/touch";
import type { TouchController } from "./controller";
import { drawStickBase, drawStickKnob } from "./drawStick";
import { PixelCanvas } from "./pixelCanvas";

function div(className: string, parent: HTMLElement): HTMLElement {
  const el = document.createElement("div");
  el.className = className;
  parent.append(el);
  return el;
}

/** where a button's center sits, art pixels in from the bottom right corner, from its angle and reach */
function buttonCenter(angle: number, reach: number): [number, number] {
  const a = (angle * Math.PI) / 180;
  return [CLUSTER_ANCHOR.right - Math.cos(a) * reach, CLUSTER_ANCHOR.bottom + Math.sin(a) * reach];
}

/** build the stick and the action buttons inside the mount point; the buttons only show, the two zones take touches */
export function buildController(root: HTMLElement): TouchController {
  root.classList.add("touch");
  root.setAttribute("aria-hidden", "true");
  root.replaceChildren();
  const stickZone = div("touch-zone touch-zone-stick", root);
  const buttonZone = div("touch-zone touch-zone-buttons", root);

  const stick = div("touch-stick", root);
  stick.style.setProperty("--rest-x", String(STICK.rest.left));
  stick.style.setProperty("--rest-y", String(STICK.rest.bottom));
  stick.style.setProperty("--d", String(STICK.base));
  const base = new PixelCanvas(STICK.base);
  drawStickBase(base);
  const knob = new PixelCanvas(STICK.knob);
  drawStickKnob(knob, false);
  knob.el.className = "touch-knob";
  knob.el.style.setProperty("--d", String(STICK.knob));
  stick.append(base.el, knob.el);

  const buttons = TOUCH_BUTTONS.map((spec) => {
    const el = div("touch-button", root);
    const [cx, cy] = buttonCenter(spec.angle, spec.reach);
    el.dataset.action = spec.action;
    el.style.setProperty("--cx", String(cx));
    el.style.setProperty("--cy", String(cy));
    el.style.setProperty("--d", String(spec.size));
    const face = new PixelCanvas(spec.size);
    el.append(face.el);
    return { spec, el, face };
  });
  return { root, stickZone, buttonZone, stick, knob, buttons };
}
