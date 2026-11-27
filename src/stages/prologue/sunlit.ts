import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const sunlit: Approach = {
  roomCap: 10,
  parSeconds: 54,
  length: 742,
  slabs: [
    ledge(105, 163, 123),
    ledge(166, 225, 83),
    ledge(252, 307, 100),
    ledge(303, 363, 61),
    ledge(369, 419, 77),
    ledge(410, 481, 112),
    ledge(518, 566, 124),
    ledge(557, 621, 89),
    ledge(635, 693, 117),
  ],
  walls: [ledge(207, 250, 116), ledge(479, 510, 123)],
  arenaSlabs: [ledge(55, 112, 111), ledge(215, 273, 116)],
  packs: [
    pack(233, walker(116), flyer(151, 106), walker(193)),
    pack(415, flyer(266, 83), walker(281), flyer(342, 49), walker(375)),
    pack(558, flyer(405, 62), walker(455), flyer(518, 101)),
    pack(702, walker(546), flyer(593, 74), walker(621), flyer(662, 101)),
    pack(732, walker(713)),
  ],
  mentorSites: [site(190, 83), site(335)],
  spikes: [ledge(566, 602)],
};
