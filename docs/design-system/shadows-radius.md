# Shadows & Border Radius — EstateOS

> Shadows create depth. Border radius creates softness.
> Both must be consistent across the entire interface.

---

## 1. Shadow Tokens

### 1.1 Shadow Scale

```css
:root {
  /* Shadow XS — Subtle lift */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);

  /* Shadow SM — Default card shadow */
  --shadow-sm:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04);

  /* Shadow MD — Hover state / dropdown */
  --shadow-md:
    0 4px 6px rgba(0, 0, 0, 0.07),
    0 2px 4px rgba(0, 0, 0, 0.04);

  /* Shadow LG — Popover / tooltip */
  --shadow-lg:
    0 10px 15px rgba(0, 0, 0, 0.08),
    0 4px 6px rgba(0, 0, 0, 0.03);

  /* Shadow XL — Modal / dialog */
  --shadow-xl:
    0 20px 25px rgba(0, 0, 0, 0.10),
    0 8px 10px rgba(0, 0, 0, 0.04);

  /* Shadow 2XL — Hero cards */
  --shadow-2xl:
    0 25px 50px rgba(0, 0, 0, 0.15);

  /* Inner shadow — Inset elements */
  --shadow-inner:
    inset 0 2px 4px rgba(0, 0, 0, 0.05);

  /* Focus ring — Interactive elements */
  --shadow-focus:
    0 0 0 3px rgba(15, 39, 71, 0.2);

  /* Focus ring accent — Premium elements */
  --shadow-focus-accent:
    0 0 0 3px rgba(201, 162, 39, 0.2);
}
```

### 1.2 Shadow Usage Table

| Shadow | Usage | Example |
|--------|-------|---------|
| `shadow-xs` | Subtle dividers, inline elements | Tag, badge |
| `shadow-sm` | Default card state | Property card, stat card |
| `shadow-md` | Hover state, dropdowns | Card hover, dropdown menu |
| `shadow-lg` | Popovers, tooltips | Filter dropdown, tooltip |
| `shadow-xl` | Modals, dialogs | Confirm dialog, property editor |
| `shadow-2xl` | Hero elements, featured cards | Featured property on landing |
| `shadow-inner` | Input focus, inset areas | Search input, text area |
| `shadow-focus` | Focus indicator | Button focus, input focus |
| `shadow-focus-accent` | Premium focus | CTA button focus |

---

## 2. Tailwind Shadow Classes

```tsx
{/* Default card */}
<div className="shadow-sm">

{/* Card with hover */}
<div className="shadow-sm hover:shadow-md transition-shadow">

{/* Modal */}
<div className="shadow-xl">

{/* Dropdown */}
<div className="shadow-lg">

{/* Focus ring on button */}
<button className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-2">

{/* Focus ring on input */}
<input className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-0">
```

---

## 3. Shadow Transitions

```tsx
{/* Smooth shadow transition on hover */}
<div className="shadow-sm hover:shadow-md transition-shadow duration-200">

{/* No transition (instant) for modals */}
<div className="shadow-xl"> {/* No transition needed */}

{/* Fast transition for small elements */}
<button className="transition-shadow duration-100">
```

---

## 4. Border Radius Tokens

### 4.1 Radius Scale

```css
:root {
  /* Radius None — Sharp corners */
  --radius-none: 0px;

  /* Radius SM — Small elements (inputs, badges) */
  --radius-sm: 6px;

  /* Radius MD — Medium elements (cards, buttons) */
  --radius-md: 8px;

  /* Radius LG — Large elements (modals, panels) */
  --radius-lg: 12px;

  /* Radius XL — Extra large (hero sections) */
  --radius-xl: 16px;

  /* Radius 2XL — Very large */
  --radius-2xl: 20px;

  /* Radius 3XL — Image containers */
  --radius-3xl: 24px;

  /* Radius Full — Circular / pill */
  --radius-full: 9999px;
}
```

### 4.2 Radius Usage Table

| Radius | Tailwind | Usage |
|--------|----------|-------|
| `radius-sm` (6px) | `rounded-md` | Inputs, small buttons, badges |
| `radius-md` (8px) | `rounded-lg` | Default buttons, cards |
| `radius-lg` (12px) | `rounded-xl` | Modals, panels, large cards |
| `radius-xl` (16px) | `rounded-2xl` | Hero sections, special cards |
| `radius-2xl` (20px) | `rounded-[20px]` | Feature cards |
| `radius-3xl` (24px) | `rounded-3xl` | Image containers, avatars |
| `radius-full` (9999px) | `rounded-full` | Avatars, pills, circular buttons |

---

## 5. Component Radius Mapping

### Buttons

```tsx
{/* All buttons use radius-md (8px) */}
<button className="rounded-lg"> {/* Default */}

{/* Icon buttons use radius-full */}
<button className="rounded-full"> {/* Icon only */}

{/* Pill buttons (rare) */}
<button className="rounded-full px-6"> {/* CTA */}
```

### Inputs

```tsx
{/* All inputs use radius-md (8px) */}
<input className="rounded-lg" />
<select className="rounded-lg" />
<textarea className="rounded-lg" />

{/* Search input with icon */}
<div className="rounded-lg"> {/* Wrapper */}
  <input className="rounded-l-none" /> {/* Input */}
</div>
```

