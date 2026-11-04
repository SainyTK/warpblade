import { prefersReducedMotion } from "../../services/reducedMotion";
import type { PatchMedia } from "../../types/patch";
import { el } from "../dom";

const mediaUrl = (version: string, file: string): string =>
  `/patches/${encodeURIComponent(version)}/${encodeURIComponent(file)}`;

function markLoaded(box: HTMLElement): void {
  box.dataset.loaded = "";
}

function markFailed(box: HTMLElement, alt: string): void {
  box.dataset.failed = "";
  box.replaceChildren(alt);
}

function image(box: HTMLElement, media: PatchMedia, version: string): HTMLImageElement {
  const img = el("img");
  img.alt = media.alt;
  img.width = media.width;
  img.height = media.height;
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("load", () => markLoaded(box));
  img.addEventListener("error", () => markFailed(box, media.alt));
  img.src = mediaUrl(version, media.file);
  return img;
}

/** a silent loop that plays like a GIF; with reduced motion it waits on its poster behind a Play button */
function clip(box: HTMLElement, media: PatchMedia, version: string): HTMLElement[] {
  const video = el("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.width = media.width;
  video.height = media.height;
  video.setAttribute("aria-label", media.alt);
  if (media.poster) video.poster = mediaUrl(version, media.poster);
  video.addEventListener("loadeddata", () => markLoaded(box));
  video.addEventListener("error", () => markFailed(box, media.alt));
  video.src = mediaUrl(version, media.file);
  if (!prefersReducedMotion()) {
    video.autoplay = true;
    return [video];
  }
  // without autoplay only the metadata arrives, so the poster shows from then
  video.addEventListener("loadedmetadata", () => markLoaded(box));
  const play = el("button", "button media-play", "Play");
  play.type = "button";
  play.addEventListener("click", () => {
    if (video.paused) void video.play();
    else video.pause();
  });
  video.addEventListener("play", () => {
    box.dataset.playing = "";
    play.textContent = "Pause";
  });
  video.addEventListener("pause", () => {
    delete box.dataset.playing;
    play.textContent = "Play";
  });
  return [video, play];
}

/** a patch picture or clip in a box reserved from its size, fading in once the file arrives */
export function mediaBox(media: PatchMedia, version: string, className = ""): HTMLElement {
  const box = el("figure", `media-box ${className}`.trim());
  box.style.aspectRatio = `${media.width} / ${media.height}`;
  if (media.kind === "video") box.append(...clip(box, media, version));
  else box.append(image(box, media, version));
  return box;
}
