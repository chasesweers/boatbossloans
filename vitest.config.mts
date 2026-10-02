import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Next turns static image imports into { src, width, height }; Vite gives a bare URL string.
// Mirror Next's shape so next/image works under jsdom.
const staticImages: Plugin = {
  name: "next-static-images",
  enforce: "pre",
  load(id) {
    if (/\.(png|jpe?g|webp|avif|gif)$/i.test(id)) {
      const src = "/" + path.relative(__dirname, id).replace(/\\/g, "/");
      return `export default { src: ${JSON.stringify(src)}, width: 100, height: 100 };`;
    }
  },
};

export default defineConfig({
  plugins: [staticImages, react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["lib/**", "components/**", "app/**/route.ts"],
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
