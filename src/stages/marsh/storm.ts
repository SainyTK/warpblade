import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const storm: Approach = {
  roomCap: 10,
  parSeconds: 125,
  length: 1640,
  slabs: [ledge(118, 182, 104), ledge(560, 624, 96), ledge(960, 1024, 100), ledge(1330, 1394, 92)],
  walls: [ledge(1214, 1242, 126)],
  arenaSlabs: [ledge(45, 107, 121), ledge(132, 190, 82), ledge(224, 276, 119)],
  packs: [
    pack(462, walker(330), flyer(356, 80), walker(382), walker(420)),
    pack(660, walker(520), flyer(548, 70), walker(576), flyer(604, 94), walker(622)),
    pack(850, walker(700), flyer(726, 78), walker(752, true), walker(780), flyer(806, 60)),
    pack(1060, walker(900), flyer(926, 84), walker(952), walker(978), flyer(1004, 66), walker(1020)),
    pack(1200, walker(1100), flyer(1124, 76), walker(1146, true), walker(1166)),
    pack(1426, walker(1270), flyer(1294, 70), walker(1318), flyer(1342, 94), walker(1366), walker(1386)),
    pack(1590, walker(1466), flyer(1486, 80), walker(1510, true), walker(1532), flyer(1550, 62)),
  ],
  mentorSites: [site(236), site(486)],
  spikes: [ledge(642, 664)],
};
