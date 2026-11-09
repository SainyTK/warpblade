import type { SkillDef } from "../../../../types/skill";

/** Hot Wax. Design: docs/skills/wenna.md. Values: stacks: Hot Wax stacks a splash adds; damage: ability power a stack deals a second; life: seconds stacks last; radius: the splash's radius round a landing Wick; chill: 1 splashed foes are chilled; relight: 1 relights splash too; swap: 1 Swap arrivals splash; candle: 1 splashed foes that die drip double Wax (evolution) */
export const HOT_WAX: SkillDef = {
  id: "w_hotWax",
  name: "Hot Wax",
  kind: "dot",
  risk: "timed",
  button: "K",
  text: "A Wick that lands splashes hot wax on the foes round it.",
  levels: [
    {
      text: "A landing Wick splashes 2 Hot Wax in 24 px.",
      values: { stacks: 2, damage: 0.15, life: 4, radius: 24, chill: 0, relight: 0, swap: 0, candle: 0 },
    },
    {
      text: "The splash reaches 32 px.",
      values: { stacks: 2, damage: 0.15, life: 4, radius: 32, chill: 0, relight: 0, swap: 0, candle: 0 },
    },
    {
      text: "Splashed foes are chilled.",
      values: { stacks: 2, damage: 0.15, life: 4, radius: 32, chill: 1, relight: 0, swap: 0, candle: 0 },
    },
    {
      text: "Hot Wax burns for 0.2x.",
      values: { stacks: 2, damage: 0.2, life: 4, radius: 32, chill: 1, relight: 0, swap: 0, candle: 0 },
    },
    {
      text: "Relights splash too.",
      values: { stacks: 2, damage: 0.2, life: 4, radius: 32, chill: 1, relight: 1, swap: 0, candle: 0 },
    },
    {
      text: "Swap arrivals splash.",
      values: { stacks: 2, damage: 0.2, life: 4, radius: 32, chill: 1, relight: 1, swap: 1, candle: 0 },
    },
    {
      text: "Hot Wax burns for 0.27x.",
      values: { stacks: 2, damage: 0.27, life: 4, radius: 32, chill: 1, relight: 1, swap: 1, candle: 0 },
    },
    {
      text: "Hot Wax burns for 0.35x.",
      values: { stacks: 2, damage: 0.35, life: 4, radius: 32, chill: 1, relight: 1, swap: 1, candle: 0 },
    },
  ],
  evolution: {
    partner: "w_singe",
    name: "Candlemaker",
    text: "Splashed foes that die drip double Wax.",
    row: {
      text: "Splashed foes drip double Wax.",
      values: { stacks: 2, damage: 0.35, life: 4, radius: 32, chill: 1, relight: 1, swap: 1, candle: 1 },
    },
  },
};
