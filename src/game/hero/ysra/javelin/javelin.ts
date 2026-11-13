import { hero } from "../../../state";
import type { YsraPart } from "../part";
import { javelin, resetJavelin } from "./memory";

export { YSRA_WARP } from "./warpStyle";

/** her warp: while she hurls the glaive, where she stands is the start of the line she will warp along */
export const JAVELIN_PART: YsraPart = {
  tick: () => {
    if (hero.state !== "throw") return;
    javelin.x0 = hero.x;
    javelin.y0 = hero.y;
  },
  reset: resetJavelin,
};
