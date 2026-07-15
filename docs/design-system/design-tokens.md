# Design Tokens — EstateOS

> Single source of truth for all visual values.
> Every component must use these tokens. No hardcoded values allowed.

---

## 0. Design Style

**Approved Style: Exaggerated Minimalism**

| Property | Value | Source |
|----------|-------|--------|
| Style | Exaggerated Minimalism | UI/UX Pro Max recommendation |
| Primary Color | #0F2747 (Navy Blue) | Product decision |
| Accent Color | #C9A227 (Gold) | Product decision |
| Dashboard Fonts | IBM Plex Sans Arabic + Inter | Typography decision |
| Public Headings | Cinzel (display only) | Typography decision |
| Public Body | IBM Plex Sans Arabic + Inter | Typography decision |

**Style Keywords:** Bold minimalism, oversized typography, high contrast, negative space, luxury feel

---

## 1. Color Tokens

### 1.1 Primary Colors

```css
:root {
  --color-primary:        #0F2747;  /* Navy Blue — Trust & Professionalism */
  --color-primary-light:  #2D5A8E;  /* Lighter navy — Hover states */
  --color-primary-dark:   #0A1C35;  /* Darker navy — Active states */
  --color-primary-50:     #EFF6FF;  /* Very light — Backgrounds */
  --color-primary-100:    #DBEAFE;  /* Light — Badge backgrounds */
  --color-primary-200:    #BFDBFE;  /* Borders */
  --color-primary-300:    #93C5FD;  /* Subtle highlights */
  --color-primary-400:    #60A5FA;  /* Interactive elements */
  --color-primary-500:    #3B82F6;  /* Equivalent to primary-light */
  --color-primary-600:    #2563EB;  /* Links */
  --color-primary-700:    #1D4ED8;  /* Hover links */
  --color-primary-800:    #1E40AF;  /* Active links */
  --color-primary-900:    #1E3A8A;  /* Darkest */
}
```

### 1.2 Accent Colors (Gold)

```css
:root {
  --color-accent:         #C9A227;  /* Gold — Premium accents only */
  --color-accent-light:   #D4B545;  /* Hover */
  --color-accent-dark:    #A68520;  /* Active */
  --color-accent-50:      #FDF9E8;  /* Background */
  --color-accent-100:     #FAF0C9;  /* Light background */
  --color-accent-200:     #F5E6A3;  /* Border */
  --color-accent-300:     #EFD87D;  /* Highlight */
  --color-accent-400:     #E5C654;  /* Interactive */
  --color-accent-500:     #C9A227;  /* Main */
  --color-accent-600:     #A68520;  /* Darker */
  --color-accent-700:     #8B6E1A;  /* Darkest */
}
```

### 1.3 Neutral Colors

```css
:root {
  --color-background:     #F8FAFC;  /* Page background */
  --color-card:           #FFFFFF;  /* Card background */
  --color-border:         #E5E7EB;  /* Default border */
  --color-border-light:   #F3F4F6;  /* Subtle borders */
  --color-border-focus:   #93C5FD;  /* Focus ring */

  --color-text-primary:   #111827;  /* Main text */
  --color-text-secondary: #64748B;  /* Muted text */
  --color-text-tertiary:  #94A3B8;  /* Very muted */
  --color-text-inverse:   #FFFFFF;  /* Text on dark bg */

  --color-gray-50:        #F9FAFB;
  --color-gray-100:       #F3F4F6;
  --color-gray-200:       #E5E7EB;
  --color-gray-300:       #D1D5DB;
  --color-gray-400:       #9CA3AF;
  --color-gray-500:       #6B7280;
  --color-gray-600:       #4B5563;
  --color-gray-700:       #374151;
  --color-gray-800:       #1F2937;
  --color-gray-900:       #111827;
}
```

### 1.4 Semantic Colors

