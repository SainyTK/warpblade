import { loadIdList, saveIdList } from "./idListStorage";

/** The feedback items this browser voted for, so each +1 button stays used. */
const KEY = "warpblade-feedback-votes-v1";

export function hasVoted(id: number): boolean {
  return loadIdList(KEY).includes(id);
}

export function rememberVote(id: number): void {
  saveIdList(KEY, [...loadIdList(KEY), id]);
}

export function forgetVote(id: number): void {
  saveIdList(
    KEY,
    loadIdList(KEY).filter((voted) => voted !== id),
  );
}
