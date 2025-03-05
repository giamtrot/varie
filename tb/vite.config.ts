import { defineConfig } from "vite";

export default defineConfig({
    publicDir: "public", // Ensures manifest.json is copied to dist
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                background: "src/background.ts",
                popup: "src/popup.ts"
            },
            output: {
                entryFileNames: "[name].js", // Ensures correct file names for Chrome extension
            },
        },
    },
});
