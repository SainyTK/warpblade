import type { RunReport, SourceResult } from "../../types/run";
import { bySourceDamage, shortNumber, sourceDps, topDpsSource } from "../../utils/runReport";
import { iconUrl } from "../skills/icons/iconImage";
import { sourceIcon, sourceName } from "./sourceLabel";

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = "", text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

/** a skill's level, or Evolved; the hero's own sources have none */
function levelTag(s: SourceResult): HTMLElement | null {
  if (s.evolved) return el("span", "source-level evolved", "Evolved");
  return s.level ? el("span", "source-level", `Lv ${s.level}`) : null;
}

/** the icon, name, level and a bar of its share of the top source's damage */
function sourceCell(s: SourceResult, report: RunReport, most: number): HTMLTableCellElement {
  const cell = el("th", "source");
  cell.scope = "row";
  const icon = el("img");
  icon.src = iconUrl(sourceIcon(s, report));
  icon.alt = "";
  icon.width = 16;
  icon.height = 16;
  const frame = el("span", "source-icon");
  frame.append(icon);
  const head = el("span", "source-head");
  head.append(el("span", "source-name", sourceName(s, report)));
  const level = levelTag(s);
  if (level) head.append(level);
  const bar = el("span", "source-bar");
  bar.style.setProperty("--share", String(most > 0 ? s.damage / most : 0));
  const body = el("span", "source-body");
  body.append(head, bar);
  const inner = el("span", "source-cell");
  inner.append(frame, body);
  cell.append(inner);
  return cell;
}

function numberCell(value: number, top: boolean, label: string): HTMLTableCellElement {
  const cell = el("td", top ? "top" : "", shortNumber(value));
  if (top) cell.title = label;
  return cell;
}

/** every source of a run by damage: icon, name, level, a bar, total damage and damage per second over the time held */
export function sourceTable(report: RunReport): HTMLTableElement {
  const rows = bySourceDamage(report.sources);
  const most = rows[0]?.damage ?? 0;
  const fastest = topDpsSource(rows);
  const table = el("table", "sources");
  const caption = el("caption", "", "Damage by source");
  const head = el("thead");
  const titles = el("tr");
  for (const [text, cls] of [
    ["Source", "source"],
    ["Damage", ""],
    ["DPS", ""],
  ]) {
    const th = el("th", cls, text);
    th.scope = "col";
    titles.append(th);
  }
  head.append(titles);
  const body = el("tbody");
  rows.forEach((s, i) => {
    const row = el("tr");
    if (i === 0) row.dataset.top = "";
    row.append(
      sourceCell(s, report, most),
      numberCell(s.damage, i === 0, "Most damage"),
      numberCell(sourceDps(s), s === fastest, "Highest damage per second"),
    );
    body.append(row);
  });
  table.append(caption, head, body);
  return table;
}
