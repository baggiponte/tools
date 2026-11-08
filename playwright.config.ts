import { defineConfig } from "@playwright/test";

// Set TOOLS_BASE_URL to test the deployed site; otherwise the tests serve the build in dist/.
const destination = process.env.TOOLS_BASE_URL;
const local = "http://localhost:8791";

export default defineConfig({
  // Unit tests (src/**/*.test.ts) run with node --test instead.
  testDir: "tests",
  fullyParallel: true,
  // A test.only left in by mistake would silently skip the rest of the suite in CI.
  forbidOnly: Boolean(process.env.CI),
  use: {
    baseURL: destination || local,
    channel: "chromium",
  },
  ...(destination
    ? {}
    : {
        webServer: {
          // Serves the packaged build, as Cloudflare would; run `pnpm build` first.
          command: "pnpm exec cf-wrangler dev --port 8791",
          env: { CLOUDFLARE_CF_AUTH: "true" },
          url: local,
          reuseExistingServer: !process.env.CI,
        },
      }),
});
