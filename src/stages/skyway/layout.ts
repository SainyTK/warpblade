import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const brokenBridges: Approach = {
  roomCap: 10,
  parSeconds: 135,
  length: 1800,
  slabs: [ledge(300, 350, 116), ledge(700, 750, 104), ledge(1100, 1150, 112), ledge(1460, 1510, 100)],
  walls: [ledge(1000, 1022, 120)],
  arenaSlabs: [ledge(52, 108, 112), ledge(212, 268, 112)],
  packs: [
    pack(240, walker(140), flyer(175, 72), walker(200)),
    pack(425, walker(300), flyer(330, 64), walker(360), walker(385)),
    pack(610, flyer(480, 70), walker(510), walker(545, true), flyer(570, 88)),
    pack(810, walker(660), flyer(690, 60), walker(720), walker(750), flyer(770, 80)),
    pack(975, walker(850), flyer(880, 66), walker(910), walker(935, true)),
    pack(1210, walker(1060), flyer(1090, 70), walker(1120), flyer(1150, 58), walker(1170)),
    pack(1410, walker(1260), flyer(1290, 64), walker(1320, true), walker(1350), flyer(1370, 86)),
    pack(1620, walker(1450), flyer(1480, 70), walker(1510), walker(1540), flyer(1560, 60), walker(1580)),
    pack(1785, walker(1660), flyer(1680, 66), walker(1710, true), flyer(1740, 80), walker(1755)),
  ],
  mentorSites: [site(560), site(1300)],
  spikes: [],
};

export const floatingIslands: Approach = {
  roomCap: 9,
  parSeconds: 126,
  length: 1730,
  slabs: [ledge(420, 470, 100), ledge(640, 690, 86), ledge(1100, 1150, 100), ledge(1400, 1450, 90)],
  walls: [ledge(880, 900, 118)],
  arenaSlabs: [ledge(40, 96, 110), ledge(132, 188, 84), ledge(224, 280, 110)],
  packs: [
    pack(255, flyer(150, 64), walker(190), flyer(220, 90)),
    pack(440, walker(310), flyer(340, 70), walker(370), flyer(400, 60)),
    pack(620, walker(500, true), flyer(520, 84), walker(550), walker(580)),
    pack(830, flyer(680, 56), walker(700), walker(730), flyer(760, 70), walker(790)),
    pack(1070, walker(925), flyer(945, 66), walker(975), flyer(1005, 80), walker(1030, true)),
    pack(1290, flyer(1140, 60), walker(1170), walker(1200), flyer(1230, 74), walker(1250)),
    pack(1480, walker(1340), flyer(1360, 70), walker(1390), walker(1420, true), flyer(1440, 58)),
    pack(1700, walker(1530), flyer(1550, 64), walker(1580), flyer(1610, 82), walker(1640), walker(1660)),
  ],
  mentorSites: [site(640), site(1310)],
  spikes: [],
};

export const roost: Approach = {
  roomCap: 10,
  parSeconds: 170,
  length: 1620,
  slabs: [ledge(180, 230, 100), ledge(480, 530, 96), ledge(820, 870, 104), ledge(1250, 1300, 92)],
  walls: [ledge(1000, 1022, 118)],
  arenaSlabs: [ledge(56, 110, 114), ledge(210, 264, 114)],
  packs: [
    pack(450, walker(330), flyer(360, 70), walker(390), flyer(410, 60)),
    pack(640, walker(500), flyer(520, 84), walker(550, true), walker(580), flyer(600, 66)),
    pack(830, flyer(690, 60), walker(710), walker(740), flyer(770, 74), walker(790)),
    pack(985, walker(880), flyer(900, 66), walker(925), walker(945, true), flyer(955, 80)),
    pack(1235, walker(1070), flyer(1090, 64), walker(1120), flyer(1150, 72), walker(1175), walker(1195)),
    pack(1440, flyer(1280, 60), walker(1300), walker(1330, true), flyer(1360, 80), walker(1380), walker(1400)),
    pack(1600, walker(1470), flyer(1490, 66), walker(1515), flyer(1535, 58), walker(1550, true), walker(1565)),
  ],
  mentorSites: [site(470), site(1240)],
  spikes: [],
};

export const SKYWAY_AREAS = [brokenBridges, floatingIslands, roost] as const;
