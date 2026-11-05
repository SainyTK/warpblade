import { resetRoom } from "../../store/coop";
import { GuestSession } from "./guestSession";
import { HostSession } from "./hostSession";

/** The room this browser is in, if any. Loaded only when a player opens co-op, so solo play never loads the network. */
let host: HostSession | null = null;
let guest: GuestSession | null = null;

const reason = (err: unknown): string =>
  err instanceof Error && err.message ? err.message : "Something went wrong with the room. Try again.";

export async function hostRoom(): Promise<void> {
  leaveRoom();
  const session = new HostSession();
  host = session;
  try {
    await session.open();
  } catch (err) {
    // a room given up on, by Cancel or by hosting or joining another, fails quietly: the room shown now is another
    if (host !== session) return;
    host = null;
    session.close();
    resetRoom(reason(err));
  }
}

export async function joinRoomByCode(code: string): Promise<void> {
  leaveRoom();
  const session = new GuestSession();
  guest = session;
  try {
    await session.join(code);
  } catch (err) {
    // a room given up on, by Cancel or by hosting or joining another, fails quietly: the room shown now is another
    if (guest !== session) return;
    guest = null;
    session.close();
    resetRoom(reason(err));
  }
}

export function startRoomRun(): void {
  host?.start();
}

/** the hero this player takes into the room's next run */
export function roomHeroChanged(id: string): void {
  host?.heroChanged();
  guest?.chooseHero(id);
}

export function leaveRoom(): void {
  host?.close();
  guest?.close();
  host = null;
  guest = null;
}
