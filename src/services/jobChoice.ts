const KEY = "warpblade-jobs";

/** the job last chosen for each hero in this browser, by hero id, as parsed JSON; nothing when there is none, it is not
 *  JSON, or storage is refused */
export function loadJobChoice(): unknown {
  try {
    const text = localStorage.getItem(KEY);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
export function saveJobChoice(choice: Readonly<Record<string, string>>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    // private windows can refuse storage; the choice then lasts for this visit only
  }
}
