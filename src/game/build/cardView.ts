import type { CardView } from "../../utils/cards";
import { progress } from "../state";

export const cardView = (): CardView => ({ build: progress.build });
