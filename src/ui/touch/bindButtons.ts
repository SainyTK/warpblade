import { HAPTIC_MS } from "../../constants/touch";
import { sfx } from "../../services/audio";
import { haptics } from "../../services/haptics";
import type { TouchButtonAction } from "../../types/touch";
import type { TouchButton, TouchController } from "./controller";
import { drop, hold } from "./touchInput";

/** a touch counts for a button this far past its rim, as a part of its radius */
const HIT_SLOP = 1.2;

interface Target {
  action: TouchButtonAction;
  x: number;
  y: number;
  r: number;
}

/** the button nearest a point, within its slop, or null */
function hitTest(targets: readonly Target[], x: number, y: number): TouchButtonAction | null {
  let best: TouchButtonAction | null = null;
  let bestScore = HIT_SLOP;
  for (const t of targets) {
    const score = Math.hypot(x - t.x, y - t.y) / t.r;
    if (score < bestScore) {
      best = t.action;
      bestScore = score;
    }
  }
  return best;
}

const targetOf = (b: TouchButton): Target => {
  const box = b.el.getBoundingClientRect();
  return { action: b.spec.action, x: box.left + box.width / 2, y: box.top + box.height / 2, r: box.width / 2 };
};

/**
 * Action buttons with multi-touch: each finger holds the button under it, and a finger sliding onto another button
 * lets go of the first and holds the new one. Returns the buttons held now, for drawing, and a reset.
 */
export function bindButtons(ctl: TouchController): {
  pressed: () => ReadonlySet<TouchButtonAction>;
  reset: () => void;
} {
  const fingers = new Map<number, TouchButtonAction | null>();
  const pressed = new Set<TouchButtonAction>();
  let targets: Target[] = [];

  const source = (pointerId: number) => `finger${pointerId}`;
  const sync = () => {
    pressed.clear();
    for (const action of fingers.values()) if (action) pressed.add(action);
  };
  const move = (pointerId: number, x: number, y: number, first: boolean) => {
    const before = fingers.get(pointerId) ?? null;
    const now = hitTest(targets, x, y);
    if (now === before && !first) return;
    if (before) drop(source(pointerId), before);
    if (now) {
      hold(source(pointerId), now);
      haptics.pulse(first ? HAPTIC_MS.press : HAPTIC_MS.slide);
    }
    fingers.set(pointerId, now);
    sync();
  };
  const lift = (pointerId: number) => {
    const action = fingers.get(pointerId);
    if (action) drop(source(pointerId), action);
    fingers.delete(pointerId);
    sync();
  };

  const zone = ctl.buttonZone;
  zone.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    sfx.start();
    zone.setPointerCapture(ev.pointerId);
    targets = ctl.buttons.map(targetOf);
    move(ev.pointerId, ev.clientX, ev.clientY, true);
  });
  zone.addEventListener("pointermove", (ev) => {
    if (fingers.has(ev.pointerId)) move(ev.pointerId, ev.clientX, ev.clientY, false);
  });
  const end = (ev: PointerEvent) => lift(ev.pointerId);
  zone.addEventListener("pointerup", end);
  zone.addEventListener("pointercancel", end);
  return {
    pressed: () => pressed,
    reset: () => {
      for (const id of [...fingers.keys()]) lift(id);
    },
  };
}
