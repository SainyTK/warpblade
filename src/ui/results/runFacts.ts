import type { RunReport } from "../../types/run";
import { minutesSeconds } from "../../utils/runReport";

/** run time, waves cleared, level reached and foes defeated, side by side */
export function runFacts(report: RunReport): HTMLElement {
  const box = document.createElement("dl");
  box.className = "run-facts";
  const facts: readonly [string, string][] = [
    ["Time", minutesSeconds(report.seconds)],
    ["Waves cleared", String(report.cleared)],
    ["Level", String(report.level)],
    ["Foes defeated", String(report.kills)],
  ];
  for (const [label, value] of facts) {
    const fact = document.createElement("div");
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    fact.append(dt, dd);
    box.append(fact);
  }
  return box;
}
