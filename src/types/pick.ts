/** what a player does with the cards of a pick: take one, skip the pick, deal again, or banish one and deal again.
 *  `C` is a card in play, or a card's kind and id on the wire. */
export type PickAnswer<C> = { t: "take"; card: C } | { t: "skip" } | { t: "reroll" } | { t: "banish"; card: C };
