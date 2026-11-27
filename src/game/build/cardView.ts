import { usesDrill } from "../../drill";
import type { CardView } from "../../utils/cards";
import { progress } from "../state";

export const cardView = (): CardView => ({ build: progress.build, level: progress.level, charged: usesDrill() });
