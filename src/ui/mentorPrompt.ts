import "./mentorPrompt.css";
import { KEYMAP } from "../constants/input";
import { H, W } from "../constants/stage";
import { nearbyMentor, stageCameraX } from "../game/adventure";
import { mentorArtHeight } from "../mentorArt";
import { keyName, keysByAction } from "../utils/keymap";
import { clamp } from "../utils/math";
import { byId } from "./dom";
import { isMenuOpen } from "./menu/menuState";
import { tap } from "./touch/touchInput";

const prompt = byId<HTMLButtonElement>("mentorPrompt");
const PROCEDURAL_HEIGHT = 32;
const GAP = 2;
const TOP_PADDING = 46;
const EDGE = 13;

export function bindMentorPrompt(): void {
  const keys = keysByAction(KEYMAP).get("interact")?.map(keyName) ?? [];
  const key = prompt.querySelector("kbd");
  if (key) key.textContent = keys.join(" / ");
  prompt.setAttribute("aria-keyshortcuts", keys.join(" "));
  prompt.addEventListener("click", () => tap("interact"));
}

export function syncMentorPrompt(): void {
  const mentor = isMenuOpen() ? null : nearbyMentor();
  prompt.hidden = !mentor;
  if (!mentor) return;
  const x = clamp(((mentor.x - stageCameraX()) / W) * 100, EDGE, 100 - EDGE);
  prompt.style.left = `${x.toFixed(2)}%`;
  prompt.style.top = `max(${TOP_PADDING}px, ${((mentor.y - (mentorArtHeight() ?? PROCEDURAL_HEIGHT) - GAP) / H) * 100}%)`;
}
