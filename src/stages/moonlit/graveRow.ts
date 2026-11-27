import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const graveRow: Approach = {
  roomCap: 10,
  parSeconds: 135,
  length: 1760,
  slabs: [ledge(300, 360, 112), ledge(640, 700, 96), ledge(1000, 1064, 108), ledge(1380, 1440, 90)],
  walls: [ledge(820, 850, 124)],
  arenaSlabs: [ledge(44, 101, 112), ledge(131, 186, 77), ledge(217, 268, 116)],
  packs: [
    pack(220, walker(120), flyer(150, 90), walker(180)),
    pack(420, walker(280), flyer(320, 96), walker(350), walker(380)),
    pack(610, flyer(470, 70), walker(500), walker(540), flyer(570, 84)),
    pack(800, walker(660), flyer(690, 80), walker(720), walker(760, true)),
    pack(1040, walker(880), flyer(910, 70), walker(940), flyer(970, 90), walker(1000)),
    pack(1270, walker(1090), flyer(1120, 76), walker(1150), walker(1210), flyer(1230, 60)),
    pack(1470, walker(1300), flyer(1330, 60), walker(1360), walker(1400, true), flyer(1430, 86)),
    pack(1720, walker(1510), flyer(1540, 70), walker(1570), walker(1610), flyer(1640, 84), walker(1680, true)),
  ],
  mentorSites: [site(330, 112), site(1030, 108)],
  spikes: [ledge(1180, 1204)],
};
