# Design Spec: The Kinetic Architect — Portfolio Redesign

**Date:** 2026-04-13
**Approach:** Hybrid rebuild — new HTML structure + CSS, transplanted JS logic
**Reference:** Neon Cyber design system + Kinetic Architect principles

---

## 1. Design Principles

- **No-Line Rule:** No 1px solid borders for section separation. Boundaries defined by background shifts and gradient bleeds only.
- **No Standard Grids:** Card rows alternate proportions (65/35, 35/65, full-width). No uniform column layouts.
- **No Dividers:** No `<hr>` elements. Use spacing scale (`4rem`–`8rem`) or background shifts.
- **No Pure Black:** Use `--bg` (#0A0A0F) instead of #000. Preserves glassmorphism depth.
- **Asymmetric Layouts:** Elements offset from baseline. Photo in hero drops ~80px below text grid line.
- **Mono for Numbers:** JetBrains Mono for all dates, version numbers, statistics, badge labels.
- **Breathing Room:** Section padding minimum `6rem` vertical. Double if in doubt.

---

## 2. Design Tokens

### Colors
```css
--bg:           #0A0A0F   /* deep void — global backdrop */
--surface:      #131318   /* base content layer */
--surface-lo:   #1b1b20   /* section backgrounds */
--surface-hi:   #2a2930   /* elevated cards */
--surface-top:  #35343a   /* interactive components, badges */
--primary:      #3b82f6   /* electric blue — CTAs, active states */
--secondary:    #a855f7   /* purple — accents, highlights */
--tertiary:     #00ffc8   /* cyan — timeline nodes, data viz, labels */
--on-surface:   #e2e2ea   /* primary text */
--on-surface2:  #9b9baf   /* secondary text */
--ghost-border: rgba(66,71,84,0.15)  /* ghost border — barely visible edges */
--glow-primary: rgba(59,130,246,0.08)
--glow-secondary: rgba(168,85,247,0.06)
--glow-tertiary: rgba(0,255,200,0.06)
```

### Typography
| Role | Font | Weight | Size | Letter-spacing |
|------|------|--------|------|----------------|
| Display / Hero | Space Grotesk | 800 | `clamp(3.5rem, 8vw, 6rem)` | `-0.02em` |
| Headlines (h2) | Space Grotesk | 700 | `clamp(2rem, 4vw, 3rem)` | `-0.02em` |
| Subheadings (h3) | Space Grotesk | 600 | `1.25rem` | `-0.01em` |
| Body | Inter | 400 | `1rem` | `0` |
| Body emphasis | Inter | 500 | `1rem` | `0` |
| Labels / Badges | JetBrains Mono | 500 | `0.7rem` | `0.05em` |
| Dates / Stats | JetBrains Mono | 400 | `0.75rem` | `0.08em` |

Google Fonts import: `Space Grotesk:wght@400;600;700;800`, `Inter:wght@400;500`, `JetBrains+Mono:wght@400;500`

### Spacing Scale
`xs: 0.5rem` | `sm: 1rem` | `md: 1.5rem` | `lg: 2.5rem` | `xl: 4rem` | `2xl: 6rem` | `3xl: 8rem`

### Elevation (Glassmorphism)
```css
/* Card — standard floating element */
background: rgba(27, 27, 32, 0.6);
backdrop-filter: blur(16px);
border: 1px solid var(--ghost-border);

/* Modal / Nav */
background: rgba(19, 19, 24, 0.75);
backdrop-filter: blur(20px);

/* Ghost border with accent corner (top-left only) — use ::before pseudo-element,
   not border-image, as border-image conflicts with backdrop-filter */
/* ::before: position absolute, inset 0, border-radius inherited,
   background: linear-gradient(135deg, var(--primary) 0%, transparent 30%),
   mask: the border area only via padding-box */
```

### Ambient Shadows
```css
/* Floating card */
box-shadow: 0 0 60px var(--glow-primary);

/* Section accent bleeds */
background: radial-gradient(ellipse at top, var(--glow-secondary) 0%, transparent 60%);
```

---

## 3. Section-by-Section Spec

### 3.1 Navigation
- Fixed, full-width glass bar: `--surface` 75% opacity, `backdrop-filter: blur(20px)`
- Ghost border bottom only (no solid line)
- Left: "SR" monogram in Space Grotesk 700
- Center: nav links in JetBrains Mono uppercase, `0.1em` spacing
- Right: social icon row + theme toggle (keep existing)
- On scroll: increase opacity to 92%, reduce padding (`0.9rem` → `0.6rem`)

### 3.2 Hero
- **Grid:** `65fr / 35fr`, `align-items: start`. Text block left, photo floats right offset `80px` downward.
- **Canvas:** Canvas 2D particles (transplanted from current), recolored to `--primary` / `--secondary` / `--tertiary`
- **Text stack (top to bottom):**
  1. JetBrains Mono label — `// Full Stack Developer` in `--tertiary`
  2. `<h1>` Space Grotesk 800 — "SUNIL RATHOD", gradient `--primary` → `--tertiary`
  3. Typewriter in Inter `--on-surface2`
  4. Description paragraph in Inter body `--on-surface2`
  5. CTA row: Primary button (solid `--primary`) + Ghost button (no bg, `--primary` text)
- **Badge:** "Available for opportunities" — `--surface-top` bg, JetBrains Mono, 3s infinite ghost-border pulse → `--tertiary`
- **Photo:** 280×350 kept. No hard border. Conic-gradient glow halo behind at 6% opacity. Corner accent marks in `--tertiary`. Ambient shadow `0 0 60px var(--glow-primary)`.
- **Section gradient bleed:** Radial from `--secondary` at 4% fading to `--bg` at section bottom.

### 3.3 About
- **Grid:** `55fr / 45fr`
- **Bio (left):** Inter body. Career timeline inside — `--ghost-border` 1px spine, `--tertiary` glowing orb nodes (4px box-shadow), JetBrains Mono dates, Space Grotesk role labels.
- **Education card (right):** Glassmorphism card (`--surface-hi` 60%, `blur(16px)`, ghost border). `--primary` gradient accent top-left corner only. Degree in Space Grotesk 600, school/year in JetBrains Mono.
- **Section background:** `--surface-lo` with bold gradient bleed from `--primary` at top edge.

### 3.4 Experience
- **Spine:** 1px `--ghost-border` at 20% opacity, centered
- **Cards:** Alternate left/right stagger. Each is glassmorphism card (`--surface-lo` 60%, `blur(16px)`, ghost border).
- **Card anatomy:**
  - Role: Space Grotesk 700 `--on-surface`
  - Company: JetBrains Mono `--on-surface2`
  - Date range: JetBrains Mono `--tertiary`
  - Bullets: Inter body, `–` dash prefix (not `<ul>` dots)
- **Section background:** `--surface` with `--secondary` glow bleed from top.

### 3.5 Projects
- **Layout:** Stacked asymmetric rows. Portfolio has 4 projects:
  - Row 1: `65% / 35%` — Project 1 (large) + Project 2 (small)
  - Row 2: `35% / 65%` — Project 3 (small) + Project 4 (large)
- **Each card:** Glassmorphism (`--surface-lo` 60%, `blur(16px)`, ghost border). `--primary` → `--secondary` flow gradient top-left at 8% opacity.
- **Card anatomy:**
  - Project name: Space Grotesk 700
  - Description: Inter body
  - Tech stack: animated pill badges (JetBrains Mono, `--surface-top`, 3s border pulse)
  - No external links (current projects are internal enterprise tools — no live URLs)
- **Section background:** `--surface-lo` with `--primary` radial bleed.

### 3.6 Skills
- **Layout:** 3 horizontal swim lanes — Frontend / Backend / Cloud & AI
- **Lane label:** Space Grotesk 600, oversized (`4rem`), `--on-surface` at 5% opacity — background watermark
- **Badges:** Horizontally scrollable row, `--surface-top` bg, JetBrains Mono `0.7rem`, 3s infinite ghost-border → `--tertiary` pulse animation
- **Section background:** `--surface` with `--tertiary` glow bleed.

### 3.7 Certifications
- **Layout:** Two-row horizontal marquee/ticker (CSS `animation: scroll linear infinite`)
  - Row 1: scrolls left
  - Row 2: scrolls right
  - Both pause on hover (`animation-play-state: paused`)
- **Each cert pill:** `--surface-hi` bg, ghost border, issuer in JetBrains Mono `--on-surface2`, name in Inter 500
- **Section background:** `--surface-lo`.

### 3.8 Contact
- **Grid:** `50fr / 50fr`
- **Left:** Space Grotesk 700 oversized heading "Let's Connect" bleeds upward. Contact links as vertical stack — ghost-border pill style (email, LinkedIn, phone). JetBrains Mono link text.
- **Right:** Glassmorphism form card (`--surface-hi`, `blur(20px)`, ghost border). Fields have `--surface-top` bg, no hard borders — `--ghost-border` bottom only. Submit: solid `--primary` button with inner-glow (top white gradient 10% opacity).
- **Contact form JS:** Transplanted from current (fetch to Cloudflare Worker).

### 3.9 Footer
- `--surface` background. Centered layout.
- JetBrains Mono `--on-surface2`: copyright text
- Social icon row (LinkedIn, GitHub, Email) — minimal, 24px, `--on-surface2` fill

---

## 4. Transplanted JS (Unchanged)

These blocks carry over from the current `index.html` with only color token updates:

| Block | Changes needed |
|-------|---------------|
| Canvas 2D particles | Recolor to `--primary` / `--secondary` / `--tertiary` |
| Typewriter | None |
| Scroll reveal (IntersectionObserver) | None |
| Cursor dot/ring | Recolor to `--primary` |
| Scroll progress bar | Recolor |
| Nav scroll handler | None |
| Hero entrance CSS animation | Recolor + retime |
| Contact form (fetch) | None |
| Theme toggle | Update token values for light theme |
| Back to top | None |

---

## 5. Light Theme

Apply same structural design. Surface tokens lighten:
```css
--bg:          #f4f4f8
--surface:     #ffffff
--surface-lo:  #f0f0f5
--surface-hi:  #e8e8f0
--surface-top: #dcdce8
--on-surface:  #1a1a2e
--on-surface2: #5a5a72
```
Primary/secondary/tertiary remain the same hues, slightly darkened for contrast.

---

## 6. File Strategy

- Single `index.html` (same as current — no build tooling)
- All CSS inline in `<style>` block
- All JS inline in `<script>` block
- No new external dependencies (Space Grotesk + Inter via Google Fonts)
- Cloudflare Pages deployment unchanged

---

## 7. Out of Scope

- No new sections beyond current 7 (hero, about, experience, projects, skills, certs, contact)
- No CMS or dynamic content
- No routing or multi-page structure
- No new animations beyond what's specified above
