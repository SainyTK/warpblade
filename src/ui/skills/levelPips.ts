import "./levelPips.css";
import { el } from "../dom";

export function levelPips(total: number, had: number, gaining: boolean): HTMLSpanElement {
  const pips = el("span", "level-pips");
  for (let i = 0; i < total; i++) pips.append(el("i", i < had ? "had" : gaining && i === had ? "gain" : ""));
  return pips;
}
