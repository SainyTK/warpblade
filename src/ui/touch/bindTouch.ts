import "./touch.css";
import { ELEMENTS } from "../../constants/combat";
import { HAPTIC_MS, TOUCH_SCALE } from "../../constants/touch";
import { game, hero } from "../../game/state";
import { haptics } from "../../services/haptics";
import type { TouchButtonAction } from "../../types/touch";
import { byId } from "../dom";
import { bindButtons } from "./bindButtons";
import { bindStick } from "./bindStick";
import { buildController } from "./buildController";
import { buttonLook } from "./buttonLook";
import type { TouchController } from "./controller";
import { drawButtonFace } from "./drawButtonFace";
import { touchIcon } from "./icons";
import { dropAll } from "./touchInput";
import { isTouchMode, watchTouchMode } from "./touchMode";

/** cooldown wedges are redrawn in steps this fine */
const COOLDOWN_STEPS = 48;

interface Bound {
  ctl: TouchController;
  pressed: () => ReadonlySet<TouchButtonAction>;
  reset: () => void;
  faces: string[];
  shown: boolean;
  chargeLevel: number;
}
let bound: Bound | null = null;

/** whole CSS pixels per controller art pixel, from the screen's short side */
const unitFor = (): number =>
  Math.min(
    TOUCH_SCALE.max,
    Math.max(TOUCH_SCALE.min, Math.floor(Math.min(innerWidth, innerHeight) / TOUCH_SCALE.shortSidePerPixel)),
  );

/** build the on-screen controller in #touch and start reading touches */
export function bindTouch(): void {
  const ctl = buildController(byId("touch"));
  let unit = unitFor();
  const resize = () => {
    unit = unitFor();
    ctl.root.style.setProperty("--px", String(unit));
  };
  resize();
  addEventListener("resize", resize);
  const resetStick = bindStick(ctl, () => unit);
  const buttons = bindButtons(ctl);
  ctl.root.addEventListener("contextmenu", (ev) => ev.preventDefault());
  document.addEventListener("gesturestart", (ev) => ev.preventDefault());
  watchTouchMode();
  bound = {
    ctl,
    pressed: buttons.pressed,
    reset: () => {
      resetStick();
      buttons.reset();
      dropAll();
    },
    faces: ctl.buttons.map(() => ""),
    shown: false,
    chargeLevel: 0,
  };
}

/** show the controller for touch play while `fighting` (no menu or pick open), and keep the button faces in step */
export function syncTouch(fighting: boolean): void {
  if (!bound) return;
  const b = bound;
  const show = fighting && isTouchMode();
  if (show !== b.shown) {
    b.shown = show;
    b.ctl.root.hidden = !show;
    document.documentElement.classList.toggle("touch-play", show);
    if (!show) b.reset();
  }
  if (!show) return;
  const level = hero.state === "charge" ? hero.chargeLevel : 0;
  if (level > b.chargeLevel) haptics.pulse(HAPTIC_MS.chargeLevel);
  b.chargeLevel = level;
  const pressed = b.pressed();
  const element = ELEMENTS[game.spell];
  b.ctl.buttons.forEach((button, i) => {
    const look = buttonLook(button.spec, pressed.has(button.spec.action));
    look.cooldown = Math.ceil(look.cooldown * COOLDOWN_STEPS) / COOLDOWN_STEPS;
    const key = `${element}|${Object.values(look).join("|")}`;
    if (key === b.faces[i]) return;
    b.faces[i] = key;
    drawButtonFace(button.face, look, touchIcon(button.spec.action, element), button.spec.action === "ultimate");
  });
}
