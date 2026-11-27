import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const catwalks: Approach = {
  roomCap: 10,
  parSeconds: 66,
  length: 980,
  slabs: [
    ledge(90, 150, 124),
    ledge(160, 220, 98),
    ledge(250, 310, 120),
    ledge(330, 380, 90),
    ledge(420, 480, 118),
    ledge(500, 560, 92),
    ledge(600, 660, 122),
    ledge(690, 740, 96),
    ledge(780, 840, 116),
    ledge(860, 920, 90),
  ],
  walls: [ledge(395, 415, 112), ledge(745, 770, 104)],
  arenaSlabs: [ledge(40, 100, 114), ledge(220, 280, 114)],
  packs: [
    pack(250, walker(120), flyer(170, 80), walker(210, false, "forgeguard")),
    pack(490, walker(330), flyer(360, 70), walker(450, true)),
    pack(660, flyer(500, 60), walker(530, false, "forgeguard"), walker(620)),
    pack(760, flyer(650, 90), walker(680), walker(720, false, "forgeguard")),
    pack(970, flyer(800, 70), walker(820, true, "forgeguard"), walker(900), flyer(930, 80)),
  ],
  mentorSites: [site(185, 98), site(440)],
  spikes: [],
};

export const furnaceHalls: Approach = {
  roomCap: 8,
  parSeconds: 72,
  length: 1060,
  slabs: [
    ledge(80, 140, 120),
    ledge(150, 210, 94),
    ledge(240, 300, 118),
    ledge(320, 370, 86),
    ledge(410, 470, 112),
    ledge(480, 540, 84),
    ledge(580, 640, 120),
    ledge(660, 720, 94),
    ledge(760, 820, 114),
    ledge(840, 890, 88),
    ledge(930, 990, 116),
  ],
  walls: [ledge(220, 236, 110), ledge(545, 565, 100), ledge(895, 915, 108)],
  arenaSlabs: [ledge(50, 110, 112), ledge(210, 270, 112)],
  packs: [
    pack(230, walker(110), flyer(160, 74), walker(190, false, "forgeguard")),
    pack(410, walker(280), flyer(350, 64), walker(370, true, "forgeguard")),
    pack(560, walker(440), flyer(470, 70), walker(520)),
    pack(740, walker(600, false, "forgeguard"), flyer(630, 84), walker(700)),
    pack(920, walker(760, false, "forgeguard"), flyer(800, 70), walker(870), walker(880, true)),
    pack(1040, flyer(940, 80), walker(1000, false, "forgeguard")),
  ],
  mentorSites: [site(180, 94), site(610)],
  spikes: [],
};

export const smithy: Approach = {
  roomCap: 10,
  parSeconds: 84,
  length: 900,
  slabs: [
    ledge(90, 150, 118),
    ledge(170, 230, 90),
    ledge(260, 320, 116),
    ledge(350, 400, 84),
    ledge(440, 500, 112),
    ledge(520, 580, 88),
    ledge(620, 680, 118),
    ledge(700, 760, 92),
    ledge(800, 860, 114),
  ],
  walls: [ledge(330, 345, 106), ledge(600, 615, 102)],
  arenaSlabs: [ledge(30, 90, 112), ledge(230, 290, 112)],
  packs: [
    pack(240, walker(120), flyer(160, 80), walker(200, false, "forgeguard")),
    pack(470, walker(290), flyer(330, 66), walker(380, true, "forgeguard"), walker(430)),
    pack(630, flyer(470, 70), walker(560), walker(590, false, "forgeguard")),
    pack(800, flyer(640, 86), walker(660), walker(720, false, "forgeguard"), flyer(760, 70)),
    pack(890, walker(820, true), walker(870, false, "forgeguard")),
  ],
  mentorSites: [site(200, 90), site(470)],
  spikes: [],
};

export const FOUNDRY_AREAS = [catwalks, furnaceHalls, smithy] as const;

export const FOUNDRY_VENTS: readonly (readonly number[])[] = [
  [190, 470, 700],
  [120, 260, 395, 500, 720, 960],
  [200, 420, 690, 860],
];
