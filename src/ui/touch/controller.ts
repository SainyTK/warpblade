import type { TouchButtonSpec } from "../../types/touch";
import type { PixelCanvas } from "./pixelCanvas";

/** One action button on screen. */
export interface TouchButton {
  spec: TouchButtonSpec;
  el: HTMLElement;
  face: PixelCanvas;
}

/** The controller's elements, built once from the layout in constants/touch. */
export interface TouchController {
  root: HTMLElement;
  stickZone: HTMLElement;
  buttonZone: HTMLElement;
  stick: HTMLElement;
  knob: PixelCanvas;
  buttons: TouchButton[];
}
