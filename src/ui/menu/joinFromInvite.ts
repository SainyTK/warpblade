import { ROOM_PARAM } from "../../constants/coop";
import { updateRoom } from "../../store/coop";
import { readRoomCode } from "../../utils/roomCode";
import { joinRoom } from "./coopActions";
import { showScreen } from "./menuState";

/** an invite link opens the co-op screen and joins its room; the code leaves the address so a reload does not rejoin */
export function joinFromInvite(): void {
  const url = new URL(location.href);
  const typed = url.searchParams.get(ROOM_PARAM);
  if (typed === null) return;
  url.searchParams.delete(ROOM_PARAM);
  history.replaceState(null, "", url);
  const code = readRoomCode(typed);
  showScreen("coop");
  if (code) joinRoom(code);
  else updateRoom({ phase: "closed", error: "That invite link has no room code. Ask the host for a new one." });
}
