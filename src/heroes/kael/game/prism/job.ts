import { heroJob } from "../../../../game/hero/job";
import { PRISM_JOB } from "../../constants/prism";

/** Kael fights as the Prism Knight in this run */
export const isPrism = (): boolean => heroJob() === PRISM_JOB;
