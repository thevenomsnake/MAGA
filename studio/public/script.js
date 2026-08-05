const translations = {
  en: {
    "meta.title": "Sumimi — Development studio",
    "meta.description": "Sumimi is a small development studio for data tools, research systems, and new ways of building software.",
    "a11y.skip": "Skip to content",
    "nav.projects": "Projects",
    "nav.studio": "Studio",
    "nav.notes": "Notes",
    "hero.line1": "We make",
    "hero.line2": "useful things",
    "hero.line3": "from",
    "hero.accent": "curious",
    "hero.line4": "ideas.",
    "hero.body": "A small development studio for data tools, research systems, and new ways of building software.",
    "hero.cta": "Explore the projects",
    "hero.now": "Now building — Fairy",
    "projects.title": "Projects",
    "projects.fairy.body": "Data tools that turn scattered inputs into usable views.",
    "projects.fairy.status": "Now building",
    "projects.fairy.note": "formerly data.sumimi.jp",
    "projects.research.body": "Notes, experiments, and evidence from how we build.",
    "projects.research.status": "Open",
    "projects.maga.body": "A product-lead workflow for building software with Codex.",
    "projects.maga.status": "Coming next",
    "studio.title": "Studio",
    "studio.line1": "Independent studio.",
    "studio.line2": "Serious craft.",
    "studio.line3": "Room for strange ideas.",
    "studio.body": "Sumimi is an independent development studio. We explore data, research, and human–AI collaboration by shipping things people can actually use.",
    "studio.cta": "Read our working notes",
    "footer.made": "Made on the open web."
  },
  ja: {
    "meta.title": "Sumimi — 開発スタジオ",
    "meta.description": "Sumimiは、データツール、リサーチシステム、そしてソフトウェア開発の新しい方法を探る小さな開発スタジオです。",
    "a11y.skip": "本文へ移動",
    "nav.projects": "プロジェクト",
    "nav.studio": "スタジオ",
    "nav.notes": "ノート",
    "hero.line1": "好奇心から",
    "hero.line2": "役に立つものを",
    "hero.line3": "つくる",
    "hero.accent": "小さな",
    "hero.line4": "スタジオ。",
    "hero.body": "データツール、リサーチシステム、そしてソフトウェア開発の新しい方法を探ります。",
    "hero.cta": "プロジェクトを見る",
    "hero.now": "開発中 — Fairy",
    "projects.title": "プロジェクト",
    "projects.fairy.body": "散らばったデータを、使える景色へ変えるツール。",
    "projects.fairy.status": "開発中",
    "projects.fairy.note": "旧 data.sumimi.jp",
    "projects.research.body": "私たちの作り方から生まれた記録、実験、そして根拠。",
    "projects.research.status": "公開中",
    "projects.maga.body": "Codexとソフトウェアを作る、プロダクトリードのワークフロー。",
    "projects.maga.status": "次回公開",
    "studio.title": "スタジオ",
    "studio.line1": "独立したスタジオ。",
    "studio.line2": "確かな技術。",
    "studio.line3": "奇妙なアイデアの余白。",
    "studio.body": "Sumimiは独立した開発スタジオです。データ、リサーチ、人とAIの協働を、実際に使えるものを届けながら探求します。",
    "studio.cta": "開発ノートを読む",
    "footer.made": "オープンなウェブで作りました。"
  }
};

const languageKey = "sumimi-language";
const languageButtons = document.querySelectorAll("[data-language]");
const descriptionMeta = document.querySelector('meta[name="description"]');
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

function readLanguage() {
  try {
    const saved = localStorage.getItem(languageKey);
    if (saved && translations[saved]) return saved;
  } catch {
    // Browser storage is optional.
  }

  return navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
}

function setLanguage(language, persist = false) {
  const active = translations[language] ? language : "en";
  const messages = translations[active];
  document.documentElement.lang = active;
  document.title = messages["meta.title"];
  if (descriptionMeta) descriptionMeta.content = messages["meta.description"];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = messages[element.dataset.i18n];
    if (value) element.textContent = value;
  });

  languageButtons.forEach((button) => {
    const current = button.dataset.language === active;
    button.classList.toggle("is-current", current);
    button.setAttribute("aria-pressed", String(current));
  });

  if (persist) {
    try {
      localStorage.setItem(languageKey, active);
    } catch {
      // The selected language still applies for this visit.
    }
  }
}

function closeNavigation() {
  if (!navToggle || !nav) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language, true));
});

const revealElements = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

setLanguage(readLanguage());

function revealHashTarget() {
  const requestedView = new URLSearchParams(location.search).get("view");
  const selector = location.hash || (requestedView ? `#${requestedView}` : "");
  if (!selector) return;
  const target = document.querySelector(selector);
  if (!target) return;

  target.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("is-visible");
  });
  target.scrollIntoView({ block: "start" });
}

window.addEventListener("load", () => requestAnimationFrame(revealHashTarget));
window.addEventListener("hashchange", () => requestAnimationFrame(revealHashTarget));
