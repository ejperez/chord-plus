import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "lib/main.js"),
      name: "ChordPlus",
      fileName: (format) => `chord-plus.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
