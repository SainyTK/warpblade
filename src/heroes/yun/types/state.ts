import type { YunAbility } from "./ability";

/** what Yun's kit remembers between presses; each co-op seat keeps its own, and a guest's HUD reads it */
export interface YunState {
  /** spirit swords held, 0 to `SPIRIT.most` */
  swords: number;
  /** seconds until the next sword comes back while he holds fewer than `SPIRIT.rest` */
  regen: number;
  /** seconds each held sword stays away on an echo thrust, by its place in the fan behind him */
  away: number[];
  /** seconds before each ability can be cast again, and the full length of each one's current wait */
  wait: Record<YunAbility, number>;
  waitFull: Record<YunAbility, number>;
  /** the ability of the cast under way and whether it is the wide form */
  castAbility: YunAbility;
  castWide: boolean;
  /** the tassel's swing from straight down, radians, its speed, and where the pommel was last frame */
  tassel: number;
  tasselSpeed: number;
  pommelX: number;
  pommelVx: number;
}