```css
:root {
  /* Success */
  --color-success:        #059669;
  --color-success-light:  #D1FAE5;
  --color-success-dark:   #047857;

  /* Warning */
  --color-warning:        #D97706;
  --color-warning-light:  #FEF3C7;
  --color-warning-dark:   #B45309;

  /* Error */
  --color-error:          #DC2626;
  --color-error-light:    #FEE2E2;
  --color-error-dark:     #B91C1C;

  /* Info */
  --color-info:           #2563EB;
  --color-info-light:     #DBEAFE;
  --color-info-dark:      #1D4ED8;
}
```

### 1.5 Dark Mode Tokens (Reference Only — Not Implemented in MVP)

```css
/* Future reference only. Do not use in MVP. */
.dark {
  --dm-background:        #0F172A;
  --dm-card:              #1E293B;
  --dm-border:            #334155;
  --dm-text-primary:      #F1F5F9;
  --dm-text-secondary:    #94A3B8;
  --dm-text-tertiary:     #64748B;
}
```

---

## 2. Color Usage Rules

### Primary Color

```
✅ USE FOR:
  - Sidebar background
  - Primary buttons
  - Links
  - Active navigation items
  - Key headings

❌ DON'T USE FOR:
  - Large background areas
  - Table backgrounds
  - Card backgrounds (use white)
```

### Accent Color (Gold)

```
✅ USE FOR:
  - Premium badges
  - "New" / "Featured" indicators
  - Star ratings
  - Single CTA per page (optional)
  - Luxury highlights

❌ DON'T USE FOR:
  - Backgrounds
  - Text (except on very rare badges)
  - Borders
  - More than one element per view
```

### Semantic Colors

```
✅ USE FOR:
  - Status badges (Active/Expired/Suspended)
  - Form validation messages
  - Success/error notifications
  - Progress indicators

❌ DON'T USE FOR:
  - Decorative purposes
  - General text color
  - Borders (except status-specific)
```

---

## 3. CSS Custom Properties

```css
/* tailwind.config.ts extension */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
        },
        surface: {
          bg: 'var(--color-background)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          'border-light': 'var(--color-border-light)',
          'border-focus': 'var(--color-border-focus)',
        },
        content: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          dark: 'var(--color-error-dark)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          dark: 'var(--color-info-dark)',
        },
      },
    },
  },
};
```

---

## 4. Tailwind Usage Examples

```tsx
{/* CORRECT — Using tokens */}
<div className="bg-primary text-white">
<div className="bg-surface-card border border-surface-border">
<p className="text-content-secondary">
<span className="text-success">Active</span>
<span className="text-error">Expired</span>

{/* WRONG — Hardcoded values */}
<div className="bg-[#0F2747]">
<div className="border-[#E5E7EB]">
<p className="text-[#64748B]">
```

---

## 5. Quick Reference Table

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| Primary | #0F2747 | `bg-primary` | Sidebar, buttons, links |
| Primary Light | #2D5A8E | `bg-primary-light` | Hover states |
| Accent | #C9A227 | `bg-accent` | Premium badges only |
| Background | #F8FAFC | `bg-surface-bg` | Page background |
| Card | #FFFFFF | `bg-surface-card` | Card background |
| Border | #E5E7EB | `border-surface-border` | Default borders |
| Text Primary | #111827 | `text-content-primary` | Main text |
| Text Secondary | #64748B | `text-content-secondary` | Muted text |
| Success | #059669 | `text-success` | Active status |
| Warning | #D97706 | `text-warning` | Expiring status |
| Error | #DC2626 | `text-error` | Expired, delete |
| Info | #2563EB | `text-info` | Informational |

---

## 6. File Location

```text
src/shared/lib/theme/
├── tokens.ts          ← TypeScript constants
└── globals.css        ← CSS custom properties
```

---

## 7. Rules

1. **Never use hardcoded color values** in components
2. **Always use Tailwind classes** that reference these tokens
3. **For new colors**, add to this document first, then implement
4. **Gold/Accent** requires team approval before usage
5. **Dark mode tokens** are reference only — do not implement
