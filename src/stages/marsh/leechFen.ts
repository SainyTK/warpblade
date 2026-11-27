import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const leechFen: Approach = {
  roomCap: 9,
  parSeconds: 72,
  length: 1020,
  slabs: [
    ledge(90, 150, 120),
    ledge(160, 234, 88),
    ledge(250, 296, 56),
    ledge(340, 400, 100),
    ledge(410, 492, 70),
    ledge(500, 552, 124),
    ledge(610, 670, 84),
    ledge(680, 752, 116),
    ledge(740, 800, 54),
    ledge(840, 900, 94),
    ledge(910, 980, 120),
    ledge(950, 1004, 72),
  ],
  walls: [ledge(300, 336, 118), ledge(560, 600, 102), ledge(800, 830, 128)],
  arenaSlabs: [ledge(46, 106, 118), ledge(132, 188, 80), ledge(214, 274, 118)],
  packs: [
    pack(290, walker(112, false, "bogleech"), flyer(170, 70), walker(250)),
    pack(460, flyer(290, 40), walker(372, false, "bogleech"), flyer(420, 54)),
    pack(644, walker(512), walker(540, false, "bogleech"), flyer(604, 60)),
    pack(830, walker(660), flyer(720, 96), walker(770, false, "bogleech"), flyer(790, 38)),
    pack(1010, walker(860, true), flyer(900, 78), walker(940, false, "bogleech"), flyer(980, 58)),
    pack(1010, walker(1004)),
  ],
  mentorSites: [site(196, 88), site(640, 84)],
  spikes: [ledge(256, 280, 56), ledge(620, 652)],
};
