import { defineConfig } from "vocs/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkMathDisplay from "./plugins/remarkMathDisplay.ts";

export default defineConfig({
  title: "binius.xyz",
  // Canonical origin (binius.xyz redirects here); enables sitemap.xml.
  baseUrl: "https://www.binius.xyz",
  // Pages live in docs/pages; global styles in docs/pages/_root.css (loaded automatically).
  srcDir: "docs",
  outDir: "docs/dist",
  // Prerender every page to static HTML (deployed to GitHub Pages).
  renderStrategy: "full-static",
  accentColor: "light-dark(#5753c6, #b1a9ff)",
  head: {
    // baseUrl would otherwise emit <base href>, which resolves every relative
    // and #hash URL against the production origin (breaks local preview and
    // in-page anchors). We only want baseUrl for sitemap/canonical URLs.
    base: false,
    link: [
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
      },
    ],
    script: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-TV9S6QP84Y",
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-TV9S6QP84Y');
        `,
      },
    ],
  },
  iconUrl: {
    light: "/favicon-light.png",
    dark: "/favicon-dark.png",
  },
  logoUrl: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  ogImageUrl: "https://www.binius.xyz/x-logo.png",
  markdown: {
    remarkPlugins: [remarkMath, remarkMathDisplay],
    rehypePlugins: [rehypeKatex],
  },
  topNav: [
    {
      text: "Basics",
      link: "/basics",
      match: "/basics",
    },
    {
      text: "Building",
      link: "/building",
      match: "/building",
    },
    {
      text: "Blueprint",
      link: "/blueprint",
      match: "/blueprint",
    },
    {
      text: "Benchmarks",
      link: "/benchmarks",
      match: "/benchmarks",
    },
  ],
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/binius-zk',
    }
  ],
  sidebar: {
    "/basics": [
      {
        text: "Basics",
        link: "/basics",
      },
      {
        text: "Concepts",
        link: "/basics/concepts",
      },
      {
        text: "Binius64 vs. V0",
        link: "/basics/binius64-vs-v0",
      },
      {
        text: "Roadmap",
        link: "/basics/roadmap",
      },
      {
        text: "Binius V0",
        link: "/basics/binius-v0/",
        collapsed: false,
        items: [
          {
            text: "Arithmetization Background",
            link: "/basics/binius-v0/background",
          },
          {
            text: "Tower Fields",
            link: "/basics/binius-v0/towers",
          },
          {
            text: "Data Types",
            link: "/basics/binius-v0/types",
          },
          {
            text: "M3 Arithmetization",
            link: "/basics/binius-v0/m3",
            collapsed: false,
            items: [
              {
                text: "Toy Example",
                link: "/basics/binius-v0/m3/example",
              },
              {
                text: "Definition",
                link: "/basics/binius-v0/m3/definition",
              },
              {
                text: "Collatz Orbits",
                link: "/basics/binius-v0/m3/collatz",
              },
              {
                text: "Lasso Lookup",
                link: "/basics/binius-v0/m3/lasso",
              },
            ],
          },
        ],
      },
      {
        text: "Further Resources",
        link: "/basics/resources",
        collapsed: false,
        items: [
          {
            text: "Blog Posts",
            link: "/basics/resources/posts",
          },
          {
            text: "Talks and Lectures",
            link: "/basics/resources/talks",
          },
          {
            text: "External Resources",
            link: "/basics/resources/external",
          },
        ],
      },
    ],
    "/building": [
      {
        text: "Building",
        link: "/building",
      },
      {
        text: "Demo Circuits",
        link: "/building/demo-circuits",
      },
      {
        text: "End-to-End Example",
        link: "/building/example",
        collapsed: false,
        items: [
          {
            text: "Writing a Circuit",
            link: "/building/example/circuit",
          },
          {
            text: "Proving and Verifying",
            link: "/building/example/proofs",
          },
          {
            text: "Runnable Project",
            link: "/building/example/runnable",
          },
        ],
      },
      {
        text: "Circuits",
        link: "/building/circuits",
        collapsed: false,
        items: [
          {
            text: "Introduction",
            link: "/building/circuits/introduction",
          },
          {
            text: "Gadgets",
            link: "/building/circuits/gadgets",
          },
          {
            text: "Wires",
            link: "/building/circuits/wires",
          },
          {
            text: "Control Flow",
            link: "/building/circuits/control-flow",
          },
          {
            text: "Circuit Composition",
            link: "/building/circuits/composition",
          },
          {
            text: "Performance",
            link: "/building/circuits/performance",
          },
        ],
      },
      {
        text: "Tutorials",
        link: "/building/tutorials",
      }
    ],
    "/blueprint": [
      {
        text: "Blueprint",
        link: "/blueprint",
      },
      {
        text: "Overview",
        link: "/blueprint/overview",
      },
      {
        text: "Math Background",
        link: "/blueprint/math",
        collapsed: false,
        items: [
          {
            text: "Binary Fields",
            link: "/blueprint/math/fields",
          },
          {
            text: "Multilinear Polynomials",
            link: "/blueprint/math/multilinears",
          },
          {
            text: "The Sumcheck",
            link: "/blueprint/math/sumcheck",
          },
          {
            text: "Oblong-Multilinearization",
            link: "/blueprint/math/oblong",
          },
        ],
      },
      {
        text: "Constraint Systems",
        link: "/blueprint/constraints",
        collapsed: false,
        items: [
          {
            text: "Introduction",
            link: "/blueprint/constraints/introduction",
          },
          {
            text: "Shifted Value Indices",
            link: "/blueprint/constraints/indices",
          },
          {
            text: "Constraint Arrays",
            link: "/blueprint/constraints/arrays",
          },
          {
            text: "AND Constraints",
            link: "/blueprint/constraints/ands",
          },
          {
            text: "MUL Constraints",
            link: "/blueprint/constraints/muls",
          },
        ],
      },
      {
        text: "The Backend",
        link: "/blueprint/backend/",
        collapsed: false,
        items: [
          {
            text: "The Shift Indicators",
            link: "/blueprint/backend/shifts",
            collapsed: true,
            items: [
              {
                text: "Shifted Witness Polynomials",
                link: "/blueprint/backend/shifts/polynomials",
              },
              {
                text: "Logical Shifts",
                link: "/blueprint/backend/shifts/logical",
              },
              {
                text: "Arithmetic Shifts",
                link: "/blueprint/backend/shifts/arithmetic",
              },
            ],
          },
          {
            text: "The AND Reduction",
            link: "/blueprint/backend/ands",
            collapsed: true,
            items: [
              {
                text: "The Rijndael Field",
                link: "/blueprint/backend/ands/rijndael",
              },
              {
                text: "The Univariate Skip",
                link: "/blueprint/backend/ands/univariate",
              },
              {
                text: "The Rijndael Zerocheck",
                link: "/blueprint/backend/ands/implementation",
              },
            ],
          },
          {
            text: "The MUL Reduction",
            link: "/blueprint/backend/muls",
            collapsed: true,
            items: [
              {
                text: "Multiplying in the Exponent",
                link: "/blueprint/backend/muls/multiplying",
              },
              {
                text: "Exponentiating Multilinears",
                link: "/blueprint/backend/muls/exponentiating",
              },
              {
                text: "Combined Protocol",
                link: "/blueprint/backend/muls/combined",
              },
            ],
          },
          {
            text: "The Shift Reduction",
            link: "/blueprint/backend/reduction",
            collapsed: true,
            items: [
              {
                text: "Mathematizing Constraint Arrays",
                link: "/blueprint/backend/reduction/mathematizing",
              },
              {
                text: "The Sumchecks",
                link: "/blueprint/backend/reduction/sumchecks",
              },
              {
                text: "Prover Implementation",
                link: "/blueprint/backend/reduction/implementation",
              },
            ],
          },
          {
            text: "Public Input Check",
            link: "/blueprint/backend/public",
          }
        ],
      },
      {
        text: "Polynomial Commitment",
        link: "/blueprint/commitment/",
      },
    ],
    "/benchmarks": [
      {
        text: "Benchmarks",
        link: "/benchmarks",
      },
      {
        text: "AWS Guide",
        link: "/benchmarks/aws_guide",
      },
    ],
  },
});
