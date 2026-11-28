import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const brokenStair: Approach = {
  roomCap: 9,
  parSeconds: 130,
  length: 1900,
  slabs: [
    ledge(250, 320, 110),
    ledge(410, 470, 104),
    ledge(800, 860, 106),
    ledge(1020, 1080, 100),
    ledge(1420, 1480, 104),
    ledge(1660, 1720, 108),
  ],
  walls: [ledge(1130, 1160, 122)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(310, walker(200), flyer(230, 90), walker(265)),
    pack(510, walker(390), flyer(440, 65), walker(450), flyer(470, 96)),
    pack(710, walker(590), walker(620), flyer(645, 94), walker(670)),
    pack(910, walker(780), flyer(830, 68), walker(830), flyer(855, 90), walker(870)),
    pack(1110, walker(980), flyer(1005, 96), walker(1030, true), walker(1055), flyer(1050, 64)),
    pack(1310, walker(1180), flyer(1205, 96), walker(1230), walker(1250, false, "riftknight"), flyer(1270, 92)),
    pack(1520, walker(1380), walker(1405), flyer(1430, 94), walker(1455, true), flyer(1440, 66), walker(1480)),
    pack(1760, walker(1590), flyer(1620, 98), walker(1650), walker(1680), flyer(1700, 64), walker(1720, true)),
  ],
  mentorSites: [site(340), site(1340)],
  spikes: [ledge(730, 752)],
};
