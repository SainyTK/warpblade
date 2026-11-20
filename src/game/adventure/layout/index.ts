import { depths } from "./depths";
import { lastWatch } from "./last-watch";
import { nightfall } from "./nightfall";
import { storm } from "./storm";
import { sunlit } from "./sunlit";
import { threshold } from "./threshold";
import { veil } from "./veil";

export const approaches = [sunlit, storm, nightfall, veil, threshold, depths, lastWatch] as const;
