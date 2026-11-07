import { BOONS } from "../../constants/boons";
import type { Card } from "../../types/build";
import type { CharacterDef } from "../../types/character";
import type { PickWire } from "../../types/coop";
import type { PickAnswer } from "../../types/pick";
import { availableCards, cardKey } from "../../utils/cards";
import { cardView } from "../build/cardView";

/** a card a guest answered, back from its kind and id; null when the hero cannot be dealt it now */
function readCard(c: CharacterDef, wire: PickWire): Card | null {
  if (wire.type === "boon") return BOONS.some((b) => b.id === wire.id) ? { type: "boon", id: wire.id } : null;
  const key = `${wire.type}:${wire.id}`;
  return availableCards(c, cardView()).find((card) => cardKey(card) === key) ?? null;
}

/** a guest's answer to the cards, read against their hero; null when it names a card they cannot have */
export function readAnswer(c: CharacterDef, answer: PickAnswer<PickWire>): PickAnswer<Card> | null {
  if (answer.t !== "take" && answer.t !== "banish") return answer;
  const card = readCard(c, answer.card);
  return card ? { t: answer.t, card } : null;
}

/** a card as it crosses the network */
const writeCard = (card: Card): PickWire => ({ type: card.type, id: card.id });

export function writeAnswer(answer: PickAnswer<Card>): PickAnswer<PickWire> {
  if (answer.t !== "take" && answer.t !== "banish") return answer;
  return { t: answer.t, card: writeCard(answer.card) };
}
