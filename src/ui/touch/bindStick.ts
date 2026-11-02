import { HAPTIC_MS, STICK } from "../../constants/touch";
import { sfx } from "../../services/audio";
import { haptics } from "../../services/haptics";
import type { StickInput } from "../../types/touch";
import { readStick, STICK_IDLE } from "../../utils/stick";
import type { TouchController } from "./controller";
import { drawStickKnob } from "./drawStick";
import { drop, hold, tap } from "./touchInput";

const SOURCE = "stick";

/** hold and drop the directions that changed between two readings; a new run is one press */
function applyStick(next: StickInput, last: StickInput): void {
  const sides = [
    ["left", next.dir < 0, last.dir < 0],
    ["right", next.dir > 0, last.dir > 0],
    ["up", next.up, last.up],
    ["down", next.down, last.down],
  ] as const;
  for (const [action, on, was] of sides) {
    if (on && !was) hold(SOURCE, action);
    if (!on && was) drop(SOURCE, action);
  }
  if (next.run && !last.run) {
    tap("run");
    haptics.pulse(HAPTIC_MS.run);
  }
}

/**
 * The floating stick: it appears where the left thumb lands, reads the push as walk, run, up and down,
 * and drags along when the thumb goes past its reach. Returns a reset for when the controller hides.
 */
export function bindStick(ctl: TouchController, unit: () => number): () => void {
  let pointer: number | null = null;
  let center = { x: 0, y: 0 };
  let state = STICK_IDLE;

  const setRunLook = (running: boolean, was: boolean) => {
    if (running !== was) drawStickKnob(ctl.knob, running);
  };
  const reset = () => {
    applyStick(STICK_IDLE, state);
    setRunLook(false, state.run);
    state = STICK_IDLE;
    pointer = null;
    ctl.stick.classList.remove("active");
    ctl.stick.style.left = "";
    ctl.stick.style.top = "";
    ctl.knob.el.style.transform = "";
  };
  const place = () => {
    ctl.stick.style.left = `${center.x}px`;
    ctl.stick.style.top = `${center.y}px`;
  };
  const follow = (x: number, y: number) => {
    const reach = STICK.reach * unit();
    let dx = x - center.x;
    let dy = y - center.y;
    const length = Math.hypot(dx, dy);
    if (length > reach) {
      center = { x: x - (dx / length) * reach, y: y - (dy / length) * reach };
      dx = x - center.x;
      dy = y - center.y;
      place();
    }
    ctl.knob.el.style.transform = `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`;
    const next = readStick(dx / reach, dy / reach, state);
    applyStick(next, state);
    setRunLook(next.run, state.run);
    state = next;
  };

  const zone = ctl.stickZone;
  zone.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    if (pointer !== null) return;
    sfx.start();
    pointer = ev.pointerId;
    zone.setPointerCapture(ev.pointerId);
    const box = zone.getBoundingClientRect();
    const r = (STICK.base / 2) * unit();
    center = {
      x: Math.min(Math.max(ev.clientX, box.left + r), box.right - r),
      y: Math.min(Math.max(ev.clientY, box.top + r), box.bottom - r),
    };
    place();
    ctl.stick.classList.add("active");
    follow(ev.clientX, ev.clientY);
  });
  zone.addEventListener("pointermove", (ev) => {
    if (ev.pointerId === pointer) follow(ev.clientX, ev.clientY);
  });
  const end = (ev: PointerEvent) => {
    if (ev.pointerId === pointer) reset();
  };
  zone.addEventListener("pointerup", end);
  zone.addEventListener("pointercancel", end);
  return reset;
}
