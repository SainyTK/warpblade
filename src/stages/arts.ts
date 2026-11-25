import type { ArtDef } from "../types/art";
import type { ArtId } from "../types/campaign";
import { inkwave } from "./archive/art";
import { sporeburst } from "./blight/art";
import { forgeflare } from "./foundry/art";
import { rimefang } from "./glacier/art";
import { mirespit } from "./marsh/art";
import { gloamlantern } from "./moonlit/art";
import { galecall } from "./skyway/art";
import { riftlance } from "./veil/art";

export const ARTS: Readonly<Record<ArtId, ArtDef>> = {
  mirespit,
  gloamlantern,
  riftlance,
  forgeflare,
  rimefang,
  galecall,
  sporeburst,
  inkwave,
};
