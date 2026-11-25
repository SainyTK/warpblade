import type { Approach } from "../../types/campaign";
import { boss, flyer, ledge, pit, site, surge, walker } from "../geometry";

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
  rise: 0,
  room: surge(40, 10),
  parSeconds: 60,
  length: 980,
  slabs: [
    ledge(90, 150, 122),
    ledge(175, 230, 98),
    ledge(300, 350, 120),
    ledge(375, 425, 90),
    ledge(515, 570, 122),
    ledge(600, 655, 98),
    ledge(690, 740, 74),
    ledge(810, 870, 118),
    ledge(905, 955, 94),
  ],
  walls: [ledge(255, 283, 118), ledge(460, 486, 100), ledge(760, 788, 124)],
  arenaSlabs: [ledge(50, 110, 116), ledge(205, 265, 112)],
  patrol: [
    walker(150),
    flyer(205, 80),
    walker(235, false, "spitbloom"),
    walker(320),
    flyer(360, 70),
    walker(400, true),
    walker(440, false, "spitbloom"),
    flyer(520, 90),
    walker(545),
    walker(650),
    flyer(700, 50),
    walker(725, false, "spitbloom"),
    walker(800),
    flyer(850, 80),
    walker(925, true),
    walker(955, false, "spitbloom"),
  ],
  mentorSites: [site(200, 98), site(530)],
  spikes: [],
  pits: [pit(588, 618), pit(878, 906)],
};

export const fungalMarsh: Approach = {
  rise: 1,
  room: surge(35, 9, ["rotcrawler", "spitbloom"]),
  parSeconds: 70,
  length: 1050,
  slabs: [
    ledge(100, 160, 120),
    ledge(190, 250, 94),
    ledge(330, 390, 116),
    ledge(420, 470, 88),
    ledge(540, 600, 120),
    ledge(630, 690, 96),
    ledge(720, 770, 70),
    ledge(840, 900, 118),
    ledge(930, 990, 92),
  ],
  walls: [ledge(280, 306, 112), ledge(490, 514, 96), ledge(800, 826, 120)],
  arenaSlabs: [ledge(45, 105, 118), ledge(215, 275, 110)],
  patrol: [
    walker(175),
    walker(210, false, "spitbloom"),
    flyer(240, 70),
    walker(320),
    walker(400, false, "spitbloom"),
    flyer(450, 60),
    walker(470, true),
    walker(530),
    walker(612, false, "spitbloom"),
    flyer(650, 70),
    walker(690),
    walker(760, false, "spitbloom"),
    flyer(790, 50),
    walker(905),
    walker(915, false, "spitbloom"),
    flyer(940, 60),
    walker(975, true),
    walker(1040),
  ],
  mentorSites: [site(220, 94), site(455, 88)],
  spikes: [],
  pits: [pit(700, 730), pit(1000, 1026)],
};

export const heartChamber: Approach = {
  rise: 2,
  room: boss("sporeheart"),
  parSeconds: 90,
  length: 900,
  slabs: [
    ledge(100, 155, 118),
    ledge(185, 240, 92),
    ledge(300, 350, 120),
    ledge(380, 430, 94),
    ledge(460, 510, 70),
    ledge(560, 620, 116),
    ledge(660, 720, 90),
    ledge(780, 840, 118),
  ],
  walls: [ledge(260, 286, 114), ledge(520, 546, 98), ledge(740, 764, 122)],
  arenaSlabs: [ledge(28, 84, 116), ledge(110, 158, 96)],
  patrol: [
    walker(150),
    flyer(210, 70),
    walker(240, false, "spitbloom"),
    walker(330),
    flyer(370, 60),
    walker(420, false, "spitbloom"),
    walker(500, true),
    flyer(560, 80),
    walker(600),
    walker(650, false, "spitbloom"),
    flyer(700, 50),
    walker(785),
    walker(830, false, "spitbloom"),
    flyer(880, 70),
  ],
  mentorSites: [site(210, 92), site(640)],
  spikes: [],
  pits: [pit(445, 475), pit(860, 888)],
};

export const BLIGHT_AREAS = [rootTunnel, fungalMarsh, heartChamber] as const;

export const BLIGHT_HAZARDS: readonly HazardSites[] = [
  { pools: [pool(130, 158)], clouds: [drift(340, 66, 40), drift(690, 104, 50)] },
  {
    pools: [pool(118, 152), pool(345, 382), pool(555, 592), pool(640, 676), pool(855, 892)],
    clouds: [drift(455, 58, 50), drift(760, 48, 40)],
  },
  { pools: [pool(118, 148), pool(595, 632), pool(800, 834)], clouds: [drift(405, 62, 40), drift(690, 58, 50)] },
];
