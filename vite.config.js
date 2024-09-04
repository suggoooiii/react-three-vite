import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl"; // Add this line
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: [
        // Glob pattern, or array of glob patterns to import
        "**/*.glsl",
        "**/*.wgsl",
        "**/*.vert",
        "**/*.frag",
        "**/*.vs",
        "**/*.fs",
      ],
      exclude: undefined, // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: false, // Warn if the same chunk was imported multiple times
      defaultExtension: "glsl", // Shader suffix when no extension is specified
      compress: false, // Compress output shader code
      watch: true, // Recompile shader on change
      root: "/", // Directory for root imports
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
