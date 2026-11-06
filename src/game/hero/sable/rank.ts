import { progress } from "../../state";

/** ranks learned of one of Sable's skill nodes */
export const rankOf = (id: string): number => progress.ranks[id] ?? 0;
