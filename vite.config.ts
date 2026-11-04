import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

/** three pages: the game, the patch notes and the feedback page */
export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    target: "es2022",
    rolldownOptions: {
      input: {
        game: "index.html",
        patches: "patches/index.html",
        feedback: "feedback/index.html",
      },
    },
  },
});
