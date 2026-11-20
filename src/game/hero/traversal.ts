import { isAdventure } from "../adventure";
import { isHeld, pressAge, take } from "../input";
import { hero } from "../state";
import { inFreeState } from "./actions";
import { clearTakeoff } from "./takeoff";
import { oneWayAt, wallSide } from "./terrain";

const DROP_SPEED = 36;
const WALL_SLIDE_SPEED = 57;
const WALL_CLIMB_SPEED = 108;

export function readPlatformDrop(): void {
  if (!isAdventure() || !hero.ground || !inFreeState() || pressAge("down") !== 0) return;
  const platform = oneWayAt(hero.x, hero.y);
  if (!platform) return;
  take("down");
  take("up");
  clearTakeoff();
  hero.droppedPlatform = platform;
  hero.ground = false;
  hero.jumps = 1;
  hero.vy = DROP_SPEED;
}

export function gripWall(dir: number): void {
  if (!dir || hero.ground || !inFreeState() || wallSide(hero.x, hero.y) !== dir) return;
  if (isHeld("up")) {
    hero.vy = Math.min(hero.vy, -WALL_CLIMB_SPEED);
    return;
  }
  hero.vy = Math.min(hero.vy, WALL_SLIDE_SPEED);
}
