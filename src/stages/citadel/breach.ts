import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const breach: Approach = {
  roomCap: 14,
  parSeconds: 110,
  length: 1040,
  slabs: [
    ledge(100, 162, 120),
    ledge(180, 240, 86),
    ledge(250, 316, 52),
    ledge(336, 396, 110),
    ledge(412, 470, 76),
    ledge(486, 548, 120),
    ledge(540, 606, 48),
    ledge(626, 686, 94),
    ledge(706, 762, 122),
    ledge(752, 820, 70),
    ledge(850, 910, 108),
    ledge(910, 980, 64),
    ledge(960, 1020, 122),
  ],
  walls: [ledge(222, 254, 126), ledge(566, 604, 104), ledge(812, 846, 120)],
  arenaSlabs: [ledge(44, 99, 113), ledge(223, 275, 113)],
  packs: [
    pack(246, walker(116, false, "thornback"), flyer(150, 100, "moth"), walker(206, false, "mire")),
    pack(424, flyer(270, 34, "stormkite"), walker(346, false, "husk"), flyer(384, 82, "wisp")),
    pack(616, walker(452, false, "golem"), flyer(492, 56, "sprite"), walker(530, true), flyer(576, 30, "lanternshade")),
    pack(820, walker(640, false, "riftknight"), flyer(676, 72), walker(720, false, "bogleech"), flyer(780, 50)),
    pack(980, walker(800, true, "husk"), flyer(860, 86, "eye"), walker(880), flyer(940, 44, "sprite")),
    pack(1030, walker(990, true, "golem"), flyer(1020, 96)),
  ],
  mentorSites: [site(210, 86), site(440, 76)],
  spikes: [ledge(258, 286, 52), ledge(636, 664, 94), ledge(904, 934)],
};
