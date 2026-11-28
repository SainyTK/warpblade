import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const shardSteps: Approach = {
  roomCap: 10,
  parSeconds: 135,
  length: 1800,
  slabs: [
    ledge(240, 300, 112),
    ledge(590, 650, 108),
    ledge(990, 1060, 104),
    ledge(1380, 1450, 104),
    ledge(1600, 1670, 108),
  ],
  walls: [ledge(1100, 1130, 124)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(300, walker(200), flyer(230, 100), walker(260)),
    pack(490, walker(380), flyer(410, 96), walker(440), walker(455)),
    pack(690, walker(570), flyer(600, 96), walker(625), flyer(640, 66)),
    pack(890, walker(760), walker(790), flyer(815, 92), walker(840), flyer(850, 90)),
    pack(1090, walker(950), flyer(980, 96), walker(1010, true), walker(1040), flyer(1030, 68)),
    pack(1290, walker(1160), flyer(1190, 88), walker(1215), flyer(1235, 100), walker(1250)),
    pack(1500, walker(1350), flyer(1380, 92), walker(1405), walker(1430, true), flyer(1420, 65), walker(1460)),
    pack(1745, walker(1560), flyer(1590, 96), walker(1620), walker(1650), flyer(1650, 67), walker(1700, true)),
  ],
  mentorSites: [site(330), site(1310)],
  spikes: [ledge(700, 722)],
};
