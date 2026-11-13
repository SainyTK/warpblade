import type { BrannocHostMemory, BrannocMemory } from "../../../types/brannoc";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): BrannocMemory => ({
  debt: 0,
  debtIdle: 0,
  repayFlash: 0,
  forfeitT: 0,
  forfeitFrom: 0,
  forfeitWidth: 0,
  lastHp: -1,
  bloodied: false,
  rimFlash: 0,
  blow: 0,
  current: "hew",
  queued: false,
  hits: 0,
  double: false,
  reapLeft: 0,
  reapT: 0,
  cracked: false,
  link: 0,
  glint: 0,
  hatchets: 1,
  frenzyT: 0,
  frenzyWait: 0,
  cryCd: 0,
  crescentCd: 0,
  geyserCd: 0,
  axeCd: 0,
  pactCd: 0,
  casting: "frenzy",
  castWide: false,
  pactT: 0,
  pactFirst: false,
  berserkT: 0,
  berserkLevel: 0,
  cleaves: 0,
  repaid: 0,
  repaidSwing: -1,
  bloodiedKills: 0,
  steamT: 0,
});

const freshHost = (): BrannocHostMemory => ({ from: 0, air: false });

/** the one owner of what Brannoc's kit remembers; the guest's HUD reads the debt and the abilities from it */
export const brannoc: BrannocMemory = fresh();
rememberPerSeat(objectMemory(brannoc));

/** where his warp left from, kept to the host */
export const brannocHost: BrannocHostMemory = freshHost();
rememberPerSeat(objectMemory(brannocHost, true));

/** a fresh run: no debt, no Frenzy, no Berserk */
export function resetBrannoc(): void {
  Object.assign(brannoc, fresh());
  Object.assign(brannocHost, freshHost());
}
