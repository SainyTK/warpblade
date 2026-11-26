import type { RunReport, StageResult } from "../../types/run";
import { minutesSeconds, shortNumber } from "../../utils/runReport";

type Fact = readonly [label: string, value: string];

function runStats(report: RunReport, stage?: StageResult): readonly Fact[] {
  const time: Fact = ["Time", minutesSeconds(report.seconds)];
  const level: Fact = ["Level", String(report.level)];
  const foes: Fact = ["Foes defeated", String(report.kills)];
  if (!stage) return [time, ["Waves cleared", String(report.cleared)], level, foes];
  return [
    ["Grade", stage.grade],
    ["Rifts sealed", `${stage.sealed}/${stage.sealedTotal}`],
    time,
    ["Damage dealt", shortNumber(stage.damage)],
    foes,
    level,
  ];
}

export function runFacts(report: RunReport, stage?: StageResult): HTMLElement {
  const box = document.createElement("dl");
  box.className = "run-facts";
  if (stage) box.classList.add("stage-facts");
  const facts = runStats(report, stage);
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
