import { expect, test, type APIRequestContext } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "docs/dist");
const pagesDir = path.join(root, "docs/pages");

if (!fs.existsSync(path.join(dist, "index.html"))) {
  throw new Error("docs/dist is missing: run a site build (vocs build) first.");
}

// Every prerendered page: each docs/dist/**/index.html is a route.
function discoverRoutes(dir = dist, prefix = ""): string[] {
  const routes: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === "assets") continue;
      routes.push(...discoverRoutes(path.join(dir, e.name), `${prefix}/${e.name}`));
    } else if (e.name === "index.html") {
      routes.push(prefix || "/");
    }
  }
  return routes.sort();
}

// Does the markdown source of this route contain math ($...$ or $$...$$)?
function sourceHasMath(route: string): boolean {
  const base = path.join(pagesDir, route);
  const candidates = [`${base}.md`, `${base}.mdx`, path.join(base, "index.md"), path.join(base, "index.mdx")];
  const file = candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
  if (!file) return false;
  const text = fs.readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+\$/.test(text);
}

// Console errors that are benign. Only third-party (non-localhost) network
// failures are allowed: Google Analytics / GTM and the jsdelivr KaTeX CSS are
// loaded from CDNs and fail when the test machine is offline or blocks them.
function isBenignConsoleError(text: string, url: string): boolean {
  return /Failed to load resource/.test(text) && !!url && !url.startsWith("http://localhost");
}

const routes = discoverRoutes();

// Known pre-existing broken same-origin links (path -> reason). Add TODOs here
// rather than fixing site content in the test change.
const KNOWN_BROKEN_LINKS = new Map<string, string>([]);

// TODO(pre-existing bug, vocs 1.0.13): scrolling many pages (~50 of 67) throws
// "Cannot read properties of undefined (reading 'id')" from the client (likely
// the outline/scroll-spy). Not fixed here; remove this entry if the vocs
// upgrade fixes it (the test then keeps guarding against regressions).
const KNOWN_PAGEERRORS = ["Cannot read properties of undefined (reading 'id')"];

const linkCache = new Map<string, number>();
const linkSources = new Map<string, string>();

async function status(request: APIRequestContext, url: string) {
  if (!linkCache.has(url)) {
    linkCache.set(url, (await request.get(url, { failOnStatusCode: false })).status());
  }
  return linkCache.get(url)!;
}

test("route discovery covers sidebar and landing page", async () => {
  const config = fs.readFileSync(path.join(root, "vocs.config.tsx"), "utf8");
  const sidebarLinks = [...config.matchAll(/link:\s*"(\/[^"]*)"/g)].map((m) => m[1].replace(/(.)\/$/, "$1"));
  expect(routes).toContain("/");
  const missing = sidebarLinks.filter((l) => !routes.includes(l));
  expect(missing, "sidebar links with no built page").toEqual([]);
});

for (const route of routes) {
  test(`page ${route}`, async ({ page, request }) => {
    const problems: string[] = [];
    const failedUrls = new Set<string>();
    page.on("pageerror", (e) => {
      if (KNOWN_PAGEERRORS.some((k) => e.message.includes(k))) return;
      problems.push(`pageerror: ${e.message}`);
    });
    page.on("console", (m) => {
      if (m.type() === "error" && !isBenignConsoleError(m.text(), m.location().url)) {
        problems.push(`console.error: ${m.text()} (${m.location().url})`);
      }
    });
    page.on("requestfailed", (r) => {
      if (new URL(r.url()).origin === "http://localhost:4173") problems.push(`requestfailed: ${r.url()}`);
    });
    page.on("response", (r) => {
      if (new URL(r.url()).origin === "http://localhost:4173" && r.status() >= 400) {
        problems.push(`HTTP ${r.status()}: ${r.url()}`);
      }
    });

    const res = await page.goto(route, { waitUntil: "load" });
    expect(res?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    // Scroll through the page: scroll handlers (outline, lazy content) only run then.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });

    const content = page.locator("main, [data-v-content], .vocs_Content, article").first();
    const body = await page.locator("body").innerText();
    expect(body.trim().length, "page body is empty").toBeGreaterThan(50);
    if (route !== "/") {
      expect((await content.innerText()).trim().length, "main content is empty").toBeGreaterThan(0);
    }

    expect(await page.locator(".katex-error").count(), ".katex-error elements").toBe(0);
    if (sourceHasMath(route)) {
      expect(await page.locator(".katex").count(), "source has math but no .katex rendered").toBeGreaterThan(0);
    }

    expect(problems).toEqual([]);

    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const h of hrefs) {
      const u = new URL(h);
      if (u.origin !== "http://localhost:4173") continue;
      u.hash = "";
      if (!linkSources.has(u.pathname + u.search)) linkSources.set(u.pathname + u.search, route);
    }
  });
}

test("all same-origin links resolve (including /spec.pdf)", async ({ request }) => {
  expect(linkSources.size, "no links collected; page tests must run first").toBeGreaterThan(0);
  linkSources.set("/spec.pdf", "(required)");
  const broken: string[] = [];
  for (const [url, from] of linkSources) {
    const s = await status(request, url);
    if (s !== 200 && !KNOWN_BROKEN_LINKS.has(url)) broken.push(`${s} ${url} (first linked from ${from})`);
  }
  expect(broken).toEqual([]);
});

test("dark mode toggle", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/basics/concepts");
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const light = page.locator("button:has([aria-label='Light Mode'])");
  const dark = page.locator("button:has([aria-label='Dark Mode'])");
  await light.click();
  const lightBg = await bg();
  await dark.click();
  await expect(dark).toHaveAttribute("data-active", "true");
  await expect.poll(bg).not.toBe(lightBg);
});
