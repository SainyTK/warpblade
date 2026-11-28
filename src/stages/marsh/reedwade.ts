import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const reedwade: Approach = {
  roomCap: 10,
  parSeconds: 135,
  length: 1740,
  slabs: [ledge(150, 214, 100), ledge(540, 604, 96), ledge(930, 994, 100), ledge(1340, 1404, 94)],
  walls: [ledge(1262, 1290, 126)],
  arenaSlabs: [ledge(46, 106, 120), ledge(130, 190, 84), ledge(214, 274, 118)],
  packs: [
    pack(236, walker(140), flyer(172, 84), walker(196)),
    pack(436, walker(316), flyer(344, 90), walker(372), walker(396)),
    pack(640, walker(508), flyer(540, 72), walker(568), flyer(600, 96)),
    pack(868, walker(716), flyer(746, 80), walker(776, true), walker(806), flyer(828, 60)),
    pack(1048, walker(908), flyer(934, 72), walker(960), walker(986), flyer(1008, 96)),
    pack(1238, walker(1096), flyer(1122, 84), walker(1148), walker(1176, true), flyer(1198, 64)),
    pack(1470, walker(1312), flyer(1336, 70), walker(1360), flyer(1384, 96), walker(1408), walker(1430)),
    pack(1696, walker(1532), flyer(1552, 80), walker(1578, true), walker(1602), flyer(1626, 62), walker(1650)),
  ],
  mentorSites: [site(468), site(1066)],
  spikes: [ledge(672, 694)],
};
