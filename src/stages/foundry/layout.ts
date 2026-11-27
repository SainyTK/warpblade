import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const catwalks: Approach = {
  roomCap: 10,
  parSeconds: 118,
  length: 1760,
  slabs: [
    ledge(240, 300, 120),
    ledge(560, 620, 112),
    ledge(900, 960, 118),
    ledge(1180, 1240, 110),
    ledge(1520, 1580, 116),
  ],
  walls: [ledge(1030, 1046, 128)],
  arenaSlabs: [ledge(40, 100, 114), ledge(220, 280, 114)],
  packs: [
    pack(200, walker(110), flyer(140, 80), walker(165)),
    pack(395, walker(265), flyer(290, 74), walker(320), walker(355)),
    pack(590, flyer(450, 70), walker(480), walker(510, true), flyer(545, 84)),
    pack(790, walker(640), flyer(665, 66), walker(695), walker(720), flyer(750, 80)),
    pack(1000, walker(845), walker(875), flyer(905, 72), walker(930, true), flyer(960, 90)),
    pack(1205, flyer(1060, 76), walker(1085), walker(1110), flyer(1140, 64), walker(1165)),
    pack(1435, walker(1260), flyer(1285, 80), walker(1310, true), walker(1340), flyer(1365, 70), walker(1395)),
    pack(1675, walker(1490), flyer(1515, 72), walker(1545), walker(1575, true), flyer(1600, 84), walker(1630)),
  ],
  mentorSites: [site(270, 120), site(1120)],
  spikes: [],
};

export const furnaceHalls: Approach = {
  roomCap: 8,
  parSeconds: 130,
  length: 1910,
  slabs: [
    ledge(250, 310, 116),
    ledge(620, 680, 110),
    ledge(980, 1040, 118),
    ledge(1340, 1400, 112),
    ledge(1700, 1760, 116),
  ],
  walls: [ledge(820, 836, 126)],
  arenaSlabs: [ledge(50, 110, 112), ledge(210, 270, 112)],
  packs: [
    pack(215, walker(110), flyer(140, 74), walker(170), walker(180, true)),
    pack(415, walker(280), flyer(305, 64), walker(335), walker(370)),
    pack(615, walker(470), flyer(500, 70), walker(530, true), flyer(560, 82), walker(575)),
    pack(800, walker(660), flyer(690, 84), walker(715), walker(740), flyer(760, 70)),
    pack(1005, walker(860), walker(885, true), flyer(915, 70), walker(940), flyer(965, 86)),
    pack(1215, flyer(1065, 80), walker(1090), walker(1120), flyer(1145, 66), walker(1170, true)),
    pack(1430, walker(1275), flyer(1300, 74), walker(1325), walker(1350), flyer(1370, 84), walker(1390)),
    pack(1640, walker(1480), flyer(1505, 70), walker(1530, true), walker(1560), flyer(1580, 80), walker(1600)),
    pack(1860, walker(1700), flyer(1725, 76), walker(1750), walker(1775, true), flyer(1800, 66), walker(1825)),
  ],
  mentorSites: [site(280, 116), site(1250)],
  spikes: [],
};

export const smithy: Approach = {
  roomCap: 10,
  parSeconds: 120,
  length: 1620,
  slabs: [ledge(120, 180, 116), ledge(520, 580, 112), ledge(880, 940, 118), ledge(1260, 1320, 112)],
  walls: [],
  arenaSlabs: [ledge(30, 90, 112), ledge(230, 290, 112)],
  packs: [
    pack(475, walker(340), flyer(365, 74), walker(395), walker(430)),
    pack(675, walker(530), flyer(555, 66), walker(585, true), flyer(610, 84), walker(635)),
    pack(885, flyer(730, 70), walker(755), walker(785), flyer(810, 80), walker(840)),
    pack(1090, walker(935), walker(960, true), flyer(990, 74), walker(1015), flyer(1035, 86), walker(1050)),
    pack(1300, walker(1140), flyer(1165, 70), walker(1190), walker(1215, true), flyer(1240, 82), walker(1260)),
    pack(1510, walker(1345), flyer(1370, 76), walker(1400, true), walker(1425), flyer(1450, 68), walker(1470, true)),
  ],
  mentorSites: [site(910, 118), site(1180)],
  spikes: [],
};

export const FOUNDRY_AREAS = [catwalks, furnaceHalls, smithy] as const;

export const FOUNDRY_VENTS: readonly (readonly number[])[] = [
  [420, 760, 1110, 1460],
  [235, 640, 1050, 1450, 1690],
  [220, 820, 1170, 1430],
];
