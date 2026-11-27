import { hex } from "../../../../utils/color";

export const SNAPPER = {
  shellDeep: hex("#141610"),
  shellDark: hex("#262819"),
  shell: hex("#3e3f27"),
  shellLight: hex("#5f5f3a"),
  shellRim: hex("#8e8c58"),
  seam: hex("#17140f"),
  skinDeep: hex("#151b16"),
  skinDark: hex("#232c24"),
  skin: hex("#384536"),
  skinLight: hex("#5a6a50"),
  skinRim: hex("#8ea07c"),
  plate: hex("#6e6644"),
  plateLight: hex("#9c9060"),
  plateDark: hex("#433d28"),
  beak: hex("#7c6c4a"),
  beakLight: hex("#c2ac7c"),
  beakDark: hex("#3e3424"),
  mouth: hex("#3a1420"),
  claw: hex("#b8a888"),
} as const;

export const SNAPPER_HITS = { snap: 14, slam: 12, touch: 7 } as const;
