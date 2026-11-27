import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const nightfall: Approach = {
  roomCap: 10,
  parSeconds: 130,
  length: 1580,
  slabs: [ledge(160, 230, 110), ledge(560, 630, 92), ledge(940, 1010, 110), ledge(1300, 1370, 96)],
  walls: [ledge(1092, 1112, 124)],
  arenaSlabs: [ledge(44, 101, 112), ledge(131, 186, 77), ledge(217, 268, 116)],
  packs: [
    pack(450, walker(320), flyer(350, 80), walker(380), flyer(410, 64)),
    pack(660, walker(500), walker(530), flyer(560, 70), walker(590), flyer(620, 90)),
    pack(870, walker(700), flyer(730, 60), walker(760, true), walker(800), flyer(830, 84)),
    pack(1080, walker(910), flyer(940, 72), walker(970), walker(1010), flyer(1040, 90)),
    pack(1330, walker(1130), flyer(1160, 64), walker(1190), walker(1230, true), flyer(1260, 80), walker(1290)),
    pack(1560, walker(1350), flyer(1380, 70), walker(1410), walker(1440, true), flyer(1470, 86), walker(1520)),
  ],
  mentorSites: [site(200, 110), site(970, 110)],
  spikes: [ledge(760, 784)],
};
