# UI Redesign "The Engineer" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Minima theme with a custom "Engineer" design — sans-serif, clean lines, dark navy accent, light/dark mode toggle, integrated language switcher.

**Architecture:** Drop the Minima theme entirely. Create a custom `default.html` base layout with navbar and footer, a CSS file using custom properties for light/dark theming, and a small JS file for the dark mode toggle. Rewrite `home-lang.html` with hero section and styled article list. Restyle `post.html` with prose typography. Rework the language switcher as navbar-integrated pills.

**Tech Stack:** Jekyll, GitHub Pages, vanilla CSS (custom properties), vanilla JS, system font stack.

**Spec:** `docs/superpowers/specs/2026-04-06-ui-redesign-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `assets/css/main.css` | Create | All styles: CSS variables, light/dark themes, layout, typography, prose, responsive |
| `assets/js/theme.js` | Create | Dark mode toggle: localStorage, prefers-color-scheme, DOM attribute |
| `_layouts/default.html` | Create | Base layout: HTML shell, navbar, footer, CSS/JS includes |
| `_layouts/home-lang.html` | Rewrite | Homepage: hero section + bilingual article list |
| `_layouts/post.html` | Rewrite | Article page: styled header + prose content |
| `_includes/lang-switcher.html` | Rewrite | Navbar-integrated language pills |
| `_config.yml` | Modify | Remove `theme: minima` |
| `index.md` | Modify | Simplify root page (redirect or default lang) |
| `en/index.md` | No change | Already correct |
| `it/index.md` | No change | Already correct |

---

### Task 1: Create CSS stylesheet with design system

**Files:**
- Create: `assets/css/main.css`

- [ ] **Step 1: Create the CSS file with custom properties and light/dark themes**

```css
/* === Custom Properties === */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --text-muted: #666666;
  --accent: #1a3a5c;
  --border: #eeeeee;
  --border-strong: #1a1a1a;
  --code-bg: #f6f8fa;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  --content-width: 720px;
  --padding-x: 32px;
}

[data-theme="dark"] {
  --bg: #0d1117;
  --text: #e6edf3;
  --text-muted: #8b949e;
  --accent: #4a8fe7;
  --border: #21262d;
  --border-strong: #e6edf3;
  --code-bg: #161b22;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0d1117;
    --text: #e6edf3;
    --text-muted: #8b949e;
    --accent: #4a8fe7;
    --border: #21262d;
    --border-strong: #e6edf3;
    --code-bg: #161b22;
  }
}

/* === Reset & Base === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-muted);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; height: auto; }

/* === Layout === */
.site-wrapper {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--padding-x);
}

/* === Navbar === */
.site-nav {
  border-bottom: 2px solid var(--border-strong);
}

.site-nav-inner {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 16px var(--padding-x);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-logo {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.5px;
  text-decoration: none;
}
.site-logo:hover { text-decoration: none; }

.site-nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}

/* === Language Switcher === */
.lang-pill {
  color: #fff;
  background: var(--accent);
  padding: 3px 10px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-decoration: none;
}

.lang-link {
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.5px;
  text-decoration: none;
}
.lang-link:hover { color: var(--text); text-decoration: none; }

.nav-divider {
  width: 1px;
  height: 16px;
  background: var(--border);
}

/* === Theme Toggle === */
.theme-toggle {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.theme-toggle:hover { color: var(--text); }

/* === Hero === */
.hero {
  padding: 48px 0 40px;
}

.hero-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -1.5px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.hero-description {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 520px;
  margin-bottom: 20px;
}

.accent-bar {
  width: 48px;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
}

/* === Article List === */
.section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 12px;
}

.article-list {
  list-style: none;
}

.article-item {
  padding: 20px 0;
  border-top: 1px solid var(--border);
}

.article-date {
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}

.article-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.3;
  margin-bottom: 6px;
}

.article-title a {
  color: var(--text);
  text-decoration: none;
}
.article-title a:hover { text-decoration: underline; }

.article-description {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* === Post === */
.post-header {
  padding: 48px 0 40px;
}

.post-date {
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}

.post-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -1.5px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.post-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
}

/* === Prose (post content) === */
.prose {
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-muted);
}

.prose h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin-top: 48px;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.prose h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-top: 32px;
  margin-bottom: 12px;
}

.prose p { margin-bottom: 16px; }

.prose ul, .prose ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.prose li { margin-bottom: 8px; }

.prose blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 20px;
  font-style: italic;
  color: var(--text-muted);
  margin: 24px 0;
}

