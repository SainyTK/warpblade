import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const sunlit: Approach = {
  roomCap: 10,
  parSeconds: 100,
  length: 1340,
  slabs: [ledge(170, 226, 116), ledge(640, 700, 112), ledge(1060, 1118, 102)],
  walls: [ledge(470, 498, 124)],
  arenaSlabs: [ledge(55, 112, 111), ledge(215, 273, 116)],
  packs: [
    pack(440, walker(340), flyer(370, 90), walker(400)),
    pack(660, walker(530), flyer(560, 80), walker(590), flyer(620, 100)),
    pack(850, walker(720, true), flyer(750, 70), walker(780), walker(810)),
    pack(1070, walker(910), flyer(940, 90), walker(970), flyer(1000, 60), walker(1030)),
    pack(1284, walker(1100), flyer(1124, 96), walker(1150, true), flyer(1180, 70), walker(1210), walker(1240)),
  ],
  mentorSites: [site(110), site(670, 112)],
  spikes: [ledge(872, 894)],
};
