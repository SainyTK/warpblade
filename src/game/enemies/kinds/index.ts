import type { EnemyType } from "../../../types/enemy";
import { boghulk } from "./boghulk";
import { eye } from "./eye";
import { golem } from "./golem";
import type { EnemyKind } from "./kind";
import { maw } from "./maw";
import { mire } from "./mire";
import { moth } from "./moth";
import { brute, husk, warden, wisp } from "./night";
import { oakheart } from "./oakheart";
import { sovereign } from "./sovereign";
import { sprite } from "./sprite";
import { stalker } from "./stalker";
import { stormkite } from "./stormkite";
import { thornback } from "./thornback";
import { unblinking } from "./unblinking";

/** every kind of foe by type; only read inside functions, since kind files import the enemy helpers that import this */
export const KINDS: Record<EnemyType, EnemyKind> = {
  wisp,
  husk,
  brute,
  warden,
  thornback,
  moth,
  oakheart,
  mire,
  stormkite,
  boghulk,
  golem,
  sprite,
  stalker,
  eye,
  maw,
  sovereign,
  unblinking,
};

export const kindOf = (type: EnemyType): EnemyKind => KINDS[type];
