import type { Point } from "../../types/world";
import { take } from "../input";
import { openPicks } from "../progress";
import { game, hero, progress, showBanner } from "../state";
import { trail } from "./trail";

const TALK_DISTANCE = 29;
const TALK_HEIGHT = 18;

export function stageMentor(): Point | null {
  if (!trail || trail.gate !== null) return null;
  return trail.mentors[trail.area] ?? null;
}

export function nearbyMentor(): Point | null {
  if (game.mode !== "play" || hero.state === "dead") return null;
  const mentor = stageMentor();
  if (!mentor || Math.abs(mentor.x - hero.x) > TALK_DISTANCE || Math.abs(mentor.y - hero.y) > TALK_HEIGHT) return null;
  return mentor;
}

export function updateMentor(): void {
  if (!take("interact") || !nearbyMentor()) return;
  if (progress.picks <= 0) {
    showBanner("No skill points", 1.3);
    return;
  }
  openPicks();
}
