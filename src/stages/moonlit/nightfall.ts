import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const nightfall: Approach = {
  roomCap: 10,
  parSeconds: 73,
  length: 880,
  slabs: [
    ledge(113, 176, 120),
    ledge(177, 230, 91),
    ledge(230, 291, 57),
    ledge(313, 384, 79),
    ledge(317, 387, 118),
    ledge(399, 466, 112),
    ledge(472, 544, 123),
    ledge(543, 604, 84),
    ledge(608, 675, 46),
    ledge(692, 731, 76),
    ledge(718, 789, 113),
    ledge(800, 852, 80),
  ],
  walls: [ledge(266, 310, 100), ledge(624, 673, 129)],
  arenaSlabs: [ledge(44, 101, 112), ledge(131, 186, 77), ledge(217, 268, 116)],
  packs: [
    pack(275, walker(105), walker(151), flyer(194, 77), walker(235)),
    pack(424, flyer(279, 43), flyer(345, 63), walker(384)),
    pack(612, walker(465), flyer(499, 107), walker(524), flyer(572, 70)),
    pack(760, walker(597), flyer(652, 34), walker(704, true), flyer(720, 60)),
    pack(870, flyer(767, 98), walker(799), flyer(836, 56, "lanternshade"), walker(866)),
  ],
  mentorSites: [site(204, 91), site(439, 112)],
  spikes: [ledge(333, 371), ledge(552, 577, 84)],
};
