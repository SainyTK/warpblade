import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const lastWatch: Approach = {
  roomCap: 10,
  parSeconds: 230,
  length: 1800,
  slabs: [ledge(300, 360, 108), ledge(760, 820, 90), ledge(1240, 1300, 104), ledge(1560, 1620, 92)],
  walls: [],
  arenaSlabs: [],
  packs: [
    pack(280, walker(150), flyer(180, 90), walker(210), walker(240)),
    pack(505, walker(350), flyer(380, 72), walker(410, true), flyer(440, 54), walker(465)),
    pack(715, flyer(560, 84), walker(590), walker(620), flyer(650, 60), walker(675)),
    pack(955, walker(770), flyer(800, 80), walker(830, true), walker(860), flyer(890, 56), walker(915)),
    pack(1160, walker(975), flyer(1005, 86), walker(1035), walker(1065), flyer(1095, 62), walker(1120, true)),
    pack(1365, walker(1185), flyer(1215, 80), walker(1245), walker(1275, true), flyer(1300, 54), walker(1325)),
    pack(1585, walker(1395), flyer(1425, 84), walker(1455), walker(1485), flyer(1515, 58), walker(1545, true)),
    pack(1755, walker(1610), flyer(1640, 80), walker(1665), walker(1690, true), flyer(1715, 56)),
  ],
  mentorSites: [site(330, 108), site(790, 90), site(1270, 104)],
  spikes: [ledge(725, 752)],
};
