import { sfx } from "../../services/audio";
import { chooseJob, chosenJob, jobOpen } from "../../store/jobs";
import type { CharacterDef } from "../../types/character";
import { el } from "../dom";
import { lockIcon } from "./lockIcon";
import { onAdjust } from "./menuNav";

/** how long a refused choice shakes the chip */
const DENY_MS = 400;

/** one chip of the row: the hero's own job (id null) or one of their jobs */
interface JobOption {
  id: string | null;
  name: string;
  accent: string;
  open: boolean;
  hint: string;
}

const optionsOf = (c: CharacterDef): JobOption[] => [
  { id: null, name: c.baseJob ?? c.name, accent: c.accent, open: true, hint: "" },
  ...(c.jobs ?? []).map((j) => ({ id: j.id, name: j.name, accent: j.accent, open: jobOpen(j), hint: j.unlock.hint })),
];

export interface JobRow {
  /** the row and the hints of its locked jobs under it */
  root: HTMLElement;
  /** the entry the keys move to */
  entry: HTMLElement;
}

function shake(node: HTMLElement): void {
  node.classList.remove("deny");
  void node.offsetWidth;
  node.classList.add("deny");
  setTimeout(() => node.classList.remove("deny"), DENY_MS);
}

/**
 * The hero screen's JOB row for a hero with jobs: one chip per job, the chosen one filled with its colour, a locked one
 * dimmed with the padlock and its hint under the row. Left and Right step through the open jobs and a tap chooses one;
 * a locked job is refused. The choice is kept at once, and `changed` tells the page to show it.
 */
export function jobRow(c: CharacterDef, changed: (job: string | null) => void): JobRow {
  const options = optionsOf(c);
  const root = el("div", "hero-jobs");
  const entry = el("div", "hero-job-row");
  entry.tabIndex = 0;
  entry.setAttribute("role", "radiogroup");
  entry.setAttribute("aria-label", "Job");
  const chips = options.map((o) => {
    const chip = el("button", "hero-job");
    chip.type = "button";
    chip.tabIndex = -1;
    chip.setAttribute("role", "radio");
    chip.style.setProperty("--job", o.accent);
    if (!o.open) {
      chip.dataset.locked = "";
      chip.setAttribute("aria-disabled", "true");
      chip.append(lockIcon());
    }
    chip.append(o.name);
    return chip;
  });
  const show = (): void => {
    const at = chosenJob(c.id);
    options.forEach((o, i) => {
      chips[i].setAttribute("aria-checked", String(o.id === at));
    });
  };
  const choose = (o: JobOption, chip: HTMLElement): void => {
    if (!o.open) {
      sfx.denied();
      shake(chip);
      return;
    }
    if (o.id === chosenJob(c.id) || !chooseJob(c.id, o.id)) return;
    show();
    changed(o.id);
  };
  options.forEach((o, i) => {
    chips[i].addEventListener("click", (ev) => {
      // a chip chooses the job; only the rest of the panel starts the run
      ev.stopPropagation();
      entry.focus({ preventScroll: true });
      choose(o, chips[i]);
    });
  });
  onAdjust(entry, (step) => {
    const from = options.findIndex((o) => o.id === chosenJob(c.id));
    for (let k = 1; k < options.length; k++) {
      const i = (from + step * k + options.length * k) % options.length;
      if (!options[i].open) continue;
      choose(options[i], chips[i]);
      return;
    }
    sfx.denied();
    shake(chips[(from + step + options.length) % options.length]);
  });
  const label = el("span", "hero-job-label", "Job");
  label.setAttribute("aria-hidden", "true");
  const list = el("span", "hero-job-chips");
  list.append(...chips);
  entry.append(label, list);
  root.append(entry);
  for (const o of options) if (!o.open) root.append(el("span", "hero-job-hint", o.hint));
  show();
  return { root, entry };
}
