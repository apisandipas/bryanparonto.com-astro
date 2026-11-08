/**
 * Progressive enhancement for the org buffer:
 * header-line breadcrumb/position, theme toggle, which-key + outline dialogs,
 * and org-style keybindings. Everything works without it.
 */

const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const behavior = (): ScrollBehavior => (reducedMotion() ? "auto" : "smooth");

function announce(msg: string) {
  const el = $("[data-announce]");
  if (!el) return;
  el.textContent = "";
  requestAnimationFrame(() => (el.textContent = msg));
}

/* ---------- theme ---------- */

function effectiveTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function paintThemeButton() {
  const theme = effectiveTheme();
  const icon = $("[data-theme-icon]");
  if (icon) icon.textContent = theme === "dark" ? "☾" : "☀";
  $("[data-theme-toggle]")?.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
}

function toggleTheme() {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
  paintThemeButton();
  announce(`${next} theme`);
}

/* ---------- headings ---------- */

const sections = () => $$<HTMLDetailsElement>("details.org-section");

/** Headings the reader can currently see (not inside a folded parent). */
function visibleSummaries(): HTMLElement[] {
  return sections()
    .filter((d) => {
      let p = d.parentElement?.closest("details");
      while (p) {
        if (!p.open) return false;
        p = p.parentElement?.closest("details");
      }
      return true;
    })
    .map((d) => d.querySelector("summary")!)
    .filter(Boolean);
}

function headerOffset() {
  return ($(".headerline") as HTMLElement | null)?.offsetHeight ?? 0;
}

function goTo(summary: HTMLElement) {
  summary.focus({ preventScroll: true });
  const y = summary.getBoundingClientRect().top + scrollY - headerOffset() - 16;
  scrollTo({ top: y, behavior: behavior() });
}

function currentIndex(list: HTMLElement[]) {
  const active = document.activeElement;
  const i = list.indexOf(active as HTMLElement);
  if (i >= 0) return i;
  // otherwise: the last heading above the header-line's bottom edge
  const line = headerOffset() + 24;
  let idx = -1;
  list.forEach((s, n) => {
    if (s.getBoundingClientRect().top <= line) idx = n;
  });
  return idx;
}

function step(dir: 1 | -1) {
  const list = visibleSummaries();
  if (!list.length) return;
  const i = currentIndex(list);
  const next = list[Math.min(list.length - 1, Math.max(0, i + dir))];
  if (next) goTo(next);
}

const CYCLE = ["overview", "contents", "all"] as const;
let cycle = 2; // everything starts open ("show all")

function cycleVisibility() {
  cycle = (cycle + 1) % CYCLE.length;
  const state = CYCLE[cycle];
  for (const d of sections()) {
    const lvl1 = d.classList.contains("lvl-1");
    if (state === "overview") d.open = !lvl1 ? d.open : false;
    else if (state === "contents") d.open = lvl1 ? true : false;
    else if (!d.name) d.open = true; // named (exclusive) groups stay as they are
  }
  announce(
    state === "overview"
      ? "Overview: top-level headings only"
      : state === "contents"
        ? "Contents: all headings"
        : "Show all",
  );
}

/* ---------- header-line ---------- */

function initHeaderline() {
  const crumb = $("[data-crumb]");
  const pos = $("[data-pos]");
  let ticking = false;

  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.round((scrollY / max) * 100) : 0;
    const where = scrollY < 8 ? "Top" : pct >= 99 ? "Bot" : `${pct}%`;
    if (pos) pos.textContent = where;

    if (crumb) {
      const line = headerOffset() + 24;
      let l1 = "";
      let l2 = "";
      for (const d of sections()) {
        const top = d.getBoundingClientRect().top;
        if (top > line) break;
        if (d.classList.contains("lvl-1")) {
          l1 = d.dataset.heading ?? "";
          l2 = "";
        } else if (d.getBoundingClientRect().bottom > line) {
          l2 = d.dataset.heading ?? "";
        }
      }
      crumb.textContent = l1 ? `· * ${l1}${l2 ? ` › ${l2}` : ""}` : "";
    }
  };

  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  addEventListener("resize", update);
  document.addEventListener("toggle", update, true);
  update();
}

/* ---------- dialogs ---------- */

let returnFocus: HTMLElement | null = null;

function openDialog(id: string) {
  const dlg = document.getElementById(id) as HTMLDialogElement | null;
  if (!dlg || dlg.open) return;
  returnFocus = document.activeElement as HTMLElement;
  if (id === "outline") buildOutline();
  dlg.showModal();
  if (id === "outline") $<HTMLElement>("[data-outline-list] a", dlg)?.focus();
}

function buildOutline() {
  const list = $("[data-outline-list]");
  if (!list) return;
  list.innerHTML = "";
  // jobs are summarised by the Experience table, so keep the outline short
  for (const d of sections().filter((s) => !s.classList.contains("job"))) {
    const li = document.createElement("li");
    li.className = d.classList.contains("lvl-1") ? "o-1" : "o-2";
    const a = document.createElement("a");
    a.href = `#${d.id}`;
    const stars = document.createElement("span");
    stars.className = "stars";
    stars.setAttribute("aria-hidden", "true");
    stars.textContent = d.classList.contains("lvl-1") ? "* " : "** ";
    a.append(stars, d.dataset.heading ?? d.id);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      (a.closest("dialog") as HTMLDialogElement).close();
      // make sure the target and its parents are unfolded
      let p: HTMLDetailsElement | null = d;
      while (p) {
        p.open = true;
        p = p.parentElement?.closest("details") ?? null;
      }
      history.replaceState(null, "", `#${d.id}`);
      goTo(d.querySelector("summary")!);
      returnFocus = null;
    });
    li.append(a);
    list.append(li);
  }
}

