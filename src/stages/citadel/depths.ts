import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const depths: Approach = {
  roomCap: 10,
  parSeconds: 195,
  length: 1700,
  slabs: [ledge(380, 440, 104), ledge(820, 880, 92), ledge(1260, 1320, 104)],
  walls: [ledge(1060, 1080, 126)],
  arenaSlabs: [ledge(83, 143, 110), ledge(183, 241, 104)],
  packs: [
    pack(460, walker(330), flyer(360, 84), walker(390), walker(420)),
    pack(635, walker(520), flyer(550, 70), walker(580, true), flyer(605, 50)),
    pack(855, flyer(700, 86), walker(730), walker(760), flyer(790, 58), walker(815)),
    pack(1045, flyer(900, 80), walker(925), walker(955, true), flyer(985, 50), walker(1010)),
    pack(1290, walker(1110), flyer(1140, 88), walker(1170), walker(1200), flyer(1225, 56), walker(1250, true)),
    pack(1520, walker(1330), flyer(1360, 82), walker(1390), walker(1420), flyer(1450, 52), walker(1480, true)),
    pack(1680, walker(1550), flyer(1575, 78), walker(1600), walker(1625, true), flyer(1645, 58)),
  ],
  mentorSites: [site(410, 104), site(1290, 104)],
  spikes: [ledge(645, 670)],
};
