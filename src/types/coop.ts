import type { InputAction } from "./input";
import type { RunOutcome } from "./run";

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

/** a skill card chosen by a guest, by id so it crosses the network */
export type PickWire = { type: "skill"; id: string } | { type: "boon"; id: string };

/** what a guest's HUD needs from the host, sent several times a second */
export interface GuestHud {
  /** the per-player memories the HUD reads, in the order both sides registered them */
  bags: unknown[];
  mode: "play" | "pick" | "clear";
  wave: number;
  kills: number;
  banner: { text: string; time: number };
  /** the boss or mini boss on the field, for the boss bar */
  leader: unknown | null;
  /** players still choosing skills, by slot */
  choosing: number[];
  down: boolean;
}

/** guest to host */
export type GuestMessage =
  | { t: "hello"; hero: string; owned: Record<string, number>; version: string }
  | { t: "hero"; hero: string }
  | { t: "key"; a: InputAction; d: boolean }
  | { t: "pick"; pick: PickWire }
  | { t: "ping" }
  /** the guest is leaving, so the host need not wait for the link to go quiet */
  | { t: "bye" };

/** host to guest */
export type HostMessage =
  | { t: "welcome"; slot: number }
  | { t: "refuse"; reason: string }
  | { t: "lobby"; seats: SeatInfo[] }
  | { t: "start" }
  | { t: "hud"; hud: GuestHud }
  | { t: "end"; outcome: RunOutcome; wave: number; coins: number }
  /** the player in this place left the room */
  | { t: "left"; slot: number }
  | { t: "closed" };
