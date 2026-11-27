import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const lastWatch: Approach = {
  roomCap: 10,
  parSeconds: 130,
  length: 997,
  slabs: [
    ledge(107, 161, 121),
    ledge(152, 207, 91),
    ledge(216, 267, 70),
    ledge(280, 325, 48),
    ledge(291, 357, 104),
    ledge(360, 416, 62),
    ledge(432, 486, 103),
    ledge(540, 603, 49),
    ledge(546, 610, 119),
    ledge(615, 664, 87),
    ledge(670, 737, 54),
    ledge(704, 756, 116),
    ledge(763, 827, 80),
    ledge(836, 891, 44),
    ledge(850, 910, 114),
    ledge(914, 965, 91),
  ],
  walls: [ledge(182, 211, 126), ledge(488, 531, 74), ledge(805, 846, 125)],
  arenaSlabs: [],
  packs: [
    pack(292, walker(113), flyer(149, 104), flyer(245, 55), walker(252)),
    pack(446, flyer(307, 34), walker(354), flyer(387, 47), walker(406)),
    pack(616, flyer(462, 88), flyer(565, 35), walker(576)),
    pack(808, flyer(640, 70), walker(653, true), flyer(703, 40), walker(768)),
    pack(930, flyer(792, 65), flyer(864, 31), walker(890, true)),
    pack(987, walker(964)),
  ],
  mentorSites: [site(241, 70), site(342, 104), site(511, 74)],
  spikes: [ledge(267, 303), ledge(558, 591, 49), ledge(722, 749, 116)],
};
