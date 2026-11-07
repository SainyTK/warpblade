import type { Unlock } from "../../types/unlock";
import { iconImage } from "./unlockIcon";

function span(cls: string, text = ""): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

/** what one Codex row shows: found, locked with a silhouette and a hint, or secret with only ??? */
export type CodexEntry =
  | { state: "found"; icon: string; name: string; text: string; recipe?: string }
  | { state: "locked"; icon: string; hint: string }
  | { state: "secret" };

/** a row for a found thing, or for an unlock still to find: its silhouette and hint, or ??? while secret */
export function entryOf(
  unlock: Unlock | undefined,
  found: boolean,
  icon: string,
  name: string,
  text: string,
): CodexEntry {
  if (found || !unlock) return { state: "found", icon, name, text };
  if (unlock.secret) return { state: "secret" };
  return { state: "locked", icon, hint: unlock.hint };
}

/**
 * One entry of the Codex, laid out like a shop row. An evolution sits under its relic, indented. Arrows and the gamepad
 * move through the rows.
 */
export function codexRow(entry: CodexEntry, evolution = false): HTMLElement {
  const row = document.createElement("div");
  row.className = "shop-item codex-item";
  row.tabIndex = -1;
  row.dataset.nav = "";
  row.dataset.state = entry.state;
  if (evolution) row.dataset.evolution = "";
  const frame = span("shop-icon");
  if (entry.state === "secret") frame.append(span("ach-unknown", "?"));
  else frame.append(iconImage(entry.icon));
  const head = span("shop-head");
  head.append(span("shop-name", entry.state === "found" ? entry.name : "???"));
  const body = span("shop-body");
  body.append(head);
  if (entry.state === "found") {
    body.append(span("shop-text", entry.text));
    if (entry.recipe) body.append(span("codex-recipe", entry.recipe));
  } else body.append(span("shop-text", entry.state === "locked" ? entry.hint : "???"));
  row.append(frame, body);
  row.setAttribute(
    "aria-label",
    entry.state === "found"
      ? `${entry.name}. ${entry.text}${entry.recipe ? ` ${entry.recipe}` : ""}`
      : entry.state === "locked"
        ? `Not found yet. ${entry.hint}`
        : "Secret, not found yet",
  );
  return row;
}
