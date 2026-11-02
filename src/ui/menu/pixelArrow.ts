/** an up arrow on a 7 by 7 pixel grid; the other directions are the same arrow turned */
const ARROW = ["...#...", "..###..", ".#####.", "#######", "..###..", "..###..", "..###.."];
const SVG = "http://www.w3.org/2000/svg";
const ROTATION: Record<string, number> = { up: 0, right: 90, down: 180, left: 270 };

export function pixelArrow(direction: "up" | "down" | "left" | "right"): SVGSVGElement {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", "0 0 7 7");
  svg.setAttribute("class", "arrow");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("shape-rendering", "crispEdges");
  const turn = document.createElementNS(SVG, "g");
  turn.setAttribute("transform", `rotate(${ROTATION[direction]} 3.5 3.5)`);
  svg.append(turn);
  ARROW.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "#") continue;
      const rect = document.createElementNS(SVG, "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", "1");
      rect.setAttribute("height", "1");
      turn.append(rect);
    }
  });
  return svg;
}
