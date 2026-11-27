import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const lanternWalk: Approach = {
  roomCap: 9,
  parSeconds: 130,
  length: 1870,
  slabs: [
    ledge(260, 320, 110),
    ledge(600, 670, 88),
    ledge(980, 1050, 112),
    ledge(1340, 1410, 94),
    ledge(1640, 1700, 110),
  ],
  walls: [ledge(1085, 1110, 122)],
  arenaSlabs: [ledge(44, 101, 112), ledge(131, 186, 77), ledge(217, 268, 116)],
  packs: [
    pack(230, walker(120), flyer(150, 80), walker(190)),
    pack(430, walker(300), flyer(330, 70), walker(360), flyer(390, 90)),
    pack(620, walker(480), walker(510), flyer(540, 60), walker(580)),
    pack(880, walker(680), flyer(710, 84), walker(740), walker(840, true)),
    pack(1060, walker(900), flyer(930, 70), walker(960), flyer(990, 96), walker(1030)),
    pack(1300, walker(1130), flyer(1160, 60), walker(1190), walker(1230, true), flyer(1260, 80)),
    pack(1500, walker(1340), flyer(1370, 70), walker(1400), walker(1430), flyer(1460, 90)),
    pack(1760, walker(1550), flyer(1580, 64), walker(1610), walker(1650, true), flyer(1680, 84), walker(1720)),
  ],
  mentorSites: [site(290, 110), site(1010, 112)],
  spikes: [ledge(780, 804)],
};
