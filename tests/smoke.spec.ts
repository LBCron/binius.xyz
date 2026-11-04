import { expect, test, type APIRequestContext } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
// Vocs 2 (Waku) writes the static site to <outDir>/public.
const dist = path.join(root, "docs/dist/public");
const pagesDir = path.join(root, "docs/pages");

if (!fs.existsSync(path.join(dist, "index.html"))) {
  throw new Error("docs/dist/public is missing: run a site build (vocs build) first.");
}

// Every prerendered page: each docs/dist/public/**/index.html is a route.
// Skipped: assets, RSC payloads, and the `*.d` directories (`404.d`, `_root.d`)
// that Waku emits next to the real pages.
function discoverRoutes(dir = dist, prefix = ""): string[] {
  const routes: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === "assets" || e.name === "RSC" || e.name.endsWith(".d")) continue;
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

const linkCache = new Map<string, number>();

async function status(request: APIRequestContext, url: string) {
  if (!linkCache.has(url)) {
    linkCache.set(url, (await request.get(url, { failOnStatusCode: false })).status());
  }
  return linkCache.get(url)!;
}

test("route discovery covers sidebar and landing page", async () => {
  const config = fs.readFileSync(path.join(root, "vocs.config.ts"), "utf8");
  const sidebarLinks = [...config.matchAll(/link:\s*"(\/[^"]*)"/g)].map((m) => m[1].replace(/(.)\/$/, "$1"));
  expect(routes).toContain("/");
  const missing = sidebarLinks.filter((l) => !routes.includes(l));
  expect(missing, "sidebar links with no built page").toEqual([]);
});

for (const route of routes) {
  test(`page ${route}`, async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (e) => {
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

    const content = page.locator("main").first();
    const body = await page.locator("body").innerText();
    expect(body.trim().length, "page body is empty").toBeGreaterThan(50);
    if (route !== "/") {
      expect((await content.innerText()).trim().length, "main content is empty").toBeGreaterThan(0);
    }

    expect(await page.locator(".katex-error").count(), ".katex-error elements").toBe(0);
    // Unrendered math: display math left as a raw code block / math element.
    expect(await page.locator("code.language-math, .math-display, .math-inline").count(), "unrendered math").toBe(0);
    if (sourceHasMath(route)) {
      expect(await page.locator(".katex").count(), "source has math but no .katex rendered").toBeGreaterThan(0);
    }

    expect(problems).toEqual([]);
  });
}

// Same-origin link targets (path + query, no hash) found in the prerendered
// HTML of every route, mapped to the first route that links to them. Parsed
// statically from docs/dist so this test does not depend on the page tests.
function collectLinks(): Map<string, string> {
  const links = new Map<string, string>();
  for (const route of routes) {
    const file = path.join(dist, route, "index.html");
    const html = fs.readFileSync(file, "utf8");
    for (const tag of html.matchAll(/<a\s[^>]*>/gi)) {
      const m = /\shref=(?:"([^"]*)"|'([^']*)')/i.exec(tag[0]);
      const href = m && (m[1] ?? m[2]);
      if (!href) continue;
      const u = new URL(href.replace(/&amp;/g, "&"), `http://localhost:4173${route}`);
      if (u.origin !== "http://localhost:4173") continue; // external, mailto:, etc.
      const key = u.pathname + u.search;
      if (!links.has(key)) links.set(key, route);
    }
  }
  return links;
}

test("all same-origin links resolve (including /spec.pdf)", async ({ request }) => {
  const links = collectLinks();
  expect(links.size, "no links found in built HTML").toBeGreaterThan(0);
  links.set("/spec.pdf", "(required)");
  const broken: string[] = [];
  for (const [url, from] of links) {
    const s = await status(request, url);
    if (s !== 200 && !KNOWN_BROKEN_LINKS.has(url)) broken.push(`${s} ${url} (first linked from ${from})`);
  }
  expect(broken).toEqual([]);
});

test("dark mode toggle", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/basics/concepts");
  const bg = () => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  const light = page.getByRole("radio", { name: "Light theme" });
  const dark = page.getByRole("radio", { name: "Dark theme" });
  await light.click();
  const lightBg = await bg();
  await dark.click();
  await expect(dark).toBeChecked();
  await expect.poll(bg).not.toBe(lightBg);
});

test("landing page links to GitHub", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href="https://github.com/binius-zk"]')).toHaveCount(1);
});

// baseUrl must not emit <base href>: it would resolve every relative and #hash
// URL against production (see the `head.base` comment in vocs.config.ts).
test("no <base> tag; sitemap covers every page", async ({ request }) => {
  const withBase = routes.filter((r) =>
    /<base\b/i.test(fs.readFileSync(path.join(dist, r, "index.html"), "utf8")),
  );
  expect(withBase, "pages with a <base> tag").toEqual([]);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>https:\/\/www\.binius\.xyz([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  expect(routes.filter((r) => r !== "/404" && !locs.includes(r)), "routes missing from sitemap").toEqual([]);
});

test("Ask AI and Copy page for AI are hidden", async ({ page }) => {
  await page.goto("/blueprint/overview");
  await page.waitForLoadState("networkidle");
  for (const text of ["Ask AI", "Copy page"]) {
    const els = page.getByText(text, { exact: false });
    for (const el of await els.all()) await expect(el, `"${text}" visible`).toBeHidden();
  }
});
