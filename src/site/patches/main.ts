import { SITE_PAGES } from "../../constants/sitePages";
import { startAnalytics } from "../../services/analytics";
import type { Patch } from "../../types/patch";
import { el } from "../dom";
import { emptyState } from "../shell/emptyState";
import { mountPage } from "../shell/pageShell";
import { archiveList } from "./archiveList";
import { archiveSelect } from "./archiveSelect";
import { patchArticle } from "./patchArticle";
import { PATCHES } from "./patchData";

/** the patch named in the address, or the latest */
function patchFromHash(latest: Patch): Patch {
  const version = decodeURIComponent(window.location.hash.slice(1));
  return PATCHES.find((patch) => patch.version === version) ?? latest;
}

function start(): void {
  startAnalytics();
  const main = mountPage("patches");
  const latest = PATCHES[0];
  if (!latest) {
    const feedback = SITE_PAGES.find((page) => page.id === "feedback");
    main.append(emptyState("No patch notes yet.", feedback));
    return;
  }
  const archive = archiveList(PATCHES);
  const picker = archiveSelect(PATCHES);
  const slot = el("div", "patch-slot");
  const layout = el("div", "patch-layout");
  layout.append(picker.element, archive.element, slot);
  main.append(layout);

  const show = (): void => {
    const patch = patchFromHash(latest);
    slot.replaceChildren(patchArticle(patch));
    archive.setCurrent(patch.version);
    picker.setCurrent(patch.version);
    document.title = `Patch ${patch.version}: ${patch.title} | Warpblade`;
  };
  show();
  window.addEventListener("hashchange", () => {
    show();
    window.scrollTo({ top: 0 });
  });
}

start();
