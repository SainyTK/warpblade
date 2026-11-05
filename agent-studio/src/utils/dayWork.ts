import type { DayWork, HeadlineCategory } from "../types.ts";

/** the headline categories a day-work commit may name in its `Headline:` trailer */
export const HEADLINE_CATEGORIES: HeadlineCategory[] = [
  "new-hero",
  "new-stage",
  "new-system",
  "hero-rework",
  "animation-rework",
  "effect-rework",
  "new-skills",
  "new-boss",
  "new-foes",
];

/** fields of one commit in the log format `git log` is asked for, split on unit separators */
const FIELD = "\u001f";
/** commits in that log, split on record separators */
const RECORD = "\u001e";

/** the `git log --format` that `parseDayWork` reads: short hash, subject, then the two trailers */
export const DAY_WORK_FORMAT =
  "%h%x1f%s%x1f%(trailers:key=Addresses-feedback,valueonly,separator=%x2C)%x1f%(trailers:key=Headline,valueonly,separator=%x2C)%x1e";

const isCategory = (value: string): value is HeadlineCategory =>
  HEADLINE_CATEGORIES.includes(value as HeadlineCategory);

/** the feedback issues and headlines the owner's commits since the last release declare in their trailers */
export function parseDayWork(log: string): DayWork {
  const feedback = new Set<number>();
  const headlines: DayWork["headlines"] = [];
  for (const record of log.split(RECORD)) {
    const [sha, subject, feedbackTrailer, headlineTrailer] = record.trim().split(FIELD);
    if (!sha) continue;
    for (const match of (feedbackTrailer ?? "").matchAll(/#?(\d+)/g)) feedback.add(Number(match[1]));
    for (const value of (headlineTrailer ?? "").split(",").map((v) => v.trim())) {
      if (!value) continue;
      if (!isCategory(value)) throw new Error(`Commit ${sha} has an unknown Headline trailer "${value}"`);
      headlines.push({ sha, subject, category: value });
    }
  }
  return { feedback: [...feedback].sort((a, b) => a - b), headlines };
}

export const NO_DAY_WORK: DayWork = { feedback: [], headlines: [] };
