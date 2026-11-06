import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ROSTER_FILE } from "../constants.ts";

/** how many heroes the game ships: the names in the CHARACTERS list of the roster file */
export async function heroCount(workdir: string): Promise<number> {
  const source = await readFile(join(workdir, ROSTER_FILE), "utf8");
  const list = /CHARACTERS[^=]*=\s*\[([^\]]*)\]/.exec(source)?.[1];
  if (list === undefined) throw new Error(`No CHARACTERS list in ${ROSTER_FILE}`);
  return list.split(",").filter((name) => name.trim()).length;
}
