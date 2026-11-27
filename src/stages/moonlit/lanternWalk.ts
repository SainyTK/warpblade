import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const lanternWalk: Approach = {
  roomCap: 9,
  parSeconds: 72,
  length: 1040,
  slabs: [
    ledge(92, 150, 116),
    ledge(170, 244, 84),
    ledge(262, 312, 52),
    ledge(336, 396, 106),
    ledge(420, 500, 74),
    ledge(520, 576, 122),
    ledge(600, 656, 90),
    ledge(666, 740, 58),
    ledge(700, 770, 118),
    ledge(830, 890, 96),
    ledge(904, 976, 66),
    ledge(940, 1010, 122),
  ],
  walls: [ledge(312, 342, 122), ledge(580, 616, 108), ledge(790, 824, 124)],
  arenaSlabs: [ledge(44, 101, 112), ledge(131, 186, 77), ledge(217, 268, 116)],
  packs: [
    pack(190, walker(116), flyer(150, 76, "lanternshade")),
    pack(440, walker(260), flyer(286, 34), walker(370), flyer(400, 70, "lanternshade")),
    pack(690, walker(520), flyer(556, 96), walker(650)),
    pack(820, flyer(690, 40, "lanternshade"), walker(752), flyer(780, 84)),
    pack(1000, walker(850, true), flyer(880, 62, "lanternshade"), walker(922), flyer(960, 40)),
    pack(1030, walker(1010), flyer(1024, 90, "lanternshade")),
  ],
  mentorSites: [site(206, 84), site(628, 90)],
  spikes: [ledge(268, 292, 52), ledge(860, 884, 96)],
};
