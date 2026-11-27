import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { goalBar } from "../menu/goalBar";
import { iconImage } from "./unlockIcon";

export type CodexEntry =
  | { state: "found"; icon: string; name: string; text: string; recipe?: string }
  | { state: "locked"; icon: string; hint: string; name?: string; have?: number; need?: number }
  | { state: "forSale"; icon: string; name: string; hint: string; price: number }
  | { state: "secret" };

const shownName = (entry: CodexEntry): string =>
  entry.state === "found" || entry.state === "forSale"
    ? entry.name
    : entry.state === "locked"
      ? (entry.name ?? "???")
      : "???";

function ariaLabel(entry: CodexEntry): string {
  switch (entry.state) {
    case "found":
      return `${entry.name}. ${entry.text}${entry.recipe ? ` ${entry.recipe}` : ""}`;
    case "forSale":
      return `${entry.name}. ${entry.hint} ${entry.price} gold`;
    case "locked":
      return `${entry.name ?? "Not found yet"}. ${entry.hint}`;
    case "secret":
      return "Secret, not found yet";
  }
}

export function codexRow(entry: CodexEntry, evolution = false): HTMLElement {
  const row = el("div", "list-row codex-item");
  row.tabIndex = -1;
  row.dataset.nav = "";
  row.dataset.state = entry.state;
  if (evolution) row.dataset.evolution = "";
  const frame = el("span", "row-icon");
  if (entry.state === "secret") frame.append(el("span", "ach-unknown", "?"));
  else frame.append(iconImage(entry.icon));
  const head = el("span", "row-head");
  head.append(el("span", "row-name", shownName(entry)));
  const body = el("span", "row-body");
  body.append(head);
  if (entry.state === "found") {
    body.append(el("span", "row-text", entry.text));
    if (entry.recipe) body.append(el("span", "codex-recipe", entry.recipe));
  } else if (entry.state === "secret") body.append(el("span", "row-text", "???"));
  else body.append(el("span", "row-text", entry.hint));
  if (entry.state === "locked" && entry.need && entry.need > 1) body.append(goalBar(entry.have ?? 0, entry.need));
  row.append(frame, body);
  if (entry.state === "forSale") row.append(coinAmount(entry.price, "row-price"));
  row.setAttribute("aria-label", ariaLabel(entry));
  return row;
}