.prose code {
  font-family: var(--font-mono);
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85em;
}

.prose pre {
  background: var(--code-bg);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 24px 0;
}

.prose pre code {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: 14px;
  line-height: 1.6;
}

.prose img {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
}

.prose a { text-decoration: underline; }
.prose a:hover { color: var(--text); }

.prose hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 32px 0;
}

.prose strong { color: var(--text); }

/* === Footer === */
.site-footer {
  border-top: 2px solid var(--border-strong);
  padding: 20px 0;
  margin-top: 40px;
}

.site-footer-inner {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--padding-x);
}

.footer-text {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* === Responsive === */
@media (max-width: 768px) {
  :root {
    --padding-x: 20px;
  }

  .hero-title, .post-title {
    font-size: 28px;
  }

  .article-title {
    font-size: 18px;
  }

  .prose {
    font-size: 16px;
  }
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la assets/css/main.css`
Expected: file listed with size > 0

- [ ] **Step 3: Commit**

```bash
git add assets/css/main.css
git commit -m "feat: add custom CSS stylesheet with light/dark theme variables"
```

---

### Task 2: Create dark mode toggle script

**Files:**
- Create: `assets/js/theme.js`

- [ ] **Step 1: Create the JS file**

```javascript
(function () {
  var STORAGE_KEY = "theme";

  function getPreferred() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "\u2600" : "\u263D";
  }

  function toggle() {
    var current = document.documentElement.getAttribute("data-theme") || getPreferred();
    var next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  // Apply immediately to prevent flash
  apply(getPreferred());

  // Bind toggle button after DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) btn.addEventListener("click", toggle);
  });
})();
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la assets/js/theme.js`
Expected: file listed with size > 0

- [ ] **Step 3: Commit**

```bash
git add assets/js/theme.js
git commit -m "feat: add dark mode toggle script with localStorage persistence"
```

---

### Task 3: Create default base layout

**Files:**
- Create: `_layouts/default.html`

- [ ] **Step 1: Create the base layout**

This layout provides the HTML shell, navbar with integrated language switcher, footer, and includes CSS/JS.

```html
<!DOCTYPE html>
<html lang="{{ page.lang | default: 'en' }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if page.title %}{{ page.title | escape }} — {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
  <meta name="description" content="{{ page.description | default: site.description | escape }}">
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  <nav class="site-nav">
    <div class="site-nav-inner">
      <a class="site-logo" href="{{ '/' | relative_url }}">About AI</a>
      <div class="site-nav-right">
        {% include lang-switcher.html %}
        <div class="nav-divider"></div>
        <button class="theme-toggle" aria-label="Toggle dark mode">&#9789;</button>
      </div>
    </div>
  </nav>

  <main class="site-wrapper">
    {{ content }}
  </main>

  <footer class="site-footer">
    <div class="site-footer-inner">
      <p class="footer-text">&copy; {{ site.time | date: '%Y' }} {{ site.title }}</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la _layouts/default.html`
Expected: file listed

- [ ] **Step 3: Commit**

```bash
git add _layouts/default.html
git commit -m "feat: add custom default layout with navbar and footer"
```

---

### Task 4: Rewrite language switcher as navbar pills

**Files:**
- Modify: `_includes/lang-switcher.html` (full rewrite)

- [ ] **Step 1: Rewrite the language switcher**

Replace the entire contents of `_includes/lang-switcher.html` with:

```html
{% assign current_lang = page.lang | default: "en" %}
{% if current_lang == "it" %}
  {% if page.ref %}
    {% assign en_target = site.posts | where: "ref", page.ref | where: "lang", "en" | first %}
  {% endif %}
  {% assign en_url = en_target.url | default: "/en/" %}
  <a class="lang-link" href="{{ en_url | relative_url }}">EN</a>
  <span class="lang-pill">IT</span>
{% else %}
  <span class="lang-pill">EN</span>
  {% if page.ref %}
    {% assign it_target = site.posts | where: "ref", page.ref | where: "lang", "it" | first %}
  {% endif %}
  {% assign it_url = it_target.url | default: "/it/" %}
  <a class="lang-link" href="{{ it_url | relative_url }}">IT</a>
{% endif %}
```

- [ ] **Step 2: Commit**

```bash
git add _includes/lang-switcher.html
git commit -m "feat: restyle language switcher as navbar-integrated pills"
```

---

### Task 5: Rewrite homepage layout with hero section

**Files:**
- Modify: `_layouts/home-lang.html` (full rewrite)

- [ ] **Step 1: Rewrite the homepage layout**

Replace the entire contents of `_layouts/home-lang.html` with:

```html
---
layout: default
---

