// Vocs 2 highlights every `<pre><code>` with Shiki *before* user rehype plugins
// run, so remark-math's display math (`<pre><code class="language-math
// math-display">`) never reaches rehype-katex and renders as a code block.
// Emit display math as `<div class="math math-display">` instead, which Shiki
// ignores and rehype-katex still renders.
type Node = { type: string; value?: string; data?: Record<string, unknown>; children?: Node[] };

function visit(node: Node) {
  if (node.type === "math") {
    node.data = {
      ...node.data,
      hName: "div",
      hProperties: { className: ["math", "math-display"] },
      hChildren: [{ type: "text", value: node.value ?? "" }],
    };
  }
  node.children?.forEach(visit);
}

export default function remarkMathDisplay() {
  return (tree: Node) => visit(tree);
}
