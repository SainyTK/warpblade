import { HEARTHFIRE } from "../../../../constants/ysra/heat";
import { FLARE } from "../../../../constants/ysra/rites";
import type { RiteId } from "../../../../types/ysra/pyre";
import { hasPerk } from "../../../progress";
import { mend } from "./mend";

/** the healing a rite brings: Flare's own, and Hearthfire's on every rite, in one burst of motes */
export function healFromRite(id: RiteId): void {
  const share = (id === "flare" ? FLARE.heal : 0) + (hasPerk("hearthfire") ? HEARTHFIRE.heal : 0);
  if (share > 0) mend(share);
}
