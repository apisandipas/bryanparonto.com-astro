import type { ImageMetadata } from "astro";
import { renderOrg, excerpt, readingMinutes } from "./org";

const postSources = import.meta.glob<string>("../content/posts/*.org", {
  query: "?raw",
  import: "default",
  eager: true,
});
const projectSources = import.meta.glob<string>("../content/projects/*.org", {
  query: "?raw",
  import: "default",
  eager: true,
});
const projectImages = import.meta.glob<ImageMetadata>("../assets/projects/*", {
  import: "default",
  eager: true,
});

const slugOf = (path: string) => path.split("/").pop()!.replace(/\.org$/, "");
const words = (s = "") => s.split(/\s+/).filter(Boolean);

export interface Post {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  html: string;
  excerpt: string;
  minutes: number;
}

export interface Project {
  slug: string;
  title: string;
  order: number;
  client?: string;
  role?: string;
  year?: string;
  tech: string[];
  links: { label: string; href: string }[];
  outcome: string;
  html: string;
  image?: ImageMetadata;
  alt: string;
}

let postsCache: Promise<Post[]> | undefined;

/** Published posts, newest first. */
export function getPosts(): Promise<Post[]> {
  postsCache ??= Promise.all(
    Object.entries(postSources).map(async ([path, src]) => {
      const { keywords: k, html } = await renderOrg(src);
      return {
        k,
        post: {
          slug: slugOf(path),
          title: k.title,
          date: new Date(`${k.date}T12:00:00Z`),
          tags: words(k.tags),
          html,
          excerpt: excerpt(html),
          minutes: readingMinutes(html),
        },
      };
    }),
  ).then((all) =>
    all
      .filter(({ k }) => k.published !== "false")
      .map(({ post }) => post)
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  );
  return postsCache;
}

/**
 * `#+links: Label https://a | Other https://b` (URL is the last word of each item).
 * Falls back to the older `#+url:` / `#+link_label:` pair.
 */
function parseLinks(k: Record<string, string>): Project["links"] {
  if (k.links) {
    return k.links.split(" | ").map((item) => {
      const at = item.trim().lastIndexOf(" ");
      return { label: item.slice(0, at).trim(), href: item.slice(at + 1).trim() };
    });
  }
  return k.url ? [{ label: k.link_label ?? "Visit site", href: k.url }] : [];
}

export async function getProjects(): Promise<Project[]> {
  const all = await Promise.all(
    Object.entries(projectSources).map(async ([path, src]) => {
      const { keywords: k, html } = await renderOrg(src);
      return {
        slug: slugOf(path),
        title: k.title,
        order: Number(k.order ?? 99),
        client: k.client,
        role: k.role,
        year: k.launch_date,
        tech: words(k.tech),
        links: parseLinks(k),
        outcome: k.outcome,
        html,
        image: k.image ? projectImages[`../assets/projects/${k.image}`] : undefined,
        alt: k.alt ?? "",
      };
    }),
  );
  return all.sort((a, b) => a.order - b.order);
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Org active timestamp, e.g. <2023-05-12 Fri>, without the brackets. */
export function orgDate(d: Date): string {
  return `${d.toISOString().slice(0, 10)} ${WEEKDAY[d.getUTCDay()]}`;
}

export async function getTags(): Promise<Map<string, Post[]>> {
  const tags = new Map<string, Post[]>();
  for (const post of await getPosts()) {
    for (const t of post.tags) tags.set(t, [...(tags.get(t) ?? []), post]);
  }
  return tags;
}
