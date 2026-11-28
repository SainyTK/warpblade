import type { Session } from "../../types/session";
import { ROOM_MODULES } from "./constants";
import type { TrailModule } from "./pageModules";
import type { Wall } from "./types";

export function readWalls(session: Session): Promise<Wall[]> {
  return session.evaluate(async (path) => {
    const { trail } = (await import(path)) as TrailModule;
    return (trail?.route.walls ?? []).map((wall) => ({ x0: wall.x0, x1: wall.x1, y: wall.y }));
  }, ROOM_MODULES.trail);
}
