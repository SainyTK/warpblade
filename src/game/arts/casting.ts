import type { ArtId } from "../../types/campaign";

export const ART_CASTING: Readonly<Record<ArtId, { cooldown: number; mp: number }>> = {
  mirespit: { cooldown: 2.4, mp: 11 },
  gloamlantern: { cooldown: 3, mp: 13 },
  riftlance: { cooldown: 2.6, mp: 12 },
  forgeflare: { cooldown: 3, mp: 13 },
  rimefang: { cooldown: 2.8, mp: 12 },
  galecall: { cooldown: 3.2, mp: 14 },
  sporeburst: { cooldown: 3, mp: 13 },
  inkwave: { cooldown: 2.8, mp: 12 },
};
