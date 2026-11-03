import type { PickReason } from "../../types/progress";

/** the pick dialog's header: the level reached or the wave cleared */
export const pickTitle = (reason: PickReason): string =>
  reason.kind === "wave" ? `Wave ${reason.wave} clear` : `Level ${reason.level}`;
