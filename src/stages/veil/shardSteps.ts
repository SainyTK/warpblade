import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const shardSteps: Approach = {
  roomCap: 10,
  parSeconds: 135,
  length: 1800,
  slabs: [
    ledge(240, 300, 112),
    ledge(520, 590, 96),
    ledge(830, 900, 108),
    ledge(1180, 1250, 100),
    ledge(1480, 1550, 110),
  ],
  walls: [ledge(1100, 1130, 124)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(300, walker(200), flyer(230, 100), walker(260)),
    pack(490, walker(380), flyer(410, 80), walker(440), walker(455)),
    pack(690, walker(570), flyer(600, 70), walker(625), flyer(645, 96)),
    pack(890, walker(760), walker(790), flyer(815, 60), walker(840), flyer(850, 90)),
    pack(1090, walker(950), flyer(980, 70), walker(1010, true), walker(1040), flyer(1050, 50)),
    pack(1290, walker(1160), flyer(1190, 84), walker(1215), flyer(1235, 60), walker(1250)),
    pack(1500, walker(1350), flyer(1380, 70), walker(1405), walker(1430, true), flyer(1450, 50), walker(1460)),
    pack(1745, walker(1560), flyer(1590, 80), walker(1620), walker(1650), flyer(1680, 60), walker(1700, true)),
  ],
  mentorSites: [site(330), site(1310)],
  spikes: [ledge(700, 722)],
};
