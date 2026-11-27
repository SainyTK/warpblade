import "./stageScreen.css";
import { STAGE_ORDER } from "../../constants/stageGraph";
import { stageChoice } from "../../game/startRun";
import { sfx } from "../../services/audio";
import { loadStageChoice, saveStageChoice } from "../../services/stageChoice";
import { stagesCleared } from "../../store/stageRecords";
import { isStageOpen } from "../../store/unlocks";
import type { MenuView } from "../../types/menu";
import { el } from "../dom";
import { startStage } from "./menuActions";
import { menuItem } from "./menuItem";
import { focusEntry, onAdjust } from "./menuNav";
import { showScreen } from "./menuState";
import { stageAccent } from "./stageAccent";
import { stageModes } from "./stageModes";
import { stagePage } from "./stagePage";
import { stageTile } from "./stageTile";

const firstShown = (): number => {
  const saved = STAGE_ORDER.indexOf(loadStageChoice() as (typeof STAGE_ORDER)[number]);
  return saved >= 0 ? saved : 0;
};

let preferHyper = stageChoice().hyper;

export function stageScreen(): MenuView {
  const pages = STAGE_ORDER.map(stagePage);
  const panel = el("div", "hero-panel stage-panel");
  panel.tabIndex = 0;
  panel.setAttribute("role", "button");
  panel.dataset.nav = "";
  panel.append(...pages.map((p) => p.root));
  const content = el("div", "menu-main stage-screen");
  let at = 0;

  const modes = stageModes((next) => {
    preferHyper = next;
  });
  const show = (i: number): void => {
    tiles[at].removeAttribute("aria-current");
    pages[at].root.removeAttribute("data-shown");
    at = i;
    const id = STAGE_ORDER[i];
    tiles[i].setAttribute("aria-current", "true");
    pages[i].root.dataset.shown = "";
    content.style.setProperty("--accent", stageAccent(id));
    modes.show(id, preferHyper);
    modes.root.toggleAttribute("data-closed", !isStageOpen(id));
    modes.entry.toggleAttribute("data-nav", isStageOpen(id));
  };
  const tiles = STAGE_ORDER.map((_, i) =>
    stageTile(STAGE_ORDER[i], () => {
      show(i);
      focusEntry(panel);
    }),
  );
  const act = (): void => {
    const id = STAGE_ORDER[at];
    if (!isStageOpen(id)) {
      sfx.denied();
      pages[at].deny();
      return;
    }
    saveStageChoice(id);
    sfx.mapSelect();
    startStage({ stage: id, hyper: modes.isHyper() });
  };
  onAdjust(panel, (step) => show((at + step + STAGE_ORDER.length) % STAGE_ORDER.length));
  panel.addEventListener("click", act);
  const roster = el("div", "hero-roster stage-roster");
  roster.setAttribute("aria-label", "Stages");
  roster.append(...tiles);
  const back = menuItem("Back", () => showScreen("hero"));
  back.classList.add("menu-back");
  content.append(roster, panel, modes.root, back);
  show(firstShown());
  const keys = matchMedia("(any-pointer: fine)").matches
    ? "A D or arrows to look, J or Enter to begin"
    : "Tap a stage to look, tap the panel to begin";
  return {
    title: "Choose a stage",
    subtitle: `${stagesCleared()} of ${STAGE_ORDER.length} cleared. ${keys}`,
    content,
    focus: panel,
  };
}
