import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const brokenBridges: Approach = {
  roomCap: 10,
  parSeconds: 75,
  length: 1000,
  slabs: [
    ledge(84, 134, 122),
    ledge(276, 322, 100),
    ledge(360, 410, 82),
    ledge(428, 466, 118),
    ledge(496, 524, 128),
    ledge(558, 588, 104),
    ledge(688, 738, 120),
    ledge(742, 782, 90),
    ledge(800, 828, 126),
    ledge(960, 1000, 110),
  ],
  walls: [ledge(238, 260, 120), ledge(592, 614, 116), ledge(886, 906, 124)],
  arenaSlabs: [ledge(52, 108, 112), ledge(212, 268, 112)],
  packs: [
    pack(210, walker(128), flyer(170, 72)),
    pack(460, walker(280), flyer(330, 64), walker(400), flyer(420, 92, "sparkjelly")),
    pack(610, walker(445, true), flyer(510, 70), walker(570)),
    pack(850, walker(712), flyer(735, 60), walker(760), flyer(810, 82, "sparkjelly")),
    pack(990, walker(865), flyer(905, 66), walker(992, true)),
  ],
  mentorSites: [site(298, 100), site(720)],
  spikes: [],
};

export const floatingIslands: Approach = {
  roomCap: 9,
  parSeconds: 70,
  length: 960,
  slabs: [
    ledge(84, 124, 116),
    ledge(140, 180, 94),
    ledge(240, 278, 104),
    ledge(282, 306, 126),
    ledge(340, 390, 86),
    ledge(392, 420, 114),
    ledge(566, 594, 122),
    ledge(620, 668, 100),
    ledge(680, 720, 78),
    ledge(838, 870, 118),
    ledge(900, 942, 100),
  ],
  walls: [ledge(214, 234, 118), ledge(488, 508, 120), ledge(780, 800, 116)],
  arenaSlabs: [ledge(40, 96, 110), ledge(132, 188, 84), ledge(224, 280, 110)],
  packs: [
    pack(288, flyer(150, 64), flyer(190, 96, "sparkjelly"), walker(248)),
    pack(432, flyer(300, 70), walker(360), flyer(380, 60, "sparkjelly"), walker(392, true)),
    pack(620, flyer(450, 84), walker(528), flyer(580, 64, "sparkjelly")),
    pack(795, walker(640), flyer(690, 56), walker(755)),
    pack(950, flyer(800, 70, "sparkjelly"), walker(908), flyer(920, 60)),
    pack(950, walker(944, true)),
  ],
  mentorSites: [site(365, 86), site(650)],
  spikes: [],
};

export const roost: Approach = {
  roomCap: 10,
  parSeconds: 95,
  length: 900,
  slabs: [
    ledge(90, 130, 112),
    ledge(190, 236, 96),
    ledge(280, 320, 104),
    ledge(352, 378, 126),
    ledge(420, 460, 90),
    ledge(500, 540, 110),
    ledge(610, 640, 92),
    ledge(780, 830, 108),
  ],
  walls: [ledge(240, 262, 118), ledge(470, 494, 116), ledge(650, 672, 120)],
  arenaSlabs: [ledge(56, 110, 114), ledge(210, 264, 114)],
  packs: [
    pack(300, flyer(120, 72), flyer(160, 70, "sparkjelly"), walker(210), flyer(260, 60, "sparkjelly")),
    pack(470, walker(300), flyer(360, 66), walker(430)),
    pack(620, flyer(450, 84, "sparkjelly"), walker(520, true), flyer(580, 60)),
    pack(740, walker(630), flyer(700, 70, "sparkjelly")),
    pack(890, walker(800), flyer(820, 64), walker(860, true), flyer(880, 90, "sparkjelly")),
  ],
  mentorSites: [site(300, 104), site(800)],
  spikes: [],
};

export const SKYWAY_AREAS = [brokenBridges, floatingIslands, roost] as const;
