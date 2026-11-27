import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const brokenStair: Approach = {
  roomCap: 9,
  parSeconds: 72,
  length: 1060,
  slabs: [
    ledge(94, 152, 118),
    ledge(164, 240, 86),
    ledge(258, 310, 54),
    ledge(330, 392, 108),
    ledge(404, 488, 76),
    ledge(508, 560, 122),
    ledge(580, 640, 90),
    ledge(650, 726, 56),
    ledge(690, 760, 116),
    ledge(820, 880, 100),
    ledge(900, 970, 68),
    ledge(940, 1012, 120),
  ],
  walls: [ledge(306, 338, 122), ledge(566, 602, 106), ledge(780, 816, 124)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(190, walker(116), flyer(150, 92)),
    pack(440, walker(262, false, "riftknight"), flyer(290, 34), walker(364), flyer(400, 64)),
    pack(686, walker(520, false, "riftknight"), flyer(552, 100), walker(646)),
    pack(812, flyer(690, 40), walker(752, false, "riftknight"), flyer(772, 84)),
    pack(1000, walker(846, true), flyer(880, 60), walker(930, false, "riftknight"), flyer(960, 40)),
    pack(1050, walker(1030)),
  ],
  mentorSites: [site(202, 86), site(610, 90)],
  spikes: [ledge(266, 290, 54), ledge(850, 874, 100)],
};
