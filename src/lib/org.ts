import { unified } from "unified";
import uniorgParse from "uniorg-parse";
import uniorgRehype from "uniorg-rehype";
import extractKeywords from "uniorg-extract-keywords";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { visit, SKIP } from "unist-util-visit";
import type { Root, Element, ElementContent } from "hast";

const h = (
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[] = [],
): Element => ({ type: "element", tagName, properties, children });
const text = (value: string) => ({ type: "text" as const, value });

/**
 * Make rendered org look like org:
 * - demote headings one level (the post title owns <h1>) and prefix org stars
 * - wrap src blocks in #+begin_src / #+end_src fences
 * - lazy-load images and give them a fallback alt
 */
function rehypeOrgBuffer() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      const level = /^h([1-6])$/.exec(node.tagName)?.[1];
      if (level) {
        const n = Number(level);
        node.tagName = `h${Math.min(n + 1, 6)}`;
        node.properties.className = ["org-h", `lvl-${n}`];
        node.children.unshift(
          h("span", { className: ["stars"], ariaHidden: "true" }, [text("*".repeat(n) + " ")]),
        );
        return;
      }
      if (node.tagName === "pre" && parent && index !== undefined) {
        const code = node.children.find(
          (c): c is Element => c.type === "element" && c.tagName === "code",
        );
        const cls = (code?.properties.className as string[] | undefined) ?? [];
        const lang = cls.find((c) => c.startsWith("language-"))?.slice(9) ?? "";
        const figure = h("figure", { className: ["src"], dataLang: lang }, [
          h("div", { className: ["src-fence"], ariaHidden: "true" }, [text(`#+begin_src ${lang}`)]),
          node,
          h("div", { className: ["src-fence"], ariaHidden: "true" }, [text("#+end_src")]),
        ]);
        parent.children[index] = figure;
        return SKIP;
      }
      if (node.tagName === "img") {
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
        if (!node.properties.alt) {
          const file = String(node.properties.src ?? "").split("/").pop() ?? "";
          node.properties.alt = file.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
        }
      }
    });
  };
}

const full = unified()
  .use(uniorgParse)
  .use(extractKeywords)
  .use(uniorgRehype)
  .use(rehypeOrgBuffer)
  .use(rehypeShiki, {
    themes: { light: "everforest-light", dark: "everforest-dark" },
    defaultColor: false,
    fallbackLanguage: "text",
  })
  .use(rehypeStringify);

export interface OrgDoc {
  keywords: Record<string, string>;
  html: string;
}

export async function renderOrg(source: string): Promise<OrgDoc> {
  const file = await full.process(source);
  return { keywords: file.data as Record<string, string>, html: String(file) };
}

/** Plain-text excerpt of the first paragraph(s), for cards and meta descriptions. */
export function excerpt(html: string, max = 240): string {
  const paras = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  let out = "";
  for (const p of paras) {
    out = out ? `${out} ${p}` : p;
    if (out.length >= max) break;
  }
  return out.length > max ? out.slice(0, out.lastIndexOf(" ", max)) + "…" : out;
}

export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
