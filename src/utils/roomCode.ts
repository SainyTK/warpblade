import { ROOM_ALPHABET, ROOM_CODE_LENGTH } from "../constants/coop";

/** a fresh room code from a source of numbers in [0, 1) */
export function makeRoomCode(random: () => number): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) code += ROOM_ALPHABET[Math.floor(random() * ROOM_ALPHABET.length)];
  return code;
}

/** what a player typed or pasted as a code: upper case, without spaces or dashes, cut to a code's length */
export const typedRoomCode = (typed: string): string =>
  typed.toUpperCase().replace(/[\s-]/g, "").slice(0, ROOM_CODE_LENGTH);

/** a code as typed, or null when it cannot be a room code */
export function readRoomCode(typed: string): string | null {
  const code = typed.toUpperCase().replace(/[\s-]/g, "");
  if (code.length !== ROOM_CODE_LENGTH) return null;
  return [...code].every((ch) => ROOM_ALPHABET.includes(ch)) ? code : null;
}
