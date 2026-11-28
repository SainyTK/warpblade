import { join } from "node:path";
import type { Session } from "../../types/session";
import type { EvidenceItem } from "../types";
import { CLIPS, CLIPS_DIR, STILLS_DIR } from "./constants";
import type { Album } from "./types";

export function createAlbum(outDir: string, scene: string): Album {
  const items: EvidenceItem[] = [];
  const notes: string[] = [];
  const sessions = new Set<Session>();
  let assisted = false;
  const add = (session: Session, file: string, shows: string): void => {
    sessions.add(session);
    items.push({ file, shows, assisted });
  };
  return {
    async still(session, name, shows) {
      const file = `${STILLS_DIR}/${name}.png`;
      await session.still(join(outDir, file));
      add(session, file, shows);
    },
    async window(session, name, shows) {
      const file = `${STILLS_DIR}/${name}.png`;
      await session.page.screenshot({ path: join(outDir, file), type: "png" });
      add(session, file, shows);
    },
    async clip(session: Session, name, shows, play, width) {
      const file = `${CLIPS_DIR}/${name}`;
      await session.record(
        join(outDir, file),
        async () => {
          await session.advance(CLIPS.leadInMs);
          await play();
        },
        width ? { width } : undefined,
      );
      add(session, `${file}.mp4`, shows);
    },
    assisted(how) {
      assisted = true;
      notes.push(`${scene}: from here on assisted: ${how}`);
    },
    note(text) {
      notes.push(`${scene}: ${text}`);
    },
    items: () => [...items],
    notes() {
      const errors = [...new Set([...sessions].flatMap((session) => session.errors()))];
      return errors.length > 0 ? [...notes, `${scene}: page errors: ${errors.join(" | ")}`] : [...notes];
    },
  };
}
