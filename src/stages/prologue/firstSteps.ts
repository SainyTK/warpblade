import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const firstSteps: Approach = {
  roomCap: 6,
  parSeconds: 85,
  length: 1280,
  slabs: [ledge(300, 356, 118), ledge(640, 700, 108), ledge(1010, 1066, 116)],
  walls: [ledge(512, 540, 126)],
  arenaSlabs: [ledge(55, 112, 116), ledge(208, 265, 116)],
  packs: [
    pack(280, walker(190), flyer(220, 96), walker(244)),
    pack(476, walker(382), flyer(412, 90), walker(440)),
    pack(700, walker(582), flyer(610, 80), walker(636), flyer(660, 66)),
    pack(890, walker(764, true), flyer(792, 90), walker(820), walker(852)),
    pack(1110, walker(952), flyer(982, 70), walker(1012), flyer(1044, 96), walker(1072)),
    pack(1258, walker(1142), flyer(1160, 82), walker(1178), walker(1196, true), flyer(1212, 100), walker(1226)),
  ],
  mentorSites: [site(120), site(328, 118)],
  spikes: [ledge(908, 928)],
};
