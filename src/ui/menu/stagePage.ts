import { ENEMIES } from "../../constants/enemies";
import { STAGES } from "../../stages";
import { stageBest } from "../../store/stageRecords";
import { isStageOpen } from "../../store/unlocks";
import type { StageId } from "../../types/campaign";
import type { StageBest } from "../../types/records";
import { minutesSeconds } from "../../utils/runReport";
import { stageLockText } from "../../utils/stageLock";
import { el } from "../dom";
import { fitPixelImage } from "./fitPixelImage";
import { foePortrait } from "./foePortrait";
import { lockIcon } from "./lockIcon";
import { shakeNode } from "./shakeNode";

const PORTRAIT = { width: 190, height: 150, most: 3 } as const;

export interface StagePage {
  root: HTMLElement;
  deny: () => void;
}

function bestText(best: StageBest | null): string {
  if (!best) return "No run yet";
  const parts = [`Grade ${best.bestGrade ?? "E"}`];
  if (best.fastestClear !== null) parts.push(minutesSeconds(best.fastestClear));
  parts.push(`Level ${best.highestLevel}`);
  return parts.join("   ");
}

function fact(label: string, value: string): HTMLElement {
  const row = el("div", "stage-info-row");
  row.append(el("dt", "", label), el("dd", "", value));
  return row;
}

export function stagePage(id: StageId): StagePage {
  const stage = STAGES[id];
  const root = el("div", "stage-page");
  const portrait = el("img", "stage-portrait");
  portrait.src = foePortrait(stage.boss);
  portrait.alt = ENEMIES[stage.boss].name;
  fitPixelImage(portrait, PORTRAIT.width, PORTRAIT.height, PORTRAIT.most);
  const facts = el("dl", "stage-info");
  facts.append(fact("Boss", ENEMIES[stage.boss].name), fact("Mini boss", stage.mini.name));
  facts.append(fact("Best", bestText(stageBest(id))));
  const hyperBest = stageBest(id, true);
  if (hyperBest) facts.append(fact("Hyper best", bestText(hyperBest)));
  const twist = el("p", "stage-twist");
  twist.append(el("b", "", stage.twist.name), ` ${stage.twist.text}`);
  root.append(portrait, el("span", "stage-name", stage.name), el("span", "stage-blurb", stage.mapBlurb), facts, twist);
  const lock = el("span", "stage-lock");
  if (!isStageOpen(id)) {
    root.dataset.locked = "";
    lock.append(lockIcon(), stageLockText(id));
    root.append(lock);
  }
  return { root, deny: () => shakeNode(lock) };
}
