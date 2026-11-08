# bryanparonto.com — Redesign Spec

Status: **v1.2 — built** (matches DESIGN.md v2) · 2026-09-26 · Owner: Bryan Paronto

## 1. Problem

The current site (Next.js + Stitches + uniorg on Netlify) has a strong identity (One Dark palette, org-mode flavour) but:

- The hero sits roughly 700px down an empty viewport. On mobile the first screen is blank and the photo disappears.
- The best content (projects, experience) is behind clicks, and the resume is only a PDF.
- The content stopped in 2023. The resume still says Kind Systems is "Present", but Bryan has been at **Atomic Object since 2023**.
- SEO basics are missing: the meta description is the create-next-app default, and there are no OG tags, RSS or sitemap.
- There are copy bugs ("PRINCIPLE", "came to the team at for", a truncated sentence in the Cable Car entry).

## 2. Goals

1. **Recruiter in 30 seconds:** name, role, current employer, years of experience, headline wins, and resume and contact links, all readable without learning any UI.
2. **Peers and devs:** the site itself shows the craft. The page *is* an org-mode buffer you can fold, navigate by keyboard and explore.
3. **One page** for everything except the blog. The front page highlights exactly one post: the latest.
4. **Fast, accessible, indexable:** static HTML that works fully without JS, with JS as progressive enhancement.

## 3. Non-goals

- A CMS, comments, analytics dashboards or a newsletter.
- A full Emacs emulator (no minibuffer commands, M-x or editing).
- Rewriting the old blog posts' content (migrate them as-is).

## 4. Audiences & primary actions

| Audience | Needs | Primary action |
|---|---|---|
| Recruiter / hiring manager | Role, seniority, stack, proof, resume | Download resume / email |
| Prospective client (consulting) | Past work, outcomes | Email |
| Developers / Emacs community | Writing, dotfiles vibe | Read post → all posts |

## 5. Information architecture

### Routes
| Route | Content |
|---|---|
| `/` | Single page (sections below) |
| `/blog` | All posts, newest first, filter by tag |
| `/blog/[slug]` | Post |
| `/tags/[tag]` | Posts for a tag |
| `/rss.xml`, `/sitemap-index.xml` | Feeds |
| `/bryan-paronto-resume.pdf` | Regenerated PDF |
| **Redirects** (Netlify `_redirects`, 301) | `/posts/:slug → /blog/:slug`, `/projects → /#work` |

### Front-page sections (each one is an org top-level heading)
```
#+TITLE: Bryan Paronto          ← header block (hero)
* About                         ← short bio + photo
* Now                           ← Atomic Object, current focus
* Work                          ← selected projects (VA.gov, JennAir, Alpine, Zap2It, Facets.me)
* Experience                    ← timeline (inline resume), PDF link
* Skills                        ← grouped, as org tags / table
* Writing                       ← latest post (auto) + "all posts →"
* Contact                       ← email, GitHub, Twitch
```

## 6. The "org-mode buffer" concept (functional requirements)

**Frame**
- F1. The page is laid out as a NANO-style Emacs frame, with one **sticky header-line at the top** and no modeline. From left to right it shows:
  - a status tag (`BP`)
  - the buffer name and `(Org)`
  - the current section (`* Work › VA.gov`)
  - section links
  - the scroll position (`Top` / `42%` / `Bot`)
  - a theme toggle and a `?` keys button

  On mobile, the section links become a `☰` outline dialog.
- F2. The hero is the file header: `#+TITLE:`, `#+AUTHOR:`, `#+ROLE:`, `#+LOCATION:`, `#+STATUS:` keywords rendered as a readable key/value block. Name and role are set large. Keywords are dimmed decoration and never the only carrier of meaning.
- F3. There are no line numbers (NANO). Fold chevrons hang in the left margin on desktop and sit inline on mobile.

**Headings & folding**
- F4. Each section is a native `<details open>` with `<summary>` rendering `* Heading`. Stars and the fold indicator (`▾`/`▸`, or `...` when folded) are decorative.
- F5. **Everything is expanded by default**, except jobs that ended before 2016. Those are still listed in the Experience summary table, so a recruiter never has to unfold anything.
- F6. Sub-items (a job, a project) are `**` headings and can also fold.

**Keyboard (progressive enhancement; off when focus is in a form field)**
| Key | Action |
|---|---|
| `TAB` on a focused heading | toggle fold (native `<summary>` Enter/Space still works) |
| `S-TAB` | cycle global visibility: overview → contents → show all |
| `n` / `p` (also `j` / `k`) | next / previous heading |
| `g g` / `G` | top / bottom |
| `o` | outline (jump to heading) |
| `t` | toggle theme |
| `?` | show key-binding cheat sheet (dialog) |

- F7. `TAB` and `S-TAB` are only intercepted after the reader opts in by pressing a navigation key (`n` / `p` / `j` / `k` / `gg` / `G`), and `TAB` only when a heading has focus. `Esc` releases it. Normal tab order through links is never trapped. A `?` button in the header-line opens the key list.

**Org idioms used for content**
- F8. Tags render as `:react:typescript:` trailing the heading, right-aligned on desktop. Dates render as org timestamps `<2023-05-12 Fri>`. TODO keywords may be used sparingly in *Now* (e.g. `DONE`, `NEXT`), and the site must never depend on them for meaning.
- F9. Links look like org links (underlined and coloured), with a normal hover/focus state.

