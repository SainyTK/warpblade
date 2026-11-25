import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };
import { motionLive } from "./studio/server/vite/motionLive";

export default defineConfig({
  plugins: [motionLive(fileURLToPath(new URL(".", import.meta.url)))],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    target: "es2022",
    // every hero's kit, art and icons are needed before the first frame (the hero screen draws them all), so the game is
    // one chunk; past this size, load each hero's kit when it is chosen
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      input: {
        game: "index.html",
        patches: "patches/index.html",
      },
    },
  },
});
