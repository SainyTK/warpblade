import type { CoopRole, RoomPhase, SeatInfo } from "../types/coop";

/** what the menu and the co-op status line show about the room this browser is in */
export interface RoomView {
  phase: RoomPhase;
  role: CoopRole | null;
  code: string;
  /** this browser's place in the room */
  you: number;
  seats: SeatInfo[];
  /** why the room could not be made or joined, or why it closed */
  error: string;
  /** a passing line, such as a player leaving */
  note: string;
  /** when the note was posted, so the same line posted again shows again */
  noteAt: number;
  /** this player's hero is down until the wave is cleared */
  downed: boolean;
  /** the places of players still choosing skill cards */
  choosing: number[];
  /** a guest has had no picture news from the host for a while, as when the host's tab is hidden */
  hostAway: boolean;
}

const IDLE: RoomView = {
  phase: "idle",
  role: null,
  code: "",
  you: 0,
  seats: [],
  error: "",
  note: "",
  noteAt: 0,
  downed: false,
  choosing: [],
  hostAway: false,
};

/** The one owner of the room's state as the interface sees it. The network session writes it, the menu reads it. */
const room: RoomView = { ...IDLE };
const listeners = new Set<() => void>();

export const roomView = (): Readonly<RoomView> => room;
/** in a room, or getting into one */
export const inRoom = (): boolean => room.phase === "connecting" || room.phase === "lobby" || room.phase === "playing";

/**
 * Change the room and tell the interface, but only when something changed: the host sends the same player list every
 * heartbeat, and redrawing the lobby for it would undo a pending "Leave? Press again" or a "Link copied"
 */
export function updateRoom(patch: Partial<RoomView>): void {
  const keys = Object.keys(patch) as (keyof RoomView)[];
  if (keys.every((key) => JSON.stringify(room[key]) === JSON.stringify(patch[key]))) return;
  Object.assign(room, patch);
  for (const listener of listeners) listener();
}

/** a passing line for the status line and the lobby */
export function postNote(note: string): void {
  updateRoom({ note, noteAt: performance.now() });
}

/** back to no room, keeping a reason to show when there is one */
export function resetRoom(error = ""): void {
  updateRoom({ ...IDLE, phase: error ? "closed" : "idle", error });
}

export function onRoomChange(listener: () => void): void {
  listeners.add(listener);
}
