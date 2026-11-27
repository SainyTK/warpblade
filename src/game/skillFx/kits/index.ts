import type { ElementId } from "../../../types/campaign";
import type { ElementKit } from "../../../types/skillFx";
import { BLAZE_KIT } from "./blaze";
import { FROST_KIT } from "./frost";
import { STORM_KIT } from "./storm";
import { VENOM_KIT } from "./venom";
import { VOID_KIT } from "./void";

export { fork } from "./storm";

export const ELEMENT_KITS: Readonly<Record<ElementId, ElementKit>> = {
  blaze: BLAZE_KIT,
  frost: FROST_KIT,
  storm: STORM_KIT,
  venom: VENOM_KIT,
  void: VOID_KIT,
};