## 7. Content requirements

- C1. **Now / Experience:** Software Developer & Consultant @ Atomic Object, 2023–present. The copy is generic, with no client names. Kind Systems ends 2023.
- C2. Rewrite the experience entries into 2–3 outcome bullets each. Fix typos (Principal, Led), complete the truncated Cable Car sentence and fix the Zap2It copy.
- C3. Work: 4–5 projects, each with a one-line outcome, role, stack tags, year, link, and a screenshot (reuse existing images, lazy-loaded).
- C4. Writing: the front page shows the **newest** post automatically (title, date, tags, 2-line excerpt, reading time).
- C5. Contact: `bparonto@gmail.com`, GitHub, Twitch.
- C6. Meta: a real title and description, OG and Twitter cards (a static OG image styled like the buffer), canonical URL, JSON-LD `Person`.

## 8. Tech

- **Astro 7** (7.3.5 at build time) static output, TypeScript, no UI framework. There's one small vanilla TS island for keybindings, the header-line and the theme.
- **Content collections** for posts. Posts are authored in `.org` (via a uniorg-based loader, `astro-org` or a custom `uniorg-parse → uniorg-rehype` loader), with `.md` supported as a fallback.
- Styling: plain CSS with custom properties (tokens defined in DESIGN.md). No Tailwind, to keep the output tiny and bespoke.
- Fonts: self-hosted through Fontsource: **Roboto Mono** (variable) and **Victor Mono Italic**. Colours: **Everforest** (see DESIGN.md).
- Code highlighting: Shiki `everforest-dark` / `everforest-light`, applied at build time.
- Deploy: Netlify (current host), `_redirects` for old URLs.
- **Resume:** the Experience data lives in one `src/data/resume.ts`, which renders the page section. A print stylesheet makes `/` print as a clean resume.
- Content: posts come from `src/content/posts/*.org` and projects from `src/content/projects/*.org`, parsed with uniorg and loaded through `import.meta.glob`.

## 9. Quality bar

- Lighthouse ≥ 95 on all four categories on mobile, with a JS budget of ≤ 10 KB gzipped.
- WCAG 2.2 AA: contrast ≥ 4.5:1 for text, visible focus, skip link, landmarks, `prefers-reduced-motion`, and keybindings documented and non-trapping.
- Works with JS disabled: everything readable and foldable (native `<details>`), with only the keybindings and live header-line details missing.
- Responsive from 320px up, with no horizontal scroll. Long code blocks scroll inside their own box.
- Dark theme (default) and light theme, following `prefers-color-scheme` and persisting the toggle.

## 10. Acceptance criteria (verified 2026-09-26, headless Chrome)

- [x] At 390×844, the name, role, current employer and the Email / Résumé actions are visible without scrolling.
- [x] Sections are visible and expanded with JS off: 20 of 23 are open, and the 3 pre-2016 jobs are folded by design. JS-only controls are hidden.
- [x] Keyboard-only use works:
  - `n` / `p` move between headings, `Tab` folds, and `S-TAB` cycles overview → contents → all.
  - `?` opens the help dialog and `Esc` closes it.
  - `t` switches theme and `o` opens the outline.
- [x] The front page shows exactly one post, the newest by `#+DATE`.
- [x] Old `/posts/*` and `/projects` URLs redirect via `public/_redirects`. This is written but **untested until deployed to Netlify**.
- [ ] Printing `/` produces a clean **2-page** resume. **It's currently 3 pages.** Reaching 2 means cutting older roles; this is Bryan's call.
- [x] There's no horizontal scroll at 390px, and no console errors.
- [x] The JS budget is met: 2 KB gzipped, against a 10 KB limit.
- [ ] Lighthouse has not been run yet. Run it after deploy.

## 11. Decisions (resolved 2026-09-26)

1. **Current role:** Software Developer & Consultant, Atomic Object, 2023–present. **No client names.** Describe the work generically (domains, kinds of products, practices). Kind Systems ends 2023.
2. **Email:** `bparonto@gmail.com` everywhere (site + resume).
3. **Twitch** (`twitch.tv/cablecardigital`): kept, alongside GitHub and email.
4. **Content source:** `~/Dev/bryanparonto.com-next/content/*.org`, **excluding `welcome-to-*`** (7 posts). Projects come from `~/Dev/bryanparonto.com-next/projects/*.org` (org keywords `client`, `launch_date`, `image`, `tech`, `url`). Both are copied into this repo as Astro content collections. Fix the `#+being_src` typo.
5. **Headshot:** keep `me.jpg` for now (to be replaced later), and make it easy to swap.
6. **Facets.me:** kept in Work.
7. JennAir, from the resume, is added to Work as a text-only entry (no screenshot).

## 12. Open items

- [ ] Regenerate `public/bryan-paronto-resume.pdf`. It is still the 2023 version, with Kind Systems as "Present".
- [ ] Bryan to edit the draft copy: the Atomic Object bullets and the *Now* list in `src/data/resume.ts`.
- [ ] Confirm the guessed facts:
  - the JennAir client, "Whirlpool Corporation"
  - the Kind Systems end month (currently just "2023")
  - that Chicago is still the location
  - Astro and Next.js listed under skills
- [ ] Replace the headshot, `src/assets/me.jpg`.
- [ ] Set up git and deploy to Netlify. This replaces the live site.
