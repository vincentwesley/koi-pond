import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  workers: 1,
  timeout: 30_000,
  webServer: { command: "npm run build && npx vite preview --port 4412 --strictPort", url: "http://localhost:4412/", reuseExistingServer: false, timeout: 120_000 },
  use: {
    baseURL: "http://localhost:4412/",
    headless: true,
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
  },
});
