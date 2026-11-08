# DESIGN.md — bryanparonto.com

Status: **v3 — live site (Everforest · Roboto Mono · NANO)** · 2026-11-08 · Companion to `spec.md`

v3 changes: the hero greets ("Hi, I'm Bryan."), Work is an exclusive accordion with medium full-page screenshots, the image viewer scrolls tall shots and locks the page, and Skills are grouped chips.

## 1. Concept

**The site is Bryan's `.org` file, open in a N Λ N O–style Emacs with the Everforest theme.**

The design borrows NANO Emacs's principles (Rougier, *On the Design of Text Editors*):
- **Few faces, each with a meaning:** default, strong, salient, popout, faded, subtle and critical. There is no rainbow of syntax colours in the prose.
- **Hierarchy by weight and space, not colour.** Headings are *strong* (bold) text, and the stars are the only coloured mark.
- **One header-line at the top, and no modeline.** The status tag is an inverted box.
- **Generous margins, no fringes or line numbers**, and light type set in Roboto Mono.

Every piece of chrome maps to a real Emacs element: the header-line, `which-key`, and `org-goto` / imenu. The page also has to read like a clean résumé to someone who has never opened Emacs. Three rules follow from that:

1. **Content first, chrome second.** Emacs cues (`*`, `#+`, `:tags:`, `<timestamps>`) are dim, `aria-hidden` decoration around real, plainly labelled content. If you delete every cue, the page still reads as a CV.
2. **Familiar controls stay familiar.** Links are underlined, buttons look pressable, and headings fold with the browser's native disclosure element.
3. **No fake terminal theatre.** There are no typing animations, fake boot sequences or a `$` prompt on everything. The joke lands because it's *accurate* to org-mode, not loud.

## 2. Theme tokens (Everforest × NANO faces)

The palette is **Everforest Medium**, dark by default and light when chosen. Everforest's light accents fail contrast (2.1–3.1:1), so the light theme uses **darkened accent shades** that keep each hue. Contrast ratios are shown against `--bg`, and every text-bearing token passes AA.

| NANO face | Meaning | Dark | Light |
|---|---|---|---|
| `--bg` | buffer | `#2D353B` bg0 | `#FDF6E3` bg0 |
| `--bg-dim` | header-line, code blocks | `#232A2E` bg_dim | `#F4F0D9` bg1 |
| `--subtle` | hl-line, hover, table stripes | `#343F44` bg1 | `#EFEBD4` bg2 |
| `--border` | hairlines | `#475258` bg3 | `#E0DCC7` bg4 |
| `--fg` **default** | body text | `#D3C6AA` 7.4 | `#5C6A72` 5.2 |
| `--strong` | headings, title, emphasis (bold) | `#E6DCC4` | `#3A454A` |
| `--salient` | links, stars, primary button, status tag | `#A7C080` green 6.2 | `#5C6A00` 5.5 |
| `--popout` | dates, cursor, focus ring, NEXT | `#E69875` orange 5.4 | `#B35410` 4.6 |
| `--faded` | meta, tags, property keys, footer | `#9DA9A0` grey2 5.1 | `#5F6B5C` 4.9 |
| `--deco` | `#+`, `:`, `::`, fold chevrons. **Never text-bearing** | `#7A8478` grey0 | `#A6B0A0` grey0 |
| `--critical` | errors only (none expected) | `#E67E80` | `#C9302D` |
| `--aqua` | code: strings / types only | `#83C092` | `#1F7A57` |
| `--purple` | code: keywords only | `#D699B6` | `#A83D86` |
| `--yellow` | code: constants only | `#DBBC7F` | `#8A6400` |

- Accent hues **outside code blocks** are limited to salient green and popout orange. That restraint is the NANO part.
- The theme follows `prefers-color-scheme` unless overridden with `t` or the header-line toggle, and the choice is persisted. An inline `<head>` script prevents a flash of the wrong theme.
- Code uses Shiki's `everforest-dark` / `everforest-light` dual themes through CSS variables.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Everything | **Roboto Mono** variable (self-hosted woff2, Latin subset, weights 300–700) | NANO's default face. Body text is **400** for screen legibility (NANO uses Light 300, which is too thin on a dark background at 16px), and large display type is **300**. |
| Italics | **Victor Mono Italic 400** (one file) | The old site's cursive signature, used only for `/italic/`, the hero summary line and blockquotes. |

Scale. Base is **16px on mobile, 17px from 768px up**, with line-height 1.7 and a measure of **72ch**.

| Token | Size | Weight | Use |
|---|---|---|---|
| `--t-title` | clamp(2.25rem, 7vw, 4.25rem) | **300** | The name. Big and light is the NANO look. |
| `--t-sub` | clamp(1.05rem, 2vw, 1.3rem) | 400 | role line |
| `--t-h1` | 1.375rem | 700 strong | `* Heading` |
| `--t-h2` | 1.0625rem | 700 strong | `** Heading` |
| `--t-body` | 1rem | 400 | |
| `--t-meta` | 0.8125rem | 400 faded | tags, properties, header-line |

