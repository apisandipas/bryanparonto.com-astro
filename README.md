# bryanparonto.com

My site is an org-mode buffer: a single page, plus blog routes. It's built with Astro, and the design follows N Λ N O Emacs with the Everforest palette.
See `spec.md` (what and why) and `DESIGN.md` (tokens, components, behaviour).

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/ (Netlify: publish dir = dist)
npx astro check   # type check
```

## Editing content

| What | Where |
|---|---|
| Name, role, summary, email, links | `src/data/resume.ts` → `person` |
| Experience, skills, *Now* | `src/data/resume.ts` (`jobs`, `skills`, `now`) |
| Blog posts | `src/content/posts/*.org`: `#+TITLE`, `#+DATE`, `#+TAGS`, `#+PUBLISHED` |
| Projects | `src/content/projects/*.org`: `#+order`, `#+client`, `#+role`, `#+launch_date`, `#+image`, `#+alt`, `#+tech`, `#+url`, `#+link_label`, `#+outcome` |
| Project screenshots | `src/assets/projects/` |
| Headshot | replace `src/assets/me.jpg` (square crop works best) |
| Résumé PDF | `public/bryan-paronto-resume.pdf` |

The front page always features the **newest** post, taken from the `#+DATE` keyword.
Old URLs (`/posts/*`, `/projects`) redirect via `public/_redirects`.

## Keys
`n`/`p` (`j`/`k`) move between headings · `Tab` folds (after n/p) · `⇧Tab` cycles overview/contents/all · `gg`/`G` jump to top/bottom · `o` outline · `t` theme · `?` help
