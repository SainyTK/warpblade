/** the keys bound to each action, in key map order: { left: ["ArrowLeft", "KeyA"], ... } */
export function keysByAction<A extends string>(keymap: Record<string, A>): Map<A, string[]> {
  const out = new Map<A, string[]>();
  for (const [code, action] of Object.entries(keymap)) out.set(action, [...(out.get(action) ?? []), code]);
  return out;
}

const NAMES: Record<string, string> = {
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Escape: "Esc",
  Space: "Space",
  Enter: "Enter",
};

/** a key's name as printed on its cap: KeyA is A, Escape is Esc */
export function keyName(code: string): string {
  return NAMES[code] ?? code.replace(/^(Key|Digit)/, "");
}
