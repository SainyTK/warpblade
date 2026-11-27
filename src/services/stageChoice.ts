const KEY = "warpblade-stage";

export function loadStageChoice(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveStageChoice(id: string): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    return;
  }
}
