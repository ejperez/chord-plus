import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      // Defines the entry point for your library packages
      entry: resolve(import.meta.dirname, "lib/main.js"),
      // The global variable name used for UMD/IIFE builds
      name: "ChordPlus",
      // The output filename formats
      fileName: (format) => `chord-plus.${format}.js`,
    },
    rollupOptions: {
      // If your library relies on external npm packages, list them here.
      // Example: external: ['lodash'],
      external: [],
      output: {
        // Provides global variables to use in the UMD build for externalized deps
        globals: {},
      },
    },
  },
});
