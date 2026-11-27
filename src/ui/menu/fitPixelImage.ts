const STEP = 0.5;

export function fitPixelImage(img: HTMLImageElement, width: number, height: number, most: number): void {
  const fit = () => {
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight, most);
    const crisp = Math.max(STEP, Math.floor(scale / STEP) * STEP);
    img.style.width = `${img.naturalWidth * crisp}px`;
    img.style.height = `${img.naturalHeight * crisp}px`;
  };
  if (img.complete && img.naturalWidth) fit();
  else img.addEventListener("load", fit, { once: true });
}
