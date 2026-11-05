import "./coopStatus.css";
import { SEAT_COLORS } from "../../constants/coop";
import { roomView } from "../../store/coop";

const line = document.createElement("div");
line.className = "coop-status";
line.setAttribute("aria-live", "polite");
const tag = document.createElement("b");
const text = document.createElement("span");
line.append(tag, text);
line.hidden = true;

/** how long a passing note, such as a player leaving, stays up */
const NOTE_MS = 4000;
let shown = "";

const names = (slots: number[]): string => {
  const tags = slots.map((s) => `P${s + 1}`);
  return tags.length > 1 ? `${tags.slice(0, -1).join(", ")} and ${tags.at(-1)}` : (tags[0] ?? "");
};

/** what this player should know right now: down, waiting on others' cards, or a passing note */
function message(now: number): string {
  const room = roomView();
  if (room.downed) return "Down until the wave is cleared";
  const others = room.choosing.filter((s) => s !== room.you);
  if (others.length && !room.choosing.includes(room.you)) return `Waiting for ${names(others)} to pick`;
  return room.note && now - room.noteAt < NOTE_MS ? room.note : "";
}

/** called every frame of a room's run; shown only while one plays and no menu covers the top of the screen */
export function syncCoopStatus(playing: boolean): void {
  if (!line.isConnected) document.body.append(line);
  const room = roomView();
  const now = performance.now();
  const next = playing ? `${room.you}|${message(now)}` : "";
  if (next === shown) return;
  shown = next;
  line.hidden = !playing;
  if (!playing) return;
  tag.textContent = `P${room.you + 1}`;
  line.style.setProperty("--seat", SEAT_COLORS[room.you]);
  text.textContent = message(now);
}
