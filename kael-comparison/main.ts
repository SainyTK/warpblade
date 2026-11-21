import { PACE } from "../src/constants/stage";
import { applySkin } from "../src/game/hero/skin";
import { KAEL_SKIN } from "../src/heroes/kael/look";
import { REFINED_KAEL_SKIN } from "../src/heroes/kael/look/refined";
import { loadKaelSprite } from "../src/kaelSprite";
import { buildFrames } from "./motion/frames";
import { MOVES } from "./moves";
import { createStage } from "./stage";

function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) {
    throw new Error(`Missing comparison control: ${id}`);
  }
  return node as T;
}

const move = element<HTMLSelectElement>("move");
const motion = element<HTMLSelectElement>("motion");
const view = element<HTMLSelectElement>("view");
const art = element<HTMLSelectElement>("art");
const speed = element<HTMLSelectElement>("speed");
const rig = element<HTMLInputElement>("rig");
const slider = element<HTMLInputElement>("timeline");
const readout = element<HTMLOutputElement>("frame");
const beat = element<HTMLSpanElement>("beat");
const play = element<HTMLButtonElement>("play");
const drawProcedural = createStage(element<HTMLCanvasElement>("procedural"));
const drawSprite = createStage(element<HTMLCanvasElement>("sprite"));
const clips = MOVES.map(({ revised, previous }) => ({
  revised: buildFrames(revised),
  previous: previous ? buildFrames(previous) : undefined,
  loop: revised.cycles ?? false,
}));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let playing = !reducedMotion;
let selected = 2;
let last = performance.now();
let progress = 0;
let drawn = -1;
let sprite: Awaited<ReturnType<typeof loadKaelSprite>> | undefined;

function current() {
  const item = clips[selected];
  return (motion.value === "previous" && item.previous) || item.revised;
}

function paint(): void {
  const { frames } = current();
  const index = Math.floor(progress);
  if (index === drawn) {
    return;
  }
  drawn = index;
  slider.value = String(index);
  slider.setAttribute("aria-valuetext", `Frame ${index + 1} of ${frames.length}`);
  readout.value = `${index + 1} / ${frames.length}`;
  const frame = frames[index];
  beat.textContent = frame.beat;
  beat.hidden = !rig.checked || !frame.beat;
  const zoom = Number(view.value);
  const skin = art.value === "original" ? KAEL_SKIN : REFINED_KAEL_SKIN;
  applySkin(skin);
  drawProcedural(frame, zoom, rig.checked, { skin });
  drawSprite(frame, zoom, rig.checked, sprite ? { sprite } : undefined);
}

function setPlaying(next: boolean): void {
  playing = next;
  last = performance.now();
  play.textContent = playing
    ? "Pause"
    : progress >= current().frames.length - 1 && !clips[selected].loop
      ? "Replay"
      : "Play";
}

function redraw(): void {
  drawn = -1;
  paint();
}

function tick(now: number): void {
  if (playing) {
    const elapsed = Math.max(0, Math.min(now - last, 50)) / 1000;
    const { frames, rate } = current();
    progress += elapsed * rate * PACE * Number(speed.value);
    if (progress >= frames.length) {
      if (clips[selected].loop) {
        progress %= frames.length;
      } else {
        progress = frames.length - 1;
        setPlaying(false);
      }
    }
    paint();
  }
  last = now;
  requestAnimationFrame(tick);
}

function reset(next = playing): void {
  progress = 0;
  slider.max = String(current().frames.length - 1);
  setPlaying(next);
  redraw();
}

for (const [index, item] of MOVES.entries()) {
  move.add(new Option(item.label, String(index)));
}
move.value = String(selected);
move.addEventListener("change", () => {
  selected = Number(move.value);
  const previous = motion.options[1];
  previous.disabled = !clips[selected].previous;
  if (previous.disabled) {
    motion.value = "revised";
  }
  reset(playing || play.textContent === "Replay");
});
motion.addEventListener("change", () => reset());
for (const control of [view, art, rig]) {
  control.addEventListener("change", redraw);
}
slider.addEventListener("input", () => {
  progress = slider.valueAsNumber;
  setPlaying(false);
  paint();
});
play.addEventListener("click", () => {
  if (play.textContent === "Replay") {
    reset(true);
  } else {
    setPlaying(!playing);
  }
});
reset();
requestAnimationFrame(tick);
void loadKaelSprite()
  .then((image) => {
    sprite = image;
    element("sprite-status").hidden = true;
    redraw();
  })
  .catch(() => {
    element("sprite-status").textContent = "Sprite could not load";
  });
