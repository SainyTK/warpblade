import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const shardSteps: Approach = {
  roomCap: 10,
  parSeconds: 75,
  length: 1000,
  slabs: [
    ledge(98, 156, 120),
    ledge(176, 230, 88),
    ledge(244, 300, 58),
    ledge(318, 380, 104),
    ledge(396, 456, 72),
    ledge(470, 530, 122),
    ledge(520, 584, 46),
    ledge(600, 660, 92),
    ledge(676, 736, 120),
    ledge(728, 790, 64),
    ledge(840, 900, 104),
    ledge(890, 954, 70),
  ],
  walls: [ledge(282, 312, 124), ledge(548, 584, 104), ledge(800, 834, 122)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(254, walker(116), flyer(150, 98), walker(214)),
    pack(412, flyer(262, 36), walker(340), flyer(372, 80)),
    pack(600, walker(420), flyer(470, 54), walker(512), flyer(560, 28)),
    pack(796, walker(630), flyer(668, 70), walker(710), flyer(756, 44)),
    pack(990, walker(860, true), flyer(910, 50), walker(966)),
  ],
  mentorSites: [site(204, 88), site(426, 72)],
  spikes: [ledge(380, 408), ledge(612, 640, 92)],
};
