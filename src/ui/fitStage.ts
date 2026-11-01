import { W } from "../constants/stage";
import { byId } from "./dom";

/** scale the stage by a whole number when there is room for 2x or more, so every art pixel is the same size */
export function fitStage(): void {
  const stage = byId("stage");
  const wrap = stage.parentElement;
  if (!wrap) return;
  const fit = () => {
    const available = wrap.clientWidth;
    const k = Math.floor(available / W);
    stage.style.width = `${k >= 2 ? k * W : available}px`;
  };
  new ResizeObserver(fit).observe(wrap);
}
