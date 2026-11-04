import { KEYS } from "../constants/keys";

export const directionKey = (side: number): string => (side > 0 ? KEYS.right : KEYS.left);
