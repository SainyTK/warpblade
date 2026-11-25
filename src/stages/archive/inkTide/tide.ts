export const TIDE = {
  id: "inkwave",
  damage: [4, 5, 6.4, 8, 11],
  mark: { seconds: 3, bonus: 0.08, perLevel: 0.03 },
  roll: { reach: 46, perLevel: 12, speed: 170, share: 0.4, spare: 14, height: 14 },
  bolt: { height: 20, grow: 0.12 },
} as const;
