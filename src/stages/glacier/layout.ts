import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const frozenCorridor: Approach = {
  roomCap: 10,
  parSeconds: 125,
  length: 1690,
  slabs: [ledge(222, 280, 112), ledge(690, 750, 100), ledge(1160, 1222, 108), ledge(1470, 1530, 96)],
  walls: [ledge(478, 498, 128)],
  arenaSlabs: [ledge(48, 108, 112), ledge(132, 188, 80), ledge(212, 272, 112)],
  packs: [
    pack(260, walker(150), flyer(185, 92), walker(215)),
    pack(466, walker(360), flyer(385, 74), walker(405), walker(426)),
    pack(730, flyer(590, 84), walker(620), walker(652), flyer(690, 62)),
    pack(940, walker(790), flyer(815, 90), walker(845, true), walker(872), flyer(900, 66)),
    pack(1150, walker(990), flyer(1020, 76), walker(1050), walker(1082), flyer(1110, 56)),
    pack(1394, walker(1210), flyer(1240, 86), walker(1270), walker(1300, true), flyer(1326, 62), walker(1352)),
    pack(1640, walker(1440), flyer(1470, 80), walker(1500), walker(1530), flyer(1560, 58), walker(1596, true)),
  ],
  mentorSites: [site(300), site(1175, 108)],
  spikes: [],
};

export const icicleCavern: Approach = {
  roomCap: 9,
  parSeconds: 135,
  length: 1820,
  slabs: [ledge(250, 310, 110), ledge(640, 700, 90), ledge(1050, 1110, 104), ledge(1500, 1560, 92)],
  walls: [ledge(882, 900, 126)],
  arenaSlabs: [ledge(52, 110, 114), ledge(138, 184, 78), ledge(210, 268, 114)],
  packs: [
    pack(250, walker(140), flyer(170, 90), walker(205)),
    pack(450, walker(330), flyer(356, 66), walker(384), walker(410)),
    pack(660, flyer(520, 80), walker(550), walker(584, true), flyer(616, 58)),
    pack(866, walker(720), flyer(748, 86), walker(776), walker(806), flyer(830, 60)),
    pack(1180, walker(990), flyer(1020, 72), walker(1050), walker(1084, true), flyer(1110, 52), walker(1138)),
    pack(1400, walker(1230), flyer(1258, 88), walker(1290), walker(1320), flyer(1346, 64), walker(1366)),
    pack(1610, walker(1440), flyer(1470, 78), walker(1500, true), walker(1530), flyer(1556, 56), walker(1574)),
    pack(1806, walker(1650), flyer(1676, 84), walker(1704), walker(1730), flyer(1750, 60), walker(1770, true)),
  ],
  mentorSites: [site(290, 110), site(940)],
  spikes: [],
};

export const lynxDen: Approach = {
  roomCap: 10,
  parSeconds: 180,
  length: 1620,
  slabs: [ledge(330, 390, 104), ledge(760, 820, 92), ledge(1180, 1240, 104)],
  walls: [],
  arenaSlabs: [ledge(36, 92, 108), ledge(228, 284, 108)],
  packs: [
    pack(450, walker(320), flyer(350, 84), walker(380), walker(410)),
    pack(670, walker(520), flyer(548, 70), walker(578, true), flyer(606, 50), walker(630)),
    pack(884, flyer(730, 86), walker(758), walker(790), flyer(818, 58), walker(846)),
    pack(1090, flyer(940, 80), walker(966), walker(996, true), flyer(1022, 50), walker(1050)),
    pack(1324, walker(1150), flyer(1176, 88), walker(1204), walker(1232), flyer(1258, 56), walker(1284, true)),
    pack(1560, walker(1370), flyer(1400, 82), walker(1430), walker(1460), flyer(1490, 52), walker(1520, true)),
  ],
  mentorSites: [site(480), site(1110)],
  spikes: [],
};
