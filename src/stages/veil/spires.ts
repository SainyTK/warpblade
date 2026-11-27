import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const spires: Approach = {
  roomCap: 10,
  parSeconds: 170,
  length: 1560,
  slabs: [
    ledge(200, 260, 112),
    ledge(470, 540, 96),
    ledge(760, 830, 110),
    ledge(1150, 1220, 90),
    ledge(1380, 1450, 108),
  ],
  walls: [ledge(1070, 1100, 124)],
  arenaSlabs: [ledge(52, 115, 113), ledge(211, 274, 113)],
  packs: [
    pack(450, walker(330), flyer(360, 80), walker(400), walker(415)),
    pack(650, walker(520), flyer(550, 60), walker(580), flyer(600, 90), walker(610)),
    pack(850, walker(720), walker(750), flyer(775, 70), walker(800, true), flyer(810, 46)),
    pack(1050, walker(920), flyer(945, 80), walker(970), walker(995), flyer(1005, 56)),
    pack(1260, walker(1120), flyer(1145, 66), walker(1170, true), walker(1195), flyer(1210, 44), walker(1220)),
    pack(1500, walker(1340), flyer(1370, 80), walker(1400), walker(1430, true), flyer(1450, 56), walker(1460)),
  ],
  mentorSites: [site(480), site(1290)],
  spikes: [ledge(870, 892)],
};
