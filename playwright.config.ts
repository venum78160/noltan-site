import { defineConfig } from "@playwright/test";

/**
 * Tests de navigation légers (smoke) : le site construit est servi par
 * `vite preview` (build automatique), puis parcouru par Chromium.
 * En CI : `npx playwright install --with-deps chromium` au préalable.
 * Environnement sans téléchargement de navigateur : variable
 * CHROMIUM_EXECUTABLE vers un Chromium déjà présent.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 800 },
    launchOptions: process.env.CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
      : {},
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
