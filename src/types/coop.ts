import type { Feat } from "./achievement";
import type { Card, PickToolKey } from "./build";
import type { ArtId } from "./campaign";
import type { CrystalWatch } from "./defense";
import type { GameMode } from "./game";
import type { InputAction } from "./input";
import type { PickAnswer } from "./pick";
import type { RunOutcome, RunReport, StageResult } from "./run";

export type CoopRole = "host" | "guest";

/** where the room is: being made or joined, waiting in the lobby, playing, or over with a reason */
export type RoomPhase = "idle" | "connecting" | "lobby" | "playing" | "closed";

/** one player in the room as the lobby and tags show them */
export interface SeatInfo {
  /** place in the room, 0 for the host; also picks the colour */
  slot: number;
  /** the hero they play */
  hero: string;
}

/** a card a guest answered, by kind and id so it crosses the network */
export interface PickWire {
  type: Card["type"];
  id: string;
}

/** what a guest's HUD needs from the host, sent several times a second */
export interface GuestHud {
  /** the per-player memories the HUD reads, in the order both sides registered them */
  bags: unknown[];
  mode: GameMode;
  wave: number;
  kills: number;
  /** the run clock */
  clock: number;
  banner: { text: string; time: number };
  /** the boss or mini boss on the field, for the boss bar */
  leader: unknown | null;
  /** players still choosing skills, by slot */
  choosing: number[];
  down: boolean;
  /** the stage line the HUD shows, such as the stage name and area */
  status: string;
  /** the stage run, so a mentor's cards stay dealt between visits */
  runId: number | null;
  crystal: CrystalWatch | null;
}

export interface Loadout {
  items: Record<string, number>;
  skills: string[];
  arts: ArtId[];
  tools: Partial<Record<PickToolKey, number>>;
}

/** guest to host */
export type GuestMessage =
  | { t: "hello"; hero: string; loadout: Loadout; version: string }
  | { t: "hero"; hero: string }
  | { t: "loadout"; loadout: Loadout }
  | { t: "key"; a: InputAction; d: boolean }
  | { t: "pick"; answer: PickAnswer<PickWire> }
  /** the guest has seen what their chest gave */
  | { t: "chestSeen" }
  | { t: "ping" }
  /** the host's probe sent straight back, so the host can time the round trip */
  | { t: "probe"; at: number }
  /** the guest is leaving, so the host need not wait for the link to go quiet */
  | { t: "bye" };

/** host to guest */
export type HostMessage =
  | { t: "welcome"; slot: number }
  | { t: "refuse"; reason: string }
  | { t: "lobby"; seats: SeatInfo[] }
  /** a probe stamped with the host's clock, which the guest sends straight back */
  | { t: "probe"; at: number }
  | { t: "start" }
  | { t: "hud"; hud: GuestHud }
  | { t: "feat"; feat: Feat }
  | { t: "end"; outcome: RunOutcome; stage: StageResult; coins: number; report: RunReport }
  /** the player in this place left the room */
  | { t: "left"; slot: number }
  | { t: "closed" };
