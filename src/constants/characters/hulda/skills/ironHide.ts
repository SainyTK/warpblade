import type { SkillDef } from "../../../../types/skill";

/** Iron Hide. Design: docs/skills/hulda.md. Values: start: Grit she is filled to when she takes it; cut: share of a blow a plate lets through; heal: share of max HP a broken plate heals, at most once each 2 s; plates: most plates; drain: share of the Grit drain; fist: Grit a landed J blow gives; knock: 1 a broken plate knocks down foes near; regrow: seconds a plate takes to regrow near foes (evolution); rust: Rust stacks a break throws */
export const IRON_HIDE: SkillDef = {
  id: "h_ironHide",
  name: "Iron Hide",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Your plates get thicker.",
  levels: [
    {
      text: "Start with two plates.",
      values: { start: 50, cut: 0.45, heal: 0, plates: 4, drain: 1, fist: 4, knock: 0, regrow: 0, rust: 0 },
    },
    {
      text: "More HP.",
      values: { start: 50, cut: 0.45, heal: 0, plates: 4, drain: 1, fist: 4, knock: 0, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
    {
      text: "Broken plates heal you.",
      values: { start: 50, cut: 0.45, heal: 0.03, plates: 4, drain: 1, fist: 4, knock: 0, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
    {
      text: "A fifth plate.",
      values: { start: 50, cut: 0.45, heal: 0.03, plates: 5, drain: 1, fist: 4, knock: 0, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
    {
      text: "Plates take more.",
      values: { start: 50, cut: 0.35, heal: 0.03, plates: 5, drain: 1, fist: 4, knock: 0, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
    {
      text: "Grit lasts longer.",
      values: { start: 50, cut: 0.35, heal: 0.03, plates: 5, drain: 0.5, fist: 6, knock: 0, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
    {
      text: "Breaking plates knocks foes down.",
      values: { start: 50, cut: 0.35, heal: 0.03, plates: 5, drain: 0.5, fist: 6, knock: 1, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
    {
      text: "Plates take far more.",
      values: { start: 50, cut: 0.25, heal: 0.06, plates: 5, drain: 0.5, fist: 6, knock: 1, regrow: 0, rust: 0 },
      scale: { hp: 0.1 },
    },
  ],
  evolution: {
    partner: "h_rustShards",
    name: "Living Fortress",
    text: "Six plates. A plate regrows every few seconds while foes are near, and each break sprays rust.",
    row: {
      text: "Six plates that regrow; breaks spray rust.",
      values: { start: 50, cut: 0.25, heal: 0.06, plates: 6, drain: 0.5, fist: 6, knock: 1, regrow: 6, rust: 3 },
      scale: { hp: 0.1 },
    },
  },
};
