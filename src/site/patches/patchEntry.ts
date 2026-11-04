import { PATCH_TAGS } from "../../constants/patchSections";
import type { PatchEntry } from "../../types/patch";
import { el } from "../dom";
import { chip } from "../shell/chip";
import { changeLine } from "./changeLine";
import { feedbackLinks } from "./feedbackLinks";
import { mediaBox } from "./mediaBox";

/** one hero, foe, item or fix: what it means, why, and each change */
export function patchEntry(entry: PatchEntry, version: string): HTMLElement {
  const article = el("article", "patch-entry");
  const head = el("header", "entry-head");
  const tag = PATCH_TAGS[entry.tag];
  head.append(el("h3", "entry-name", entry.name), chip(tag.label, tag.accent));
  article.append(head, el("p", "entry-summary", entry.summary), el("p", "entry-context", entry.context));
  if (entry.changes.length) {
    const list = el("ul", "entry-changes");
    list.append(...entry.changes.map(changeLine));
    article.append(list);
  }
  if (entry.media) article.append(mediaBox(entry.media, version, "entry-media"));
  if (entry.feedback?.length) article.append(feedbackLinks(entry.feedback));
  return article;
}
