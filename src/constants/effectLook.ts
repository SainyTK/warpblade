/**
 * How damage numbers are drawn. A glyph pixel is `cell` image pixels a side: plain numbers and words at 2, crits at 3.
 * A hero's own number is white for its first `pop` seconds. The word over a number leaves after `wordShow`
 * seconds so the foe under it shows again; everything fades over its last `fade` seconds.
 */
export const NUMBER_LOOK = { cell: 2, bigCell: 3, pop: 0.05, wordShow: 0.4, wordFade: 0.1, fade: 0.15 } as const;
