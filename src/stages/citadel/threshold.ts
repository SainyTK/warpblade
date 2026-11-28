import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const threshold: Approach = {
  roomCap: 10,
  parSeconds: 150,
  length: 1640,
  slabs: [ledge(240, 300, 112), ledge(700, 760, 98), ledge(1180, 1240, 108), ledge(1460, 1520, 94)],
  walls: [ledge(930, 950, 126)],
  arenaSlabs: [ledge(44, 99, 113), ledge(223, 275, 113)],
  packs: [
    pack(250, walker(150), flyer(180, 92), walker(210)),
    pack(460, walker(330), flyer(360, 74), walker(390), walker(420)),
    pack(700, flyer(545, 80), walker(605), walker(635), flyer(665, 62)),
    pack(910, walker(760), flyer(790, 88), walker(820, true), walker(850), flyer(880, 66)),
    pack(1130, walker(970), flyer(1000, 76), walker(1030), walker(1060), flyer(1090, 56)),
    pack(1380, walker(1190), flyer(1220, 86), walker(1250), walker(1280, true), flyer(1310, 62), walker(1340)),
    pack(1600, walker(1410), flyer(1440, 80), walker(1470), walker(1500), flyer(1530, 58), walker(1560, true)),
  ],
  mentorSites: [site(270, 112), site(1210, 108)],
  spikes: [ledge(560, 590)],
};
