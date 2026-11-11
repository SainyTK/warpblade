import type { CharacterDef } from "../../types/character";
import { seatMemories } from "../seatMemory";

/** one player of a co-op room as the host's simulation holds them */
export interface Seat {
  /** place in the room, 0 for the host */
  slot: number;
  /** the PeerJS id of a guest; null for the host's own seat */
  peer: string | null;
  character: CharacterDef;
  /** what this player bought in their own shop; null for the host, who wears their own */
  owned: Record<string, number> | null;
  /** the guest's measured round trip in seconds, -1 until measured, 0 for the host */
  rtt: number;
  /** the per-player memories while another seat is swapped in, in registration order */
  saved: unknown[];
  /** fell and waits for the wave to be cleared */
  down: boolean;
  /** where the hero stood when last swapped out, whether it was standing, and whether it was hidden from foes */
  at: { x: number; y: number; standing: boolean; hidden: boolean };
}

/** a copy of every per-player memory that shares nothing with the live state, for a seat that starts fresh */
export function freshSaved(): unknown[] {
  return seatMemories().map((m) => structuredClone(m.save()));
}
