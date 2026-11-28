import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const leechFen: Approach = {
  roomCap: 9,
  parSeconds: 136,
  length: 1780,
  slabs: [ledge(170, 234, 96), ledge(600, 664, 90), ledge(1010, 1074, 100), ledge(1440, 1504, 92)],
  walls: [ledge(820, 848, 124)],
  arenaSlabs: [ledge(46, 106, 118), ledge(132, 188, 80), ledge(214, 274, 118)],
  packs: [
    pack(244, walker(140), flyer(176, 78), walker(204)),
    pack(452, walker(320), flyer(350, 70), walker(380, false, "bogleech"), walker(410)),
    pack(660, walker(520), flyer(552, 64), walker(580), flyer(606, 90), walker(622)),
    pack(800, walker(700), flyer(722, 76), walker(746, true), walker(766)),
    pack(1060, walker(900), flyer(926, 84), walker(952), walker(978), flyer(1004, 60), walker(1022)),
    pack(1250, walker(1110), flyer(1136, 72), walker(1160, true), walker(1186, false, "bogleech"), flyer(1210, 94)),
    pack(1470, walker(1310), flyer(1336, 68), walker(1362), flyer(1388, 92), walker(1410), walker(1430)),
    pack(1700, walker(1520), flyer(1546, 76), walker(1572, true), walker(1600), flyer(1626, 58), walker(1660)),
  ],
  mentorSites: [site(276), site(1128)],
  spikes: [ledge(882, 904)],
};
