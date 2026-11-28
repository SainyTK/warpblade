import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const readingHalls: Approach = {
  roomCap: 10,
  parSeconds: 110,
  length: 1730,
  slabs: [
    ledge(100, 156, 120),
    ledge(250, 304, 96),
    ledge(470, 530, 112),
    ledge(640, 700, 88),
    ledge(1060, 1120, 116),
    ledge(1290, 1350, 92),
    ledge(1500, 1556, 110),
  ],
  walls: [],
  arenaSlabs: [ledge(40, 100, 118), ledge(130, 190, 86), ledge(220, 280, 118)],
  packs: [
    pack(240, walker(150), flyer(175, 100), walker(200)),
    pack(440, walker(330), flyer(350, 90), walker(375), flyer(400, 104)),
    pack(635, walker(520), walker(545), flyer(565, 84), walker(595)),
    pack(830, flyer(720, 96), walker(740, true), walker(770), flyer(790, 80)),
    pack(1060, walker(930), flyer(950, 92), walker(975), walker(1000), flyer(1020, 100)),
    pack(1275, walker(1140), flyer(1160, 86), walker(1185, true), walker(1210), flyer(1235, 98)),
    pack(1505, walker(1350), flyer(1370, 90), walker(1395), walker(1420), flyer(1440, 80), walker(1465)),
    pack(1685, flyer(1560, 96), walker(1580), walker(1605, true), flyer(1625, 84), walker(1645)),
  ],
  mentorSites: [site(276, 96), site(1320, 92)],
  spikes: [],
};

export const theStacks: Approach = {
  roomCap: 9,
  parSeconds: 115,
  length: 1840,
  slabs: [
    ledge(90, 144, 118),
    ledge(300, 354, 90),
    ledge(470, 526, 114),
    ledge(700, 750, 84),
    ledge(1130, 1186, 110),
    ledge(1360, 1414, 88),
    ledge(1560, 1610, 116),
  ],
  walls: [],
  arenaSlabs: [ledge(50, 108, 116), ledge(140, 196, 80), ledge(226, 286, 116)],
  packs: [
    pack(260, walker(150), flyer(170, 92), walker(195), walker(220)),
    pack(460, flyer(350, 80), walker(370), walker(395, true), flyer(420, 100)),
    pack(690, walker(560), flyer(580, 88), walker(605), walker(630), flyer(650, 72)),
    pack(905, walker(770), flyer(790, 96), walker(815), flyer(840, 84), walker(865)),
    pack(1120, walker(990, true), flyer(1010, 90), walker(1035), walker(1060), flyer(1080, 76)),
    pack(1350, walker(1200), flyer(1220, 92), walker(1245), flyer(1265, 80), walker(1290), walker(1310)),
    pack(1560, flyer(1410, 96), walker(1430), walker(1455, true), flyer(1475, 84), walker(1500), walker(1520)),
    pack(1775, walker(1620), flyer(1640, 90), walker(1665), walker(1690, true), flyer(1710, 78), walker(1735)),
  ],
  mentorSites: [site(326, 90), site(1386, 88)],
  spikes: [],
};

export const sunkenRotunda: Approach = {
  roomCap: 10,
  parSeconds: 170,
  length: 1620,
  slabs: [
    ledge(90, 146, 118),
    ledge(166, 222, 88),
    ledge(470, 526, 110),
    ledge(880, 936, 92),
    ledge(1110, 1166, 116),
    ledge(1330, 1386, 90),
    ledge(1540, 1596, 112),
  ],
  walls: [],
  arenaSlabs: [ledge(36, 92, 114), ledge(228, 284, 114)],
  packs: [
    pack(450, walker(340), flyer(360, 90), walker(385), walker(410)),
    pack(670, flyer(540, 84), walker(560), walker(585, true), flyer(605, 96), walker(630)),
    pack(880, walker(750), flyer(770, 88), walker(795), walker(820), flyer(840, 76)),
    pack(1110, walker(960, true), flyer(980, 92), walker(1005), flyer(1025, 80), walker(1050), walker(1070)),
    pack(1320, flyer(1170, 96), walker(1190), walker(1215), flyer(1235, 84), walker(1260, true), walker(1280)),
    pack(1535, walker(1380), flyer(1400, 88), walker(1425), walker(1450, true), flyer(1470, 78), walker(1495)),
  ],
  mentorSites: [site(194, 88), site(1358, 90)],
  spikes: [],
};

export const ARCHIVE_AREAS = [readingHalls, theStacks, sunkenRotunda] as const;

export const ARCHIVE_TIDES = [
  {
    pools: [ledge(250, 286), ledge(1110, 1140), ledge(1530, 1556)],
    books: [124, 420, 610, 1010, 1330, 1590],
  },
  {
    pools: [ledge(280, 314), ledge(712, 748), ledge(1140, 1176), ledge(1580, 1612)],
    books: [180, 470, 650, 1250, 1480, 1700],
  },
  {
    pools: [ledge(470, 506), ledge(900, 940), ledge(1330, 1370)],
    books: [116, 296, 500, 860, 1140, 1460],
  },
] as const;
