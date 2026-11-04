import { defineConfig, devices } from "@playwright/test";

// The smoke tests run against the *built* site served by `vocs preview`, so a
// build must precede them:
//   npm run build        (needs pdflatex/biber; or `nix build ./whitepaper`,
//                         copy result/main.pdf to docs/public/spec.pdf, and
//                         `npx vocs build`)
//   nix develop -c npm test      (browsers come from the nix dev shell)
// Routes are discovered from the HTML files in docs/dist (see tests/smoke.spec.ts).
export default defineConfig({
  testDir: "./tests",
  workers: 1, // tests share a link cache and one preview server
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:4173" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx vocs preview",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
});
