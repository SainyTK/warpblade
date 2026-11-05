import type { Patch } from "../../types/patch";
import { compareVersions } from "../../utils/compareVersions";

/** every patch file, built into the page, newest version first */
const files = import.meta.glob<Patch>("/src/content/patches/*.json", { eager: true, import: "default" });

export const PATCHES: readonly Patch[] = Object.values(files).sort((a, b) => compareVersions(b.version, a.version));