{% assign lang = page.lang | default: "en" %}
{% assign posts = site.posts | where: "lang", lang %}

<section class="hero">
  <h1 class="hero-title">{{ site.title }}</h1>
  <p class="hero-description">{{ site.description }}</p>
  <div class="accent-bar"></div>
</section>

{% if posts.size > 0 %}
<section>
  <p class="section-label">
    {% if lang == "it" %}Ultimi Articoli{% else %}Latest Articles{% endif %}
  </p>
  <ul class="article-list">
    {% for post in posts %}
    <li class="article-item">
      <p class="article-date">
        <time datetime="{{ post.date | date_to_xmlschema }}">
          {{ post.date | date: "%b %-d, %Y" }}
        </time>
      </p>
      <h2 class="article-title">
        <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      </h2>
      {% if post.description %}
      <p class="article-description">{{ post.description }}</p>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
</section>
{% endif %}

{{ content }}
```

- [ ] **Step 2: Commit**

```bash
git add _layouts/home-lang.html
git commit -m "feat: rewrite homepage layout with hero section and styled article list"
```

---

### Task 6: Rewrite post layout with prose styling

**Files:**
- Modify: `_layouts/post.html` (full rewrite)

- [ ] **Step 1: Rewrite the post layout**

Replace the entire contents of `_layouts/post.html` with:

```html
---
layout: default
---

<article class="h-entry" itemscope itemtype="http://schema.org/BlogPosting">
  <header class="post-header">
    <p class="post-date">
      <time class="dt-published" datetime="{{ page.date | date_to_xmlschema }}" itemprop="datePublished">
        {{ page.date | date: "%b %-d, %Y" }}
      </time>
    </p>
    <h1 class="post-title p-name" itemprop="name headline">{{ page.title | escape }}</h1>
    {% if page.description %}
    <p class="post-subtitle">{{ page.description }}</p>
    {% endif %}
    <div class="accent-bar"></div>
  </header>

  <div class="prose e-content" itemprop="articleBody">
    {{ content }}
  </div>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add _layouts/post.html
git commit -m "feat: rewrite post layout with prose typography"
```

---

### Task 7: Update config and root index

**Files:**
- Modify: `_config.yml` (line 6: remove `theme: minima`)
- Modify: `index.md` (simplify)

- [ ] **Step 1: Remove the minima theme from config**

In `_config.yml`, delete the line `theme: minima` (line 6). The file should become:

```yaml
title: About AI
description: Articles on AI agents, Skills, MCP, and modern AI-assisted workflows.
baseurl: /about-ai
url: https://russosalv.github.io

permalink: /:year/:month/:day/:title/

defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      lang: "en"

exclude:
  - README.md
  - LICENSE
  - docs/
  - .superpowers/
```

Note: also exclude `docs/` and `.superpowers/` from the built site.

- [ ] **Step 2: Simplify root index.md**

Replace the contents of `index.md` with:

```markdown
---
layout: home-lang
title: About AI
lang: en
---
```

This makes the root page use the English homepage directly, removing the intermediate language chooser (users can switch via the navbar pill).

- [ ] **Step 3: Commit**

```bash
git add _config.yml index.md
git commit -m "feat: remove minima theme, simplify root index, exclude docs from build"
```

---

### Task 8: Visual verification and cleanup

- [ ] **Step 1: Build the site locally to check for errors**

Run: `cd /Users/salvatorealessandrorusso/Dev/about-ai && bundle exec jekyll build 2>&1 || jekyll build 2>&1`

Expected: Build succeeds with no errors. If Jekyll is not installed locally, check the file structure is correct:

Run: `ls -la _layouts/ _includes/ assets/css/ assets/js/`

Expected: All files present:
- `_layouts/default.html`
- `_layouts/home-lang.html`
- `_layouts/post.html`
- `_includes/lang-switcher.html`
- `assets/css/main.css`
- `assets/js/theme.js`

- [ ] **Step 2: Verify no references to minima remain**

Run: `grep -r "minima" _config.yml _layouts/ _includes/ --include="*.html" --include="*.yml" --include="*.md"`

Expected: No output (no references to minima)

- [ ] **Step 3: Add .superpowers to .gitignore**

Append to `.gitignore` (create if it doesn't exist):

```
.superpowers/
```

- [ ] **Step 4: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```
