import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const breach: Approach = {
  roomCap: 14,
  parSeconds: 195,
  length: 1870,
  slabs: [ledge(260, 320, 110), ledge(660, 720, 92), ledge(1100, 1160, 104), ledge(1540, 1600, 96)],
  walls: [ledge(1300, 1320, 124)],
  arenaSlabs: [ledge(44, 99, 113), ledge(223, 275, 113)],
  packs: [
    pack(275, walker(150), flyer(180, 90), walker(210), walker(235)),
    pack(470, walker(340), flyer(370, 70), walker(400), walker(430)),
    pack(690, flyer(530, 82), walker(560), walker(590, true), flyer(620, 58), walker(645)),
    pack(870, walker(725), flyer(755, 86), walker(785), walker(810), flyer(835, 60)),
    pack(1125, walker(940), flyer(970, 74), walker(1000), walker(1030, true), flyer(1060, 54), walker(1085)),
    pack(1290, walker(1150), flyer(1180, 88), walker(1210), walker(1235), flyer(1255, 62)),
    pack(1545, walker(1360), flyer(1390, 80), walker(1420), walker(1450, true), flyer(1480, 56), walker(1505)),
    pack(1755, walker(1570), flyer(1600, 84), walker(1630), walker(1660), flyer(1690, 60), walker(1715, true)),
  ],
  mentorSites: [site(290, 110), site(1130, 104)],
  spikes: [ledge(880, 910)],
};
