import { ROOM_PARAM } from "../../constants/coop";
import { updateRoom } from "../../store/coop";

/** the room code is loaded on first use, so solo play never downloads the network code */
const session = () => import("../../game/coop/session");

const failed = (): void => updateRoom({ phase: "closed", error: "Could not load co-op. Check your connection." });

export function hostRoom(): void {
  updateRoom({ phase: "connecting", role: "host", error: "" });
  session()
    .then((s) => s.hostRoom())
    .catch(failed);
}

export function joinRoom(code: string): void {
  updateRoom({ phase: "connecting", role: "guest", code, error: "" });
  session()
    .then((s) => s.joinRoomByCode(code))
    .catch(failed);
}

export function startRoomRun(): void {
  session()
    .then((s) => s.startRoomRun())
    .catch(failed);
}

export function roomHeroChanged(id: string): void {
  session()
    .then((s) => s.roomHeroChanged(id))
    .catch(failed);
}

export function leaveRoom(): void {
  session()
    .then((s) => s.leaveRoom())
    .catch(failed);
}

/** the address that opens the game and joins this room */
export function inviteLink(code: string): string {
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set(ROOM_PARAM, code);
  return url.toString();
}
