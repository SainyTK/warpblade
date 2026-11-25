import type { Approach } from "../../types/campaign";
import { flyer, ledge, pit, site, surge, walker } from "../geometry";

export const firstSteps: Approach = {
  rise: 0,
  room: surge(14, 6),
  parSeconds: 45,
  length: 700,
  slabs: [ledge(150, 206, 124), ledge(276, 330, 104), ledge(400, 458, 118), ledge(470, 530, 86), ledge(560, 620, 122)],
  walls: [ledge(350, 384, 122)],
  arenaSlabs: [ledge(55, 112, 116), ledge(208, 265, 116)],
  patrol: [walker(190), flyer(310, 96), walker(440), flyer(500, 64), walker(590), flyer(640, 100), walker(668)],
  mentorSites: [site(120), site(304, 104)],
  spikes: [],
  pits: [pit(228, 256)],
};