function initDialogs() {
  for (const btn of $$<HTMLElement>("[data-open]")) {
    btn.addEventListener("click", () => openDialog(btn.dataset.open!));
  }
  for (const dlg of $$<HTMLDialogElement>("dialog.popup")) {
    dlg.addEventListener("close", () => {
      returnFocus?.focus();
      returnFocus = null;
    });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close(); // backdrop
    });
    $$<HTMLElement>("[data-close]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
  }
}

/* ---------- image viewer (image-mode) ---------- */

function initViewer() {
  const dlg = document.getElementById("viewer") as HTMLDialogElement | null;
  const links = $$<HTMLAnchorElement>("a[data-viewer]");
  if (!dlg || links.length === 0) return;
  const img = $<HTMLImageElement>("[data-viewer-img]", dlg)!;
  const name = $("[data-viewer-name]", dlg)!;
  const pos = $("[data-viewer-pos]", dlg)!;
  let current = 0;
  const canvas = $("[data-viewer-canvas]", dlg)!;
  // Desktop shots (not phone shots) open at a readable width and scroll, instead of shrinking to fit the window.
  img.addEventListener("load", () => {
    dlg.classList.toggle("tall", img.naturalWidth >= 1600);
    canvas.scrollTop = 0;
  });

  const show = (i: number) => {
    current = (i + links.length) % links.length;
    const a = links[current];
    img.src = a.href;
    img.alt = a.dataset.alt ?? "";
    name.textContent = a.dataset.name ?? "";
    pos.textContent = `${current + 1}/${links.length}`;
  };

  links.forEach((a, i) =>
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // let new-tab clicks through
      e.preventDefault();
      returnFocus = a;
      show(i);
      dlg.showModal();
    }),
  );

  dlg.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === "q") dlg.close();
    else if (k === "n" || k === "j" || k === "ArrowRight" || k === " ") show(current + 1);
    else if (k === "p" || k === "k" || k === "ArrowLeft") show(current - 1);
    else return;
    e.preventDefault();
  });
  // a click on the image itself also quits, like dismissing a preview
  canvas.addEventListener("click", () => dlg.close());
}

/* ---------- keys ---------- */

function initKeys() {
  let tabEngaged = false;
  let lastG = 0;

  // Clicking a heading is as clear an opt-in as n/p: afterwards Tab folds it and S-Tab cycles, as in org-mode.
  // Plain keyboard tabbing still moves focus until a nav key is pressed, so headings never trap focus.
  document.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("summary")) tabEngaged = true;
  });

  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable='true']")) return;
    if ($("dialog[open]")) return; // native dialog handles Esc

    const onSummary = t.tagName === "SUMMARY";

    if (e.key === "Escape") {
      tabEngaged = false;
      return;
    }
    if (e.key === "Tab") {
      if (e.shiftKey && tabEngaged) {
        e.preventDefault();
        cycleVisibility();
      } else if (!e.shiftKey && onSummary && tabEngaged) {
        e.preventDefault();
        const d = t.parentElement as HTMLDetailsElement;
        d.open = !d.open;
      }
      return;
    }

    const engage = () => {
      tabEngaged = true;
      e.preventDefault();
    };
    switch (e.key) {
      case "n":
      case "j":
        engage();
        step(1);
        break;
      case "p":
      case "k":
        engage();
        step(-1);
        break;
      case "g": {
        const now = Date.now();
        if (now - lastG < 500) {
          engage();
          scrollTo({ top: 0, behavior: behavior() });
          lastG = 0;
        } else lastG = now;
        break;
      }
      case "G":
        engage();
        scrollTo({ top: document.documentElement.scrollHeight, behavior: behavior() });
        break;
      case "t":
        e.preventDefault();
        toggleTheme();
        break;
      case "o":
        e.preventDefault();
        openDialog("outline");
        break;
      case "?":
        e.preventDefault();
        openDialog("keys");
        break;
    }
  });
}

export function initBuffer() {
  paintThemeButton();
  $("[data-theme-toggle]")?.addEventListener("click", toggleTheme);
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", paintThemeButton);
  initHeaderline();
  initDialogs();
  initViewer();
  initKeys();
  initPrint();
}

/** Printing is the résumé: unfold everything, then restore. */
function initPrint() {
  let closed: HTMLDetailsElement[] = [];
  let named: (readonly [HTMLDetailsElement, string])[] = [];
  addEventListener("beforeprint", () => {
    closed = sections().filter((d) => !d.open);
    named = sections().filter((d) => d.name).map((d) => [d, d.name] as const);
    named.forEach(([d]) => d.removeAttribute("name"));
    closed.forEach((d) => (d.open = true));
  });
  addEventListener("afterprint", () => {
    closed.forEach((d) => (d.open = false));
    named.forEach(([d, n]) => (d.name = n));
  });
}
