import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export interface DriftSite {
  x: number;
  y: number;
  span: number;
}

export interface HazardSites {
  pools: readonly { x0: number; x1: number }[];
  clouds: readonly DriftSite[];
}

const pool = (x0: number, x1: number) => ({ x0, x1 });
const drift = (x: number, y: number, span: number): DriftSite => ({ x, y, span });

export const rootTunnel: Approach = {
  roomCap: 10,
  parSeconds: 105,
  length: 1760,
  slabs: [ledge(260, 320, 118), ledge(640, 700, 112), ledge(1180, 1240, 116), ledge(1480, 1540, 110)],
  walls: [ledge(1055, 1080, 124)],
  arenaSlabs: [ledge(50, 110, 116), ledge(205, 265, 112)],
  packs: [
    pack(235, walker(150), flyer(175, 104), walker(200)),
    pack(430, walker(330), flyer(350, 96), walker(375), walker(395)),
    pack(620, walker(520), flyer(540, 100), walker(560), walker(585)),
    pack(830, walker(710), flyer(725, 90), walker(745), walker(770), walker(790)),
    pack(1020, walker(905), flyer(920, 98), walker(940), walker(960, true), walker(985)),
    pack(1225, walker(1110), flyer(1125, 92), walker(1145), flyer(1165, 104), walker(1190)),
    pack(1445, walker(1310), flyer(1325, 96), walker(1345), walker(1365), flyer(1385, 88), walker(1405)),
    pack(1670, walker(1530), flyer(1545, 92), walker(1565, true), walker(1590), flyer(1610, 100), walker(1630)),
  ],
  mentorSites: [site(290, 118), site(860)],
  spikes: [],
};

export const fungalMarsh: Approach = {
  roomCap: 9,
  parSeconds: 120,
  length: 1890,
  slabs: [ledge(270, 330, 116), ledge(660, 720, 110), ledge(1290, 1350, 118), ledge(1480, 1540, 112)],
  walls: [ledge(882, 906, 120)],
  arenaSlabs: [ledge(45, 105, 118), ledge(215, 275, 110)],
  packs: [
    pack(245, walker(160), flyer(185, 100), walker(210)),
    pack(445, walker(350), flyer(370, 94), walker(390), walker(410)),
    pack(640, walker(545), flyer(565, 98), walker(585, true), walker(605)),
    pack(850, walker(740), flyer(755, 92), walker(775), flyer(795, 104), walker(815)),
    pack(1055, walker(940), flyer(955, 96), walker(975), walker(1000), walker(1020)),
    pack(1250, walker(1140), flyer(1155, 90), walker(1175, true), walker(1195), flyer(1215, 100)),
    pack(1475, walker(1345), flyer(1360, 96), walker(1380), walker(1400), flyer(1420, 88), walker(1440)),
    pack(1690, walker(1555), flyer(1570, 92), walker(1590), walker(1610, true), flyer(1630, 100), walker(1650)),
    pack(1875, walker(1745), flyer(1760, 96), walker(1780), flyer(1800, 90), walker(1820, true), walker(1840)),
  ],
  mentorSites: [site(300, 116), site(1280)],
  spikes: [],
};

export const heartChamber: Approach = {
  roomCap: 10,
  parSeconds: 150,
  length: 1650,
  slabs: [ledge(470, 530, 116), ledge(870, 930, 110), ledge(1290, 1350, 114)],
  walls: [ledge(1092, 1116, 122)],
  arenaSlabs: [ledge(28, 84, 116), ledge(110, 158, 96)],
  packs: [
    pack(455, walker(360), flyer(380, 100), walker(400), walker(420)),
    pack(650, walker(550), flyer(570, 94), walker(590), walker(615)),
    pack(855, walker(745), flyer(760, 98), walker(780, true), walker(800), walker(820)),
    pack(1055, walker(945), flyer(960, 92), walker(980), flyer(1000, 104), walker(1020)),
    pack(1275, walker(1145), flyer(1160, 96), walker(1180), walker(1200, true), flyer(1220, 90), walker(1240)),
    pack(1490, walker(1360), flyer(1375, 92), walker(1395), walker(1415), flyer(1435, 100), walker(1455)),
    pack(1635, walker(1525), flyer(1540, 96), walker(1555, true), walker(1575), flyer(1590, 100), walker(1600)),
  ],
  mentorSites: [site(500, 116), site(700)],
  spikes: [],
};

export const BLIGHT_AREAS = [rootTunnel, fungalMarsh, heartChamber] as const;

export const BLIGHT_HAZARDS: readonly HazardSites[] = [
  { pools: [pool(450, 482), pool(1250, 1284)], clouds: [drift(640, 66, 40), drift(1240, 104, 50)] },
  {
    pools: [pool(470, 504), pool(1078, 1112), pool(1500, 1532)],
    clouds: [drift(690, 58, 50), drift(1320, 48, 40)],
  },
  { pools: [pool(480, 512), pool(876, 910), pool(1300, 1332)], clouds: [drift(700, 62, 40), drift(1200, 58, 50)] },
];
