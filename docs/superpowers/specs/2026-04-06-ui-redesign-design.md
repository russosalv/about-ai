# About AI — UI Redesign Spec

**Date:** 2026-04-06
**Direction:** "The Engineer" — Tech/Editoriale, sans-serif, linee nette, accent blu scuro
**Platform:** Jekyll + GitHub Pages (no build tools beyond what GH Pages provides)

## Design System

### Typography
- **Font stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif`
- **Headings:** font-weight 800, negative letter-spacing (-1.5px for h1, -0.5px for h2/h3)
- **Body:** font-weight 400, 16px, line-height 1.6, color muted
- **Labels/dates:** 11px, uppercase, letter-spacing 2px, font-weight 700, accent color
- No external font loading — system fonts only for maximum performance

### Color Palette

**Light mode (default):**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#ffffff` | Page background |
| `--text` | `#1a1a1a` | Headings, primary text |
| `--text-muted` | `#666666` | Body text, descriptions |
| `--accent` | `#1a3a5c` | Links, dates, labels, accent bar |
| `--border` | `#eeeeee` | Article separators |
| `--border-strong` | `#1a1a1a` | Navbar bottom, footer top |
| `--code-bg` | `#f6f8fa` | Code block background |

**Dark mode:**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0d1117` | Page background |
| `--text` | `#e6edf3` | Headings, primary text |
| `--text-muted` | `#8b949e` | Body text, descriptions |
| `--accent` | `#4a8fe7` | Links, dates, labels, accent bar |
| `--border` | `#21262d` | Article separators |
| `--border-strong` | `#e6edf3` | Navbar bottom, footer top |
| `--code-bg` | `#161b22` | Code block background |

### Dark Mode Implementation
- CSS custom properties (variables) for all colors
- JavaScript toggle that sets a `data-theme="dark"` attribute on `<html>`
- User preference saved in `localStorage`
- Respects `prefers-color-scheme` media query as default
- Toggle icon: moon (&#9789;) for light mode, sun (&#9788;) for dark mode

## Layout Structure

### Max Width
- Content area: `720px`, centered with auto margins
- Navbar: full width with content constrained to same max-width
- Consistent horizontal padding: `32px` (desktop), `20px` (mobile)

### Navbar
- **Left:** "About AI" logo text — 20px, weight 800, letter-spacing -0.5px
- **Right:** Language switcher + dark mode toggle
  - Active language: white text on accent background pill (padding 3px 10px, border-radius 4px)
  - Inactive language: muted color, clickable
  - Vertical divider (1px) between language and theme toggle
  - Theme toggle: moon/sun icon, muted color
- **Border bottom:** 2px solid `--border-strong`
- Sticky/fixed: no (static position, scrolls with page)

### Homepage

**Hero section:**
- Title: "About AI" — 36px, weight 800, letter-spacing -1.5px
- Description: site description from `_config.yml` — 16px, muted color, max-width 520px
- Accent bar: 48px wide, 3px tall, accent color, border-radius 2px
- Padding: 48px top, 40px bottom

**Article list:**
- Section label: "Latest Articles" / "Ultimi Articoli" — 11px uppercase, accent color, letter-spacing 2px
- Each article separated by 1px `--border` top border
- Article layout:
  - Date: 11px, uppercase, accent color, weight 600, letter-spacing 0.8px
  - Title: 20px, weight 700, `--text` color, letter-spacing -0.5px, line-height 1.3
  - Description: 14px, `--text-muted`, line-height 1.5
- Padding per article: 20px vertical

### Post Page
- Same navbar as homepage
- Language switcher in navbar (same position)
- Post header:
  - Date: same style as list (11px uppercase accent)
  - Title: 36px, weight 800, letter-spacing -1.5px
  - Description/subtitle: 18px, muted, below title
  - Accent bar below header (same as hero)
- Post content:
  - Prose styling: 18px body text, line-height 1.8
  - `h2`: 24px, weight 700, margin-top 48px
  - `h3`: 20px, weight 700, margin-top 32px
  - Code blocks: monospace, slight background tint, border-radius 6px, padding 16px
  - Inline code: slight background tint, padding 2px 6px, border-radius 3px
  - Images: max-width 100%, border-radius 8px, subtle shadow
  - Blockquotes: left border 3px accent, padding-left 20px, italic
  - Links: accent color, underline on hover

### Footer
- Top border: 2px solid `--border-strong`
- Copyright text: 11px, muted color
- Minimal — no extra links or sections needed

## Responsive Design

### Breakpoints
- **Desktop:** > 768px — full layout as described
- **Mobile:** <= 768px
  - Padding: 20px horizontal
  - Hero title: 28px
  - Article titles: 18px
  - Post body: 16px
  - Navbar: same layout, slightly tighter spacing

## Language Switcher

- Integrated in navbar (right side, before dark mode toggle)
- Active language: pill with accent background, white text
- Inactive language: plain muted text, clickable
- Links to corresponding translated post (via `ref` frontmatter) or language home
- Same behavior as current implementation, just restyled

## Files to Create/Modify

### New files:
- `assets/css/main.css` — Complete custom stylesheet with CSS variables and dark mode
- `assets/js/theme.js` — Dark mode toggle logic (localStorage + prefers-color-scheme)
- `_layouts/default.html` — New base layout (navbar, footer, theme script) — replaces Minima's default

### Files to modify:
- `_config.yml` — Remove `theme: minima` (custom layouts replace it entirely)
- `_layouts/home-lang.html` — New homepage layout with hero + article list
- `_layouts/post.html` — New post layout with styled prose
- `_includes/lang-switcher.html` — Restyle as navbar-integrated pills
- `index.md` — Update to use new layout
- `en/index.md` — Update if needed
- `it/index.md` — Update if needed

### Files to remove:
- No files to remove (Minima theme will be overridden by custom layouts)

## Constraints
- Must work on GitHub Pages (no plugins outside GH Pages whitelist)
- No external font loading (system fonts only)
- No JavaScript frameworks — vanilla JS only for dark mode toggle
- CSS custom properties for theming (supported by all modern browsers)
- Semantic HTML preserved (schema.org, microformats)
- Bilingual support maintained with same `ref`-based linking
