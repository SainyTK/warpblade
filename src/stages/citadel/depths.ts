import type { Approach } from "../../types/campaign";
import { flyer, ledge, pack, site, walker } from "../geometry";

export const depths: Approach = {
  roomCap: 10,
  parSeconds: 108,
  length: 947,
  slabs: [
    ledge(106, 166, 119),
    ledge(188, 245, 87),
    ledge(246, 298, 53),
    ledge(292, 352, 114),
    ledge(329, 403, 61),
    ledge(411, 473, 91),
    ledge(458, 475, 124),
    ledge(542, 608, 109),
    ledge(592, 658, 73),
    ledge(673, 747, 45),
    ledge(663, 717, 116),
    ledge(738, 804, 99),
    ledge(790, 851, 70),
    ledge(857, 911, 121),
  ],
  walls: [ledge(166, 191, 132), ledge(478, 522, 108), ledge(765, 799, 127)],
  arenaSlabs: [ledge(83, 143, 110), ledge(183, 241, 104)],
  packs: [
    pack(269, walker(109), flyer(148, 102), flyer(229, 73)),
    pack(435, walker(255), flyer(266, 38), walker(330), flyer(395, 47)),
    pack(587, walker(428), flyer(450, 76), walker(547)),
    pack(743, flyer(570, 93), flyer(637, 58), walker(654), flyer(703, 32)),
    pack(911, walker(740, true), flyer(764, 85), flyer(815, 55), walker(871, true)),
    pack(937, walker(920)),
  ],
  mentorSites: [site(223, 87), site(374, 61)],
  spikes: [ledge(252, 282, 53), ledge(561, 600), ledge(688, 721, 45)],
};
