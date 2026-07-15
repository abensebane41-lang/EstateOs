# Typography — EstateOS

> Typography defines the visual voice of EstateOS.
> This document specifies fonts, sizes, weights, and usage rules.

---

## 0. Typography Strategy

EstateOS has two distinct contexts with different typography needs:

| Context | Purpose | Font Strategy |
|---------|---------|---------------|
| **Dashboard** (App) | Functional UI — forms, tables, navigation | IBM Plex Sans Arabic + Inter |
| **Public Website** | Marketing — hero sections, property pages | Cinzel (headings) + IBM Plex Sans Arabic + Inter |

**Rule:** Dashboard fonts prioritize **readability and efficiency**. Public website adds **luxury feel** through Cinzel headings only. Body text always uses the readable fonts.

---

## 1. Font Families

### Arabic (Primary — Dashboard + Public Body)

```css
--font-arabic: 'IBM Plex Sans Arabic', sans-serif;
```

- **Source:** Google Fonts (free, open source)
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Language:** Arabic (ar), supports Arabic numerals
- **License:** SIL Open Font License
- **Usage:** Dashboard UI, Public Website body text, forms, tables, navigation

### English (Secondary — Dashboard + Public Body)

```css
--font-english: 'Inter', sans-serif;
```

- **Source:** Google Fonts (free, open source)
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **License:** SIL Open Font License
- **Usage:** Dashboard UI, Public Website body text, labels, metadata

### Display (Public Website Headings Only)

```css
--font-display: 'Cinzel', serif;
```

- **Source:** Google Fonts (free, open source)
- **Weights:** 400 (Regular), 500, 600, 700 (Bold)
- **License:** SIL Open Font License
- **Usage:** Public Website hero headings, agency name, section titles
- **Restriction:** NEVER use in Dashboard, forms, tables, or body text

### Monospace (Code/Numbers)

```css
--font-mono: 'JetBrains Mono', monospace;
```

- **Usage:** Price displays, statistics, code snippets
- **Numbers:** Tabular alignment for better readability

---

## 2. Font Loading Strategy

```tsx
// In layout.tsx or _document.tsx
import { IBM_Plex_Sans_Arabic, Inter, Cinzel } from 'next/font/google';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Apply to body:
// className={`${ibmPlexArabic.variable} ${inter.variable} ${cinzel.variable}`}
```

### Font Loading Priority

```
1. Load IBM Plex Sans Arabic + Inter immediately (critical)
2. Load Cinzel on demand (only for public website)
3. Use font-display: swap to prevent FOIT
4. Preload Cinzel only on public pages (not dashboard)
```

---

## 3. Type Scale

### Headings

| Name | Font Size | Line Height | Weight | Font | Tailwind |
|------|-----------|-------------|--------|------|----------|
| H1 | 32px | 40px (1.25) | SemiBold (600) | IBM Plex Sans Arabic | `text-3xl font-semibold` |
| H2 | 24px | 32px (1.33) | SemiBold (600) | IBM Plex Sans Arabic | `text-2xl font-semibold` |
| H3 | 20px | 28px (1.40) | SemiBold (600) | IBM Plex Sans Arabic | `text-xl font-semibold` |
| H4 | 16px | 24px (1.50) | SemiBold (600) | IBM Plex Sans Arabic | `text-base font-semibold` |

### Body

| Name | Font Size | Line Height | Weight | Font | Tailwind |
|------|-----------|-------------|--------|------|----------|
| Body Large | 16px | 24px (1.50) | Regular (400) | IBM Plex Sans Arabic | `text-base font-normal` |
| Body Default | 14px | 20px (1.43) | Regular (400) | IBM Plex Sans Arabic | `text-sm font-normal` |
| Body Small | 12px | 16px (1.33) | Regular (400) | IBM Plex Sans Arabic | `text-xs font-normal` |

### Labels

| Name | Font Size | Line Height | Weight | Font | Tailwind |
|------|-----------|-------------|--------|------|----------|
| Label Large | 14px | 20px (1.43) | Medium (500) | IBM Plex Sans Arabic | `text-sm font-medium` |
| Label Default | 13px | 18px (1.38) | Medium (500) | IBM Plex Sans Arabic | `text-[13px] font-medium` |
| Label Small | 12px | 16px (1.33) | Medium (500) | IBM Plex Sans Arabic | `text-xs font-medium` |

### Data (Numbers/Prices)

| Name | Font Size | Line Height | Weight | Font | Tailwind |
|------|-----------|-------------|--------|------|----------|
| Price Large | 24px | 32px (1.33) | SemiBold (600) | IBM Plex Sans Arabic | `text-2xl font-semibold tabular-nums` |
| Price Default | 16px | 24px (1.50) | SemiBold (600) | IBM Plex Sans Arabic | `text-base font-semibold tabular-nums` |
| Stat Number | 32px | 40px (1.25) | Bold (700) | IBM Plex Sans Arabic | `text-3xl font-bold tabular-nums` |

---

## 4. Typography Rules

### 4.1 Font Usage Rules

```
Dashboard (App):
  ✅ IBM Plex Sans Arabic — all Arabic text
  ✅ Inter — all English text, labels, navigation
  ❌ Cinzel — NEVER in dashboard

Public Website:
  ✅ Cinzel — hero headings, agency name, section titles ONLY
  ✅ IBM Plex Sans Arabic — Arabic body text, descriptions
  ✅ Inter — English body text, labels, metadata
  ❌ Cinzel — NEVER for body text, forms, or small text
```

### 4.2 Arabic Text Rules

```tsx
{/* CORRECT */}
<p className="font-arabic text-right leading-relaxed">
  وصف العقار الرئيسي
</p>

{/* CORRECT — Numbers are always LTR */}
<span className="tabular-nums">15,000,000 دج</span>

{/* WRONG — Mixing font families */}
<p className="font-english">وصف بالعربية</p>
```