Heading levels differ in **size and star count**, not hue. All stars are `--salient`, and the heading text is `--strong`.

## 4. Space, shape, motion

- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px. Sections are separated by **96px** (64px on mobile), because NANO breathes. Page gutter is 16px on mobile, 32px on tablet, and on desktop the column is centred with wide empty margins.
- **Shape:** radius **0** everywhere (it's a buffer). The only exceptions are the header-line status tag and dialogs at 3px. Borders are 1px `--border`. There are **no shadows**, except dialogs, which get one soft shadow.
- **Motion:**
  - The block cursor after the title blinks on a 1s step animation.
  - Folding uses no animation, because Emacs folding is instant.
  - Theme switches instantly.
  - Headings reached with `n`/`p` use smooth scroll.
  - Under `prefers-reduced-motion`, the cursor is solid and scrolling is instant.

## 5. Frame layout

### Desktop (≥ 1024px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ▐ BP ▌ bryanparonto (Org) · * Work › VA.gov      About Work Experience   │ ← NANO header-line
│                                                     Writing Contact  42%  ☾ ? │   sticky top, 40px
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│              #+TITLE:                                                        │
│              Bryan Paronto▌                     (300 weight, huge)           │
│              Software Developer & Consultant                                 │
│              /UI-focused full-stack engineer, 15+ years — accessible,        │
│              fast web products used by millions./        (Victor italic)     │
│                                                                              │
│              AT        Atomic Object · since 2023                            │
│              LOCATION  Chicago, IL                                           │
│                                                                              │
│              [ Email me ]  [ Résumé.pdf ↓ ]   github  twitch                 │
│                                                                              │
│                                                                              │
│           ▾  * About                                                         │
│              Paragraphs…                                  ┌───────┐          │
│                                                           │ me.jpg│          │
│           ▾  * Work                                       └───────┘          │
│           ▾  ** VA.gov                        :react:graphql:metalsmith:     │
│              CLIENT  US Dept of Veterans Affairs   ┌──────────────┐          │
│              YEAR    2023                          │  screenshot  │          │
│              Body copy…  Visit site →              └──────────────┘          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```
- **Header-line** (NANO style, the only chrome):
  - It's sticky at the top, 40px tall, with a `--bg-dim` background and a hairline bottom border.
  - Left to right, it contains:
    1. **Status tag** `BP` (initials): an inverted box (`--salient` background, `--bg` text, bold, 3px radius). It links back to the top.
    2. **Buffer name** in `--strong` bold, then `(Org)` in `--faded`.
    3. **Breadcrumb** (`* Work › VA.gov`) in `--faded`, updated by an IntersectionObserver.
    4. Right-aligned **section links** (the in-page nav, real `<a href="#work">`).
    5. **Position** `42%`.
    6. **Theme toggle** `☾` / `☀`.
    7. **`?`** button for the keys dialog.
- **No modeline, no line numbers.**
- **Fold chevrons** `▾`/`▸` hang in the left margin, 24px outside the text column, in `--deco`, becoming `--salient` on hover or focus.
- **Content column:** `min(72ch, 100%)`, centred.

### Tablet (768–1023px)
The header-line drops the section links and shows an **`☰ Outline`** button instead. Chevrons still hang in the margin.

### Mobile (< 768px)
```
┌──────────────────────────────┐
│ ▐BP▌ bryanparonto  ☰ ☾  │ ← header-line 48px (44px targets)
├──────────────────────────────┤
│ #+TITLE:                     │
│ Bryan Paronto▌               │
│ Software Developer &         │
│ Consultant                   │
│ /UI-focused full-stack…/     │
│ AT  Atomic Object · 2023–    │
│ LOC Chicago, IL              │
│ [ Email me ] [ Résumé ↓ ]    │  ← visible in first 844px
│                              │
│ ▾ * About                    │  ← chevron moves inline
└──────────────────────────────┘
```
- The breadcrumb, position and `?` are hidden. **`☰`** opens the **outline dialog** (the `org-goto` equivalent), which is the mobile nav.
- The fold chevron sits inline before the stars, since there's no margin to hang it in.

## 6. Components

### 6.1 Header block (hero)
- Semantics:
  - A `<header>` containing an `<h1>` ("Hi, I'm Bryan."), then `<p>` (the role), then `<p>` (the tagline, `person.tagline`), then a `<dl>` (at / location). The name stays in `<title>`, meta and JSON-LD; `person.summary` still feeds the meta description.
  - The `#+TITLE:` style prefixes are `aria-hidden` `<span>`s in `--deco`/`--muted`.
- Name: `--t-title` at weight 300 in `--strong`, followed by the block cursor `▌` (`--popout`, `aria-hidden`). Only `#+TITLE:` stays visible as a prefix above the name, in `--deco`. The other keywords render NANO-clean as `KEY  value` rows with small-caps `--faded` keys.
- Tagline: "I build tools, write about what I'm learning, and tinker with the software and systems that help me do better work." In Victor Mono Italic (the only italic in the hero).
- **Actions** are Emacs *widget buttons*:
  - They render as `[ Email me ]`, with a 1px `--border` box, 12px/16px padding and a minimum height of 44px.
  - On hover or focus the box inverts to `--fg` background with `--bg` text.
  - The primary action (`Email me`) has a `--salient` border and text.
  - GitHub and Twitch are plain org links after them.

### 6.2 Heading / fold (`<details>`)
```html
<details open id="work" class="org-section lvl-1">
  <summary>
    <span class="fringe" aria-hidden="true">▾</span>
    <h2><span class="stars" aria-hidden="true">* </span>Work</h2>
    <span class="tags" aria-label="tags: react, graphql">:react:graphql:</span>
    <span class="ellipsis" aria-hidden="true">…</span>   <!-- only when closed -->
  </summary>
  …
</details>
```
- The summary row gets the `--subtle` background on hover and focus-visible (hl-line). The focus ring is a 2px `--popout` outline offset by 2px.
- When a section is closed, it shows `* Work...`, which is exactly what org displays.
- Tags are right-aligned with `margin-left:auto` on desktop. On mobile they wrap under the heading at `--t-meta`.
- Headings are real `h2`/`h3` elements inside the summary, so the screen-reader outline stays correct.

### 6.3 Property drawer (project and job meta)
- A `<dl>` in a two-column grid (`max-content 1fr`) at `--t-meta` size. Keys are small-caps `--faded` (`CLIENT`, `ROLE`, `YEAR`, `STACK`) and values are `--fg`.
- NANO-clean: the `:PROPERTIES:` / `:END:` fences are **not** shown. The drawer is always visible because it carries the recruiter-relevant facts.

### 6.4 Work: project accordion (`** Project`)
- Each project is a `<details name="work">`, closed by default. The shared `name` makes the list an **exclusive accordion** natively: opening one closes the others. Summary rows show the title only, separated by 1px rules; the open title turns `--salient`.
- Opening animates: `::details-content` transitions `block-size` (with `interpolate-size: allow-keywords`), and the body fades and slides 6px. Browsers without support open instantly; `prefers-reduced-motion` turns it off.
- Inside: text `1fr` beside a **medium** screenshot column (20rem) on ≥768px; stacked on mobile. Order: outcome, tech (`a · b · c`, faded mono), description, links.
- Screenshots are **full-page captures** (1440 wide, 2×). The thumbnail keeps the image's own shape, capped at 25rem tall (`object-fit: cover; object-position: top`); juke stays a phone shot (`.portrait`). Click opens the viewer (§6.11).
- `S-TAB` "show all" skips named groups so it doesn't fight exclusivity; print removes the names temporarily and unfolds everything.

### 6.5 Experience
1. First comes an **org table** summary, for a fast recruiter scan:
   ```
   | Years       | Role                           | Company         |
   |-------------+--------------------------------+-----------------|
   | 2023–now    | Software Developer & Consultant| Atomic Object   |
   | 2022–2023   | Sr. Front End Engineer         | Kind Systems    |
   …
   ```
   - It's a real `<table>` in the page font. `|` and `+-` are drawn with CSS borders (1px `--border`), not ASCII characters.
   - On mobile the table becomes a stacked list: the years line in `--popout` colour, then role and company.
2. Next comes one `** Role @ Company` entry per job, each with 2–3 bullets and a `<YYYY-MM>--<YYYY-MM>` org range timestamp in `--popout`. Entries older than 2016 are **folded by default**. This is the one exception to "everything open", made so the section stays short, and the summary table above still shows those roles.
3. Last is a `[ Résumé.pdf ↓ ]` widget button.

### 6.6 Skills
Grouped chips, two columns on ≥768px: Languages, Front end, Back end, Data, AI, Tools & services, Practice. Each group has a small-caps `--faded` label over a wrap of 1px-bordered `--bg-dim` chips. Data is `skills: [group, items[]][]` in `resume.ts`. Keep it current: outdated libraries (styled-components, Redux, Apollo) were removed. Print renders each group as one comma-separated line.

### 6.7 Now
An org list with keywords:
```
** NEXT Building client software at Atomic Object
- [X] Consulting across web & mobile products (clients confidential)
- [ ] …
```
- The keyword `NEXT` is `--popout` bold (NANO's popout face), and the checkboxes are drawn with CSS.
- Content is authored in `src/data/now.ts`. The copy is a draft for Bryan to edit.

### 6.8 Featured post (`* Writing`)
```
* Writing
** My Org-Roam Dailies workflow                 :emacs:org-roam:notetaking:
   <2023-05-12 Fri> · 4 min read
   After discovering PKM during the peak of the pandemic, I've been fairly
   obsessed with building a second brain…
   [[/blog/my-org-roam-dailies-work-flow][Read post →]]    [[/blog][All 7 posts →]]
```
The post is selected automatically: the newest `date` in the collection.

### 6.9 Contact
A short sentence, then a `<dl>` with Email, GitHub and Twitch. The buffer ends in an org comment block that works as the footer:
```
# Local Variables:
# built-with: astro, uniorg
# © 2026 Bryan Paronto
# End:
```
This is rendered as a real `<footer>`, in the `--muted` colour, with the `#` characters in `--deco`.

### 6.10 Header-line
The header-line is covered in §5. With JS off, it shows the status tag, buffer name and section links; the breadcrumb, position, theme toggle and `?` are rendered only when JS is available.

### 6.11 Dialogs
- Both are native `<dialog>`: `?` opens **which-key** and `☰` opens **outline**. They're centred with a max width of 480px, a `--bg-dim` background, a 1px border, 4px radius and one soft shadow.
- `Esc` closes them and focus returns to the trigger.
- which-key is a two-column grid showing `key → description`. The keys are drawn as `<kbd>` with a 1px border.
- **Image viewer** (image-mode buffer with a modeline): `n`/`p` step through screenshots, `q` quits, a click on the image closes. Full-page desktop shots (≥1600px wide, taller than 1.2:1) get `.tall`: they show at up to 1100px wide and scroll inside the canvas (`overscroll-behavior: contain`) instead of shrinking to fit.
- **Scroll lock:** while any dialog is open, `html:has(dialog[open])` sets `overflow: hidden`; `scrollbar-gutter: stable` stops layout shift.

### 6.12 Blog post page
- The header-line buffer name becomes `<slug>.org`, and a `← bryanparonto` link sits at its left.
- The header block is `#+TITLE`, `#+DATE`, `#+TAGS`, plus reading time.
- Body:
  - Org headings keep their stars and depth colours.
  - Src blocks show their `#+begin_src lang` / `#+end_src` fence lines in `--deco` above and below a `--bg-dim` block. The block scrolls horizontally, has a copy button, and gets no radius.
- Afterwards come prev/next links and `← back to bryanparonto`.

### 6.13 Blog index (`writing.org`)
- An agenda-style list with one row per post: `<2023-05-12 Fri>  Title  :tags:`.
- On desktop the date column has a fixed width. On mobile the date sits above the title.
- Tag links go to `/tags/[tag]`.

## 7. Keyboard & accessibility details
- There's a skip link, "Skip to content", that appears on the first Tab.
- Key handlers are ignored when the event comes with modifiers (except Shift for `S-TAB`), comes from an input/textarea/contenteditable, or fires while a dialog is open (except `Esc`).
- `TAB` is only intercepted while a `<summary>` has focus **and** the user has opted in by pressing a nav key at least once. Before that, TAB is plain browser tabbing. This avoids surprising keyboard-only users; `Enter`/`Space` still fold natively.
- `S-TAB` cycles global visibility and announces the new state through a visually hidden live region ("Overview: headings only").
- Decorative glyphs (`*`, `#+`, `:`, `▾`, `▌`, line numbers) are `aria-hidden`.
- Print stylesheet:
  - Hides the chrome.
  - Forces the light palette and opens all sections.
  - Shows link URLs after the link text.
  - Hides project images.
  - Puts a page break before `* Writing` and hides Writing and Contact.
  - The result is the résumé.

## 8. Imagery
- **Headshot:** `me.jpg` goes in About, square and 1px bordered, at `clamp(120px, 28vw, 200px)`, floated right on ≥768px and stacked under the heading on mobile. A single constant makes it easy to swap later.
- **Project screenshots:** full-page PNG captures (1440 wide at 2×; Firefox responsive mode → `:screenshot --fullpage --dpr 2`), re-encoded to AVIF/WebP through `astro:assets`. Disable browser extensions that overlay the page before capturing.
- **Logo:** the beard SVG from the old site, used as the favicon and in the footer. NANO chrome carries no logo.
- **OG image:** a static 1200×630 PNG of the header block in Everforest dark.

## 9. Anti-goals (things to avoid)
- Card grids, gradients, glassmorphism, drop-shadowed panels, emoji-as-icons.
- A fake terminal prompt, or typewriter animations on the body text.
- Colour used as the only signal (TODO states also carry the keyword text).
- Anything hidden by default that a recruiter needs.
