import type { SpriteCanvas } from "../../../engine/sprite";
import { ARTS } from "../../../stages/arts";
import type { ArtId, ElementId } from "../../../types/campaign";
import { hex, WHITE } from "../../../utils/color";
import { fill } from "./parts";

type Drawing = (s: SpriteCanvas) => void;

const tones = (d: string, h: string, l: string) => ({ d: hex(d), h: hex(h), l: hex(l), w: WHITE });

const ROWS: Record<ElementId, { rows: string[]; map: ReturnType<typeof tones> }> = {
  blaze: {
    map: tones("#a8261a", "#ff8a2a", "#ffe26b"),
    rows: [
      "......d......",
      ".....dhd.....",
      "....dhhd..d..",
      "...dhhhhd.hd.",
      "..dhhlhhhdhd.",
      "..dhlllhhhhd.",
      ".dhhlwllhhhhd",
      ".dhllwwllhhhd",
      ".dhlwwwwlhhhd",
      ".dhlwwwwllhhd",
      "..dhllwlllhd.",
      "...dhhllhhd..",
      "....ddddddd..",
    ],
  },
  frost: {
    map: tones("#1c4a7a", "#8fd3f2", "#e9fcff"),
    rows: [
      "......l......",
      "...h..l..h...",
      "....h.l.h....",
      ".h...hlh...h.",
      "..hh.hwh.hh..",
      "....hlwlh....",
      "lllllwwwlllll",
      "....hlwlh....",
      "..hh.hwh.hh..",
      ".h...hlh...h.",
      "....h.l.h....",
      "...h..l..h...",
      "......l......",
    ],
  },
  storm: {
    map: tones("#7a5a10", "#ffe066", "#fff8c8"),
    rows: [
      "......dddd...",
      ".....dhhld...",
      "....dhhld....",
      "...dhhld.....",
      "..dhhlddddd..",
      ".dhhwwwwhhd..",
      ".ddddlwhhd...",
      "....dlhhd....",
      "...dlhhd.....",
      "...dhhd......",
      "..dhhd.......",
      "..dhd........",
      "..dd.........",
    ],
  },
  venom: {
    map: tones("#2a5a14", "#9fe05a", "#e2ffb0"),
    rows: [
      "......d......",
      ".....dhd.....",
      ".....dhd.....",
      "....dhlhd....",
      "...dhhlhhd...",
      "..dhhlwlhhd..",
      "..dhlwwlhhd..",
      ".dhhlwlhhhhd.",
      ".dhhhlhhhhhd.",
      ".dhhhhhhhhhd.",
      "..dhhhhhhhd..",
      "...ddhhhdd...",
      ".....ddd.....",
    ],
  },
  void: {
    map: tones("#2a1a62", "#b4a8ff", "#efe8ff"),
    rows: [
      "....ddddd....",
      "..ddhhhhhdd..",
      ".dhhhllhhhhd.",
      ".dhhl...lhhd.",
      "dhhl.....lhhd",
      "dhl...w...lhd",
      "dhl..www..lhd",
      "dhl...w...lhd",
      "dhhl.....lhhd",
      ".dhhl...lhhd.",
      ".dhhhllhhhhd.",
      "..ddhhhhhdd..",
      "....ddddd....",
    ],
  },
};

const elementDrawing =
  (id: ElementId): Drawing =>
  (s) =>
    fill(s, () => s.pixels(ROWS[id].rows, ROWS[id].map, 1.5, 1.5));

export const ELEMENT_ICONS: Record<string, Drawing> = Object.fromEntries(
  (Object.keys(ROWS) as ElementId[]).map((id) => [`el_${id}`, elementDrawing(id)]),
);

export const ART_ICONS: Record<string, Drawing> = Object.fromEntries(
  (Object.keys(ARTS) as ArtId[]).map((id) => [`art_${id}`, elementDrawing(ARTS[id].element)]),
);

export const elementIcon = (id: ElementId): string => `el_${id}`;
export const artIcon = (id: ArtId): string => `art_${id}`;