### 4.2 Number Formatting

```tsx
// Prices: Always use Arabic locale with English numbers
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ar-DZ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' دج';
};

// Result: 15,000,000 دج (NOT ١٥٬٠٠٠٬٠٠٠ دج)
```

### 4.3 Text Truncation

```tsx
{/* Single line truncation */}
<p className="truncate max-w-[200px]">
  عنوان طويل للعقار يجب قصّه
</p>

{/* Multi-line truncation */}
<p className="line-clamp-2">
  وصف طويل للعقار يمكن أن يكون
  في عدة سطور ويتم قصّه تلقائياً
</p>
```

### 4.4 Text Colors

```tsx
{/* Primary text — main content */}
<h1 className="text-content-primary">عنوان الصفحة</h1>

{/* Secondary text — descriptions */}
<p className="text-content-secondary">وصف تفصيلي</p>

{/* Tertiary text — metadata */}
<span className="text-content-tertiary">منذ 3 ساعات</span>

{/* Inverse text — on dark backgrounds */}
<h1 className="text-content-inverse">عنوان على خلفية داكنة</h1>
```

---

## 5. Responsive Typography

```tsx
{/* H1 — scales down on mobile */}
<h1 className="text-2xl md:text-3xl font-semibold">

{/* H2 — scales down on mobile */}
<h2 className="text-xl md:text-2xl font-semibold">

{/* Body — stays consistent */}
<p className="text-sm md:text-base">

{/* Price — stays large */}
<span className="text-xl md:text-2xl font-semibold">
```

### Mobile Typography Adjustments

```
Mobile (< 768px):
  H1: 24px (was 32px)
  H2: 20px (was 24px)
  H3: 18px (was 20px)
  Body: 14px (unchanged)
  Price: 20px (was 24px)

Tablet (768px - 1024px):
  H1: 28px
  H2: 22px
  H3: 18px

Desktop (> 1024px):
  Full scale as defined above
```

---

## 6. Font CSS Variables

```css
:root {
  /* Font families */
  --font-family-arabic: 'IBM Plex Sans Arabic', sans-serif;
  --font-family-english: 'Inter', sans-serif;
  --font-family-display: 'Cinzel', serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* Font sizes */
  --font-size-xs:   12px;
  --font-size-sm:   13px;
  --font-size-base: 14px;
  --font-size-md:   16px;
  --font-size-lg:   20px;
  --font-size-xl:   24px;
  --font-size-2xl:  32px;

  /* Line heights */
  --line-height-xs:   16px;
  --line-height-sm:   18px;
  --line-height-base: 20px;
  --line-height-md:   24px;
  --line-height-lg:   28px;
  --line-height-xl:   32px;
  --line-height-2xl:  40px;

  /* Font weights */
  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;

  /* Letter spacing */
  --letter-spacing-tight:  -0.025em;
  --letter-spacing-normal:  0;
  --letter-spacing-wide:    0.025em;
}
```

---

## 7. Tailwind Configuration

```tsx
// tailwind.config.ts
module.exports = {
  theme: {
    fontFamily: {
      arabic: ['var(--font-arabic)', 'sans-serif'],
      english: ['var(--font-english)', 'sans-serif'],
      display: ['var(--font-display)', 'serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['13px', { lineHeight: '18px' }],
      base: ['14px', { lineHeight: '20px' }],
      md: ['16px', { lineHeight: '24px' }],
      lg: ['20px', { lineHeight: '28px' }],
      xl: ['24px', { lineHeight: '32px' }],
      '2xl': ['32px', { lineHeight: '40px' }],
    },
  },
};
```

---

## 8. Usage Quick Reference

| Element | Size | Weight | Font | Color | Context |
|---------|------|--------|------|-------|---------|
| Hero Title (Public) | 48px | Bold | Cinzel | white | Public Website only |
| Section Title (Public) | 32px | SemiBold | Cinzel | text-content-primary | Public Website only |
| Page Title (Dashboard) | 32px | SemiBold | IBM Plex | text-content-primary | Dashboard only |
| Section Title (Dashboard) | 24px | SemiBold | IBM Plex | text-content-primary | Dashboard only |
| Card Title | 20px | SemiBold | IBM Plex | text-content-primary | Both |
| Body Text | 14px | Regular | IBM Plex | text-content-secondary | Both |
| Label | 13px | Medium | IBM Plex | text-content-primary | Both |
| Small/Helper | 12px | Regular | IBM Plex | text-content-tertiary | Both |
| Price Display | 24px | SemiBold | IBM Plex | text-content-primary | Both |
| Stat Number | 32px | Bold | IBM Plex | text-content-primary | Dashboard |
| Button Text | 14px | Medium | IBM Plex | text-white | Both |
| Link | 14px | Medium | IBM Plex | text-primary | Both |

---

## 9. Accessibility

```
- Minimum body text size: 12px (anything smaller is hard to read)
- Line height must be at least 1.4× font size
- Letter spacing: normal for Arabic, slightly wider for English
- Font contrast: WCAG AA minimum (4.5:1 ratio)
- Never use italic for Arabic text (not supported well)
- Avoid all-caps for Arabic (not applicable in Arabic)
```

---

## 10. File Location

```text
src/shared/lib/theme/
├── fonts.ts           ← Font loading configuration
└── globals.css        ← Font CSS variables

Public Pages (use Cinzel):
  app/(public)/        ← Hero sections, agency names

Dashboard (no Cinzel):
  app/(dashboard)/     ← IBM Plex Sans Arabic + Inter only
  app/(super-admin)/   ← IBM Plex Sans Arabic + Inter only
```
