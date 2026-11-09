import { SAND_BAR } from "../../../constants/mirel/field";
import type { MirelHostMemory, MirelMemory } from "../../../types/mirel";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): MirelMemory => ({
  sand: SAND_BAR.max,
  sandWait: 0,
  field: null,
  fieldCd: 0,
  fieldKills: 0,
  fieldLetGo: false,
  sandFlash: 0,
  blow: 0,
  current: "tick",
  link: 0,
  queued: false,
  struck: false,
  pendants: 1,
  hovering: false,
  hoverLeft: 0,
  hovers: 1,
  diving: false,
  diveBoost: 0,
  rewindCd: 0,
  rewindT: 0,
  rewindFrom: null,
  rewindDodged: false,
  sinceRewind: 9,
  quickLeft: 0,
  clockCd: 0,
  handCd: 0,
  sundialCd: 0,
  foretellCd: 0,
  sweepCd: 0,
  casting: "stoppedClock",
  dials: 0,
  ultLevel: 0,
  ultAt: null,
  ultReach: 0,
  secondChance: 0,
});

const freshHost = (): MirelHostMemory => ({
  path: [],
  rewound: [],
  rewoundLoss: 0,
  clockFoe: null,
  inside: [],
  landed: [],
  replay: 0,
});

/** the one owner of what Mirel's kit remembers; the guest's HUD reads Sand and the abilities from it */
export const mirel: MirelMemory = fresh();
rememberPerSeat(objectMemory(mirel));

/** her path and the foes her kit holds on to, kept to the host */
export const mirelHost: MirelHostMemory = freshHost();
rememberPerSeat(objectMemory(mirelHost, true));

/** a fresh run: a full hourglass, no field, no path */
export function resetMirel(): void {
  Object.assign(mirel, fresh());
  Object.assign(mirelHost, freshHost());
}
