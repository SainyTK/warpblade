import { TEMPO_BPM } from "../../../constants/jory/beat";
import type { JoryHostMemory, JoryMemory } from "../../../types/jory";
import { beatSeconds } from "../../../utils/beat";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): JoryMemory => ({
  phase: 0,
  beatLen: beatSeconds(TEMPO_BPM[0]),
  beats: 0,
  clock: 0,
  groove: 0,
  lostBlink: 0,
  lostFrom: 0,
  silent: 0,
  streak: 0,
  onBeats: 0,
  stampJ: -1,
  stampK: -1,
  stampL: -1,
  stampI: -1,
  keptJ: -1,
  keptOnBeat: false,
  keptDownbeat: false,
  blow: 0,
  current: "tap",
  queued: false,
  queuedAccent: false,
  queuedDownbeat: false,
  accent: false,
  downbeat: false,
  hits: 0,
  struckAt: -1,
  link: 0,
  leaps: 0,
  downstrokes: 1,
  airStep: true,
  boomWait: 0,
  boomGuard: 0,
  boomOnBeat: false,
  boomDodged: false,
  stepWait: 0,
  stepDir: 1,
  stepLen: 0,
  stepOnBeat: false,
  stepDodged: false,
  freeSteps: 0,
  steadyBeats: 0,
  steadyCd: 0,
  thunderCd: 0,
  gongCd: 0,
  tuningCd: 0,
  echoCd: 0,
  casting: "steadyHand",
  castOnBeat: false,
  ultLevel: 0,
  rings: 0,
  rung: 0,
  ringT: 0,
  lockBeats: 0,
  crescendoT: 0,
  crescendoBest: 0,
  lastHp: -1,
  shrugCd: 0,
});

const freshHost = (): JoryHostMemory => ({ lastFoe: null, passed: [] });

/** the one owner of what Jory's kit remembers; the guest's HUD reads Groove, the beat and the abilities from it */
export const jory: JoryMemory = fresh();
rememberPerSeat(objectMemory(jory));

/** the foes his kit holds on to, kept to the host */
export const joryHost: JoryHostMemory = freshHost();
rememberPerSeat(objectMemory(joryHost, true));

/** a fresh run: the beat at 0 on the first frame, no Groove */
export function resetJory(): void {
  Object.assign(jory, fresh());
  Object.assign(joryHost, freshHost());
}
