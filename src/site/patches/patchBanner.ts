import { PATCH_KIND_LABELS } from "../../constants/patchSections";
import type { Patch } from "../../types/patch";
import { formatDay } from "../../utils/formatDate";
import { el, setAccent } from "../dom";
import { chip } from "../shell/chip";

const KIND_ACCENT = { big: "--brass", small: "--crystal" } as const;

/** "Patch 0.2.0", the title, the date and the size of the patch */
export function patchBanner(patch: Patch): HTMLElement {
  const banner = el("header", "patch-banner panel");
  setAccent(banner, KIND_ACCENT[patch.kind]);
  const meta = el("p", "patch-banner-meta");
  const date = el("time", undefined, formatDay(patch.date));
  date.dateTime = patch.date;
  meta.append(date, chip(PATCH_KIND_LABELS[patch.kind], KIND_ACCENT[patch.kind]));
  banner.append(
    el("p", "patch-banner-version", `Patch ${patch.version}`),
    el("h2", "patch-banner-title", patch.title),
    meta,
  );
  return banner;
}
