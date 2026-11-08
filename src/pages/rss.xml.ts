import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/content";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "Bryan Paronto — writing",
    description: "Notes on Emacs, org-mode, Linux and front-end development.",
    site: context.site!,
    items: posts.map((p) => ({
      title: p.title,
      pubDate: p.date,
      description: p.excerpt,
      link: `/blog/${p.slug}/`,
      categories: p.tags,
    })),
  });
}
