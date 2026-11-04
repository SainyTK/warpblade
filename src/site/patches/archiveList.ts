import { PATCH_KIND_LABELS } from "../../constants/patchSections";
import type { Patch } from "../../types/patch";
import { formatDay } from "../../utils/formatDate";
import { el, link } from "../dom";

export interface ArchiveList {
  element: HTMLElement;
  setCurrent(version: string): void;
}

export const patchHref = (version: string): string => `#${version}`;

/** every patch beside the article on wide screens, with the open one marked */
export function archiveList(patches: readonly Patch[]): ArchiveList {
  const element = el("nav", "patch-archive panel");
  element.setAttribute("aria-labelledby", "archive-title");
  const title = el("h2", "archive-title", "All patches");
  title.id = "archive-title";
  const list = el("ol", "archive-list");
  const rows = patches.map((patch) => {
    const row = link(patchHref(patch.version), "", "archive-item");
    row.dataset.kind = patch.kind;
    const top = el("span", "archive-top");
    const date = el("time", "archive-date", formatDay(patch.date));
    date.dateTime = patch.date;
    top.append(el("span", "archive-version", patch.version), el("span", "archive-kind", PATCH_KIND_LABELS[patch.kind]));
    row.append(top, el("span", "archive-name", patch.title), date);
    const item = el("li");
    item.append(row);
    list.append(item);
    return { version: patch.version, row };
  });
  element.append(title, list);
  return {
    element,
    setCurrent(version) {
      for (const { version: own, row } of rows) {
        if (own === version) row.setAttribute("aria-current", "page");
        else row.removeAttribute("aria-current");
      }
    },
  };
}