### Cards

```tsx
{/* Default cards use radius-lg (12px) */}
<div className="rounded-xl">

{/* Property cards with images */}
<div className="rounded-xl overflow-hidden">
  <img className="rounded-t-xl" /> {/* Top image */}
  <div className="p-6">Content</div>
</div>
```

### Modals / Dialogs

```tsx
{/* Modals use radius-xl (16px) */}
<div className="rounded-2xl"> {/* Modal content */}

{/* Modal overlay */}
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
```

### Avatars

```tsx
{/* User avatar — circular */}
<div className="rounded-full w-10 h-10">

{/* Agency logo — rounded or circular */}
<div className="rounded-xl w-16 h-16"> {/* Square with radius */}
<div className="rounded-full w-16 h-16"> {/* Circular */}
```

### Badges

```tsx
{/* Badge uses radius-full (pill shape) */}
<span className="rounded-full px-2.5 py-0.5">

{/* Status dot — circular */}
<span className="rounded-full w-2 h-2">
```

---

## 6. Consistent Radius Rules

### Rule 1: Same Component Type = Same Radius

```
All buttons → radius-md (8px)
All inputs → radius-md (8px)
All cards → radius-lg (12px)
All modals → radius-xl (16px)
All avatars → radius-full (9999px)
```

### Rule 2: Nested Elements Respect Parent Radius

```tsx
{/* CORRECT — Nested elements clip to parent */}
<div className="rounded-xl overflow-hidden">
  <img className="rounded-t-xl" />
  <div className="p-6">Content</div>
</div>

{/* WRONG — Nested elements overflow parent */}
<div className="rounded-xl">
  <img className="rounded-t-2xl" /> {/* Different radius! */}
  <div className="p-6">Content</div>
</div>
```

### Rule 3: Mixed Radius = Explicit Justification

```tsx
{/* ACCEPTABLE — Only when there's a reason */}
<div className="rounded-xl">
  <div className="rounded-t-xl">Header</div> {/* Same as parent */}
  <div className="rounded-b-xl">Footer</div> {/* Same as parent */}
</div>
```

---

## 7. Radius Anti-Patterns

```tsx
{/* ❌ WRONG — Inconsistent radius */}
<div className="rounded-md">Card 1</div>
<div className="rounded-lg">Card 2</div>
<div className="rounded-xl">Card 3</div>
{/* Same component, different radius — no justification */}

{/* ❌ WRONG — Arbitrary radius */}
<div className="rounded-[13px">Random</div>

{/* ✅ CORRECT — Consistent radius */}
<div className="rounded-xl">Card 1</div>
<div className="rounded-xl">Card 2</div>
<div className="rounded-xl">Card 3</div>
```

---

## 8. Shadow + Radius Combination

### Standard Card

```tsx
<div className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
  <div className="p-6">
    Content
  </div>
</div>
```

### Modal

```tsx
<div className="rounded-2xl shadow-xl">
  <div className="p-6">
    Content
  </div>
</div>
```

### Dropdown

```tsx
<div className="rounded-xl shadow-lg">
  <div className="py-2">
    Menu items
  </div>
</div>
```

### Property Card (with image)

```tsx
<div className="rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-shadow">
  <img className="w-full h-40 object-cover" />
  <div className="p-4">
    Content
  </div>
</div>
```

---

## 9. Focus Ring Styles

```tsx
{/* Standard focus ring — primary color */}
<button className="focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-lg">

{/* Accent focus ring — premium elements */}
<button className="focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 rounded-lg">

{/* Error focus ring — form validation */}
<input className="focus:outline-none focus:ring-2 focus:ring-error/20 focus:ring-offset-0 rounded-lg border-error">

{/* No focus ring — decorative elements */}
<div className="focus:outline-none"> {/* Not interactive */}
```

### Focus Ring Values

```css
:root {
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
  --focus-ring-color-primary: rgba(15, 39, 71, 0.2);
  --focus-ring-color-accent: rgba(201, 162, 39, 0.2);
  --focus-ring-color-error: rgba(220, 38, 38, 0.2);
}
```

---

## 10. Quick Reference

| Element | Shadow | Radius | Focus Ring |
|---------|--------|--------|------------|
| Card (default) | shadow-sm | rounded-xl | — |
| Card (hover) | shadow-md | rounded-xl | — |
| Button | — | rounded-lg | focus:ring-primary/20 |
| Button (icon) | — | rounded-full | focus:ring-primary/20 |
| Input | shadow-inner | rounded-lg | focus:ring-primary/20 |
| Modal | shadow-xl | rounded-2xl | — |
| Dropdown | shadow-lg | rounded-xl | — |
| Tooltip | shadow-lg | rounded-md | — |
| Badge | — | rounded-full | — |
| Avatar | — | rounded-full | — |
| Property Card | shadow-sm → shadow-md | rounded-xl | — |
| Featured Card | shadow-sm → shadow-2xl | rounded-2xl | — |

---

## 11. CSS Custom Properties

```css
/* tailwind.config.ts extension */
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'inner': 'var(--shadow-inner)',
        'focus': 'var(--shadow-focus)',
        'focus-accent': 'var(--shadow-focus-accent)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
};
```
