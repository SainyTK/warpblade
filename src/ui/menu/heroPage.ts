import { chosenJob } from "../../store/jobs";
import { heroPrice, heroUnlocked, metaBonus } from "../../store/meta";
import type { CharacterDef } from "../../types/character";
import type { Stats } from "../../types/stats";
import { jobBlurb, jobTitle } from "../../utils/jobs";
import { computeStats } from "../../utils/stats";
import { el } from "../dom";
import { type HeroLock, heroLock } from "./heroLock";
import { heroPortrait } from "./heroPortrait";
import { jobRow } from "./jobRow";

/** each stat as a share of this, for the bars; full is about the strongest hero with every shop level bought */
const STAT_BARS: readonly { label: string; value: (s: Stats) => number; full: number }[] = [
  { label: "HP", value: (s) => s.hp, full: 180 },
  { label: "Attack", value: (s) => s.ad, full: 18 },
  { label: "Magic", value: (s) => s.ap, full: 15 },
  { label: "MP", value: (s) => s.mp, full: 150 },
  { label: "Speed", value: (s) => s.move * s.aspd, full: 1.15 },
];

const share = (value: number, full: number): string => `${Math.round(Math.min(1, value / full) * 100)}%`;

/** the hero's own stats at level 1, and in a lighter part what the shop adds, which every hero gets alike */
function statBars(c: CharacterDef): HTMLElement {
  const list = el("dl", "hero-stats");
  const own = computeStats(c, 1);
  const bought = computeStats(c, 1, [], metaBonus());
  for (const s of STAT_BARS) {
    const row = el("div", "");
    const bar = el("dd", "hero-bar");
    const fill = el("span", "");
    fill.style.width = share(s.value(own), s.full);
    const extra = el("i", "");
    extra.style.width = share(s.value(bought), s.full);
    bar.append(extra, fill);
    row.append(el("dt", "", s.label), bar);
    list.append(row);
  }
  return list;
}

/** what the hero brings to a run besides stats: their special */
function traits(c: CharacterDef): HTMLElement {
  const box = el("p", "hero-traits");
  box.append(`Ultimate: ${c.special.name}`);
  return box;
}

export interface HeroPage {
  root: HTMLElement;
  /** the padlock and price, for a hero still to unlock */
  lock: HeroLock | null;
  /** the job row's entry, for a hero with jobs */
  jobs: HTMLElement | null;
}

/**
 * everything the hero screen tells about one hero: portrait, name, title, stats, the job row for a hero with jobs,
 * traits, blurb, and the price while locked. The portrait, title and blurb follow the chosen job, and `changed` hears of
 * each new choice.
 */
export function heroPage(c: CharacterDef, changed: (job: string | null) => void): HeroPage {
  const root = el("section", "hero-page");
  root.style.setProperty("--accent", c.accent);
  const img = el("img", "hero-portrait");
  const title = el("span", "hero-title");
  const blurb = el("p", "hero-blurb");
  const wear = (job: string | null): void => {
    img.src = heroPortrait(c, job);
    img.alt = `${c.name}, ${jobTitle(c, job).toLowerCase()}`;
    title.textContent = jobTitle(c, job);
    blurb.textContent = jobBlurb(c, job);
  };
  wear(chosenJob(c.id));
  const name = el("strong", "hero-name", c.name);
  root.append(img, name, title, statBars(c));
  const row = c.jobs?.length
    ? jobRow(c, (job) => {
        wear(job);
        changed(job);
      })
    : null;
  if (row) root.append(row.root);
  root.append(traits(c), blurb);
  const jobs = row?.entry ?? null;
  const price = heroPrice(c.id);
  if (price === null || heroUnlocked(c.id)) return { root, lock: null, jobs };
  root.dataset.locked = "";
  img.alt = `${c.name}, locked`;
  const lock = heroLock(price);
  root.append(lock.root);
  return { root, lock, jobs };
}
