import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const spires: Approach = {
  roomCap: 10,
  parSeconds: 170,
  length: 1560,
  slabs: [
    ledge(200, 260, 112),
    ledge(530, 590, 104),
    ledge(770, 830, 104),
    ledge(1150, 1220, 100),
    ledge(1400, 1460, 106),
  ],
  walls: [ledge(1070, 1100, 124)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(450, walker(330), flyer(360, 96), walker(400), walker(415)),
    pack(650, walker(520), flyer(560, 65), walker(580), flyer(600, 90), walker(610)),
    pack(850, walker(720), walker(750), flyer(775, 96), walker(800, true), flyer(810, 66)),
    pack(1050, walker(920), flyer(945, 96), walker(970), walker(995), flyer(1005, 92)),
    pack(1260, walker(1120), flyer(1145, 94), walker(1170, true), walker(1195), flyer(1210, 64), walker(1220)),
    pack(1500, walker(1340), flyer(1370, 98), walker(1400), walker(1430, true), flyer(1450, 65), walker(1460)),
  ],
  mentorSites: [site(480), site(1290)],
  spikes: [ledge(870, 892)],
};
