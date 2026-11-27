import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const graveRow: Approach = {
  roomCap: 10,
  parSeconds: 75,
  length: 980,
  slabs: [
    ledge(100, 160, 118),
    ledge(184, 236, 86),
    ledge(250, 318, 54),
    ledge(330, 390, 112),
    ledge(410, 470, 78),
    ledge(488, 540, 120),
    ledge(540, 610, 60),
    ledge(626, 690, 98),
    ledge(708, 760, 124),
    ledge(750, 816, 74),
    ledge(840, 900, 108),
    ledge(890, 950, 62),
  ],
  walls: [ledge(232, 262, 124), ledge(470, 508, 106), ledge(800, 836, 120)],
  arenaSlabs: [ledge(44, 101, 112), ledge(131, 186, 77), ledge(217, 268, 116)],
  packs: [
    pack(254, walker(118), flyer(160, 96), walker(214)),
    pack(402, flyer(280, 36), walker(320), flyer(362, 82)),
    pack(600, walker(430), flyer(452, 52), walker(560)),
    pack(724, flyer(588, 40), walker(650), flyer(684, 72)),
    pack(908, walker(730), flyer(782, 52), walker(868, true)),
    pack(970, flyer(900, 40), walker(952)),
  ],
  mentorSites: [site(210, 86), site(440, 78)],
  spikes: [ledge(376, 404), ledge(636, 664, 98)],
};
