/** Short vibrations through navigator.vibrate where the browser has it. The vibration option sets `enabled`. */
export const haptics = {
  enabled: true,
  pulse(ms: number): void {
    if (!this.enabled || typeof navigator.vibrate !== "function") return;
    navigator.vibrate(ms);
  },
};
