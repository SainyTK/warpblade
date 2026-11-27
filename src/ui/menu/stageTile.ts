import { STAGES } from "../../stages";
import { stageBest } from "../../store/stageRecords";
import { isStageOpen } from "../../store/unlocks";
import type { StageId } from "../../types/campaign";
import { el } from "../dom";
import { fitPixelImage } from "./fitPixelImage";
import { foePortrait } from "./foePortrait";
import { lockIcon } from "./lockIcon";
import { stageAccent } from "./stageAccent";

const TILE = 44;

export function stageTile(id: StageId, pick: () => void): HTMLButtonElement {
  const stage = STAGES[id];
  const tile = el("button", "stage-tile");
  tile.type = "button";
  tile.tabIndex = -1;
  tile.style.setProperty("--accent", stageAccent(id));
  tile.setAttribute("aria-label", stage.name);
  const img = el("img", "stage-tile-boss");
  img.src = foePortrait(stage.boss);
  img.alt = "";
  fitPixelImage(img, TILE, TILE, 1);
  tile.append(img);
  const grade = stageBest(id)?.bestGrade;
  if (!isStageOpen(id)) {
    tile.dataset.locked = "";
    tile.append(lockIcon());
  } else if (grade && (stageBest(id)?.clears ?? 0) > 0) tile.append(el("span", "stage-tile-grade", grade));
  tile.addEventListener("click", pick);
  return tile;
}
