import { PATCH_SECTIONS } from "../../constants/patchSections";
import type { Patch } from "../../types/patch";
import { el } from "../dom";
import { chip } from "../shell/chip";
import { type ContentsItem, contentsList } from "./contentsList";
import { highlightCard } from "./highlightCard";
import { patchBanner } from "./patchBanner";
import { patchSection } from "./patchSection";
import { YOU_ASKED_ID, YOU_ASKED_TITLE, youAsked } from "./youAsked";

/** the studio's letter, one paragraph per blank-line break */
function intro(text: string): HTMLElement {
  const letter = el("div", "patch-intro");
  for (const paragraph of text.split(/\n\s*\n/)) {
    if (paragraph.trim()) letter.append(el("p", undefined, paragraph.trim()));
  }
  return letter;
}

function tldr(tagline: string): HTMLElement {
  const line = el("p", "patch-tldr");
  line.append(chip("TL;DR", "--brass"), el("span", undefined, tagline));
  return line;
}

/** one patch: banner, TL;DR, letter, highlights, contents, each section in order, and the feedback it answered */
export function patchArticle(patch: Patch): HTMLElement {
  const article = el("article", "patch-article");
  article.append(patchBanner(patch), tldr(patch.tagline), intro(patch.intro));

  if (patch.highlights.length) {
    const highlights = el("section", "patch-highlights");
    highlights.setAttribute("aria-label", "Highlights");
    highlights.append(...patch.highlights.map((highlight) => highlightCard(highlight, patch.version)));
    article.append(highlights);
  }

  const sections = PATCH_SECTIONS.flatMap((info) => {
    const section = patch.sections.find((item) => item.id === info.id);
    return section?.entries.length ? [{ info, section }] : [];
  });
  const contents: ContentsItem[] = sections.map(({ info }) => ({ id: info.id, title: info.title }));
  if (patch.feedback.length) contents.push({ id: YOU_ASKED_ID, title: YOU_ASKED_TITLE });
  if (contents.length > 1) article.append(contentsList(contents));

  for (const { info, section } of sections) {
    const node = patchSection(info, section, patch.version);
    node.tabIndex = -1;
    article.append(node);
  }
  if (patch.feedback.length) {
    const asked = youAsked(patch.feedback);
    asked.tabIndex = -1;
    article.append(asked);
  }
  return article;
}
