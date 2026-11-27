import type { JobDef } from "../../../types/job";
import { PRISM_SKIN } from "../look/prism";
import { PRISM_JOB } from "./prism";
import { PRISM_CONTROLS } from "./prismControls";

/** Kael's own job, as the hero screen's job row names it */
export const KAEL_BASE_JOB = "Warp Knight";

/** the jobs Kael can grow into: the Prism Knight, opened by defeating Oakheart with him (docs/heroes/kael.md) */
export const KAEL_JOBS: readonly JobDef[] = [
  {
    id: PRISM_JOB,
    name: "Prism Knight",
    title: "The prism knight",
    blurb:
      "The warp knight who set his crystal into his own guard. His blade lodges prism shards in foes, and his finishers break them.",
    accent: "#b9a2ff",
    skin: PRISM_SKIN,
    controls: PRISM_CONTROLS,
    unlock: {
      id: "job-kael-prism",
      goal: { kind: "hero", stat: "kael.stage.prologue", need: 1 },
      hint: "Defeat Oakheart with Kael.",
    },
    icon: "kael_prism",
  },
];
