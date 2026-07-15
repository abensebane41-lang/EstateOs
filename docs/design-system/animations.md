# Animations — EstateOS

> Animations must be purposeful, not decorative.
> Every animation should communicate something or improve UX.
> Restraint is key — EstateOS is premium, not playful.

---

## 1. Animation Philosophy

```
✅ DO:
  - Animate to provide feedback
  - Animate to guide attention
  - Animate to show state changes
  - Keep animations fast (200-300ms)
  - Use easing that feels natural

❌ DON'T:
  - Animate for decoration
  - Use bounce/spring animations (not premium)
  - Make users wait for animations
  - Animate everything at once
  - Use slow animations (>500ms)
```

---

## 2. Timing

### Duration Scale

```css
:root {
  --duration-fast:    100ms;  /* Micro interactions */
  --duration-normal:  200ms;  /* Standard transitions */
  --duration-slow:    300ms;  /* Page transitions */
  --duration-slower:  500ms;  /* Complex animations (rare) */
}
```

### Tailwind Mapping

```tsx
{/* Fast — micro interactions */}
<div className="transition-all duration-100">

{/* Normal — standard transitions (default) */}
<div className="transition-all duration-200">

{/* Slow — page transitions */}
<div className="transition-all duration-300">

{/* Slower — complex animations (rare) */}
<div className="transition-all duration-500">
```

### When to Use Each Duration

| Duration | Usage |
|----------|-------|
| 100ms | Button press, icon rotation, color change |
| 200ms | Hover effects, dropdown open, tooltip show |
| 300ms | Modal open/close, sidebar toggle, page fade |
| 500ms | Success animation, progress bar (rare) |

---

## 3. Easing

```css
:root {
  --ease-default:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:          cubic-bezier(0.4, 0, 1, 1);
  --ease-out:         cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce:      cubic-bezier(0.34, 1.56, 0.64, 1); /* Don't use */
}
```

### Usage

```
ease-out:     Elements entering the screen (modals, dropdowns)
ease-in:      Elements leaving the screen
ease-in-out:  Elements moving within the screen
ease-default: Everything else
```

---

## 4. Animation Types

### 4.1 Hover Effects

```tsx
{/* Shadow increase */}
<div className="shadow-sm hover:shadow-md transition-shadow duration-200">

{/* Scale (subtle) */}
<button className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">

{/* Background change */}
<button className="hover:bg-gray-50 transition-colors duration-200">

{/* Border color */}
<div className="hover:border-gray-300 transition-colors duration-200">

{/* Opacity */}
<div className="hover:opacity-80 transition-opacity duration-200">
```

### 4.2 Focus Effects

```tsx
{/* Focus ring */}
<button className="focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
  transition-shadow duration-200">

{/* Focus background */}
<button className="focus:bg-gray-100 transition-colors duration-200">
```

### 4.3 Active Effects

```tsx
{/* Button press */}
<button className="active:scale-[0.98] transition-transform duration-100">

{/* Active state change */}
<button className="active:bg-primary-dark transition-colors duration-100">
```

---

## 5. Component Animations

### 5.1 Modal / Dialog

```tsx
{/* Entry animation */}
<div className="animate-in fade-in zoom-in-95 duration-200">

{/* Exit animation */}
<div className="animate-out fade-out zoom-out-95 duration-150">

{/* Overlay */}
<div className="animate-in fade-in duration-200">
```

### 5.2 Dropdown

```tsx
{/* Entry */}
<div className="animate-in fade-in slide-in-from-top-2 duration-200">

{/* Exit */}
<div className="animate-out fade-out slide-out-to-top-2 duration-150">
```

### 5.3 Toast

```tsx
{/* Entry — slide from right (desktop) */}
<div className="animate-in slide-in-from-right duration-300">

{/* Entry — slide from top (mobile) */}
<div className="animate-in slide-in-from-top duration-300">

{/* Exit */}
<div className="animate-out slide-out-to-right duration-200">
```

### 5.4 Sidebar

```tsx
{/* Desktop sidebar — instant */}
<aside className="transition-[width] duration-200">

{/* Mobile sidebar — slide */}
<aside className="transition-transform duration-300
  data-[open]:translate-x-0 data-[closed]:translate-x-full">
```

### 5.5 Page Transitions

```tsx
{/* Page content fade-in */}
<main className="animate-in fade-in duration-300">

{/* Staggered children */}
<div className="space-y-4">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card />
    </div>
  ))}
</div>
```

---

## 6. Loading Animations

### 6.1 Skeleton Loading

```tsx
{/* Pulse animation */}
<div className="bg-gray-200 rounded animate-pulse" />

{/* Shimmer effect (premium) */}
<div className="relative overflow-hidden bg-gray-200 rounded">
  <div className="absolute inset-0 -translate-x-full
    bg-gradient-to-r from-transparent via-white/50 to-transparent
    animate-[shimmer_1.5s_infinite]" />
</div>
```

### 6.2 Spinner

```tsx
{/* Loading spinner */}
<Loader2 className="w-5 h-5 animate-spin text-primary" />

{/* Button loading */}
<button disabled className="inline-flex items-center gap-2">
  <Loader2 className="w-4 h-4 animate-spin" />
  <span>Saving...</span>
</button>
```

### 6.3 Progress Bar

```tsx
{/* Linear progress */}
<div className="h-1 bg-gray-200 rounded-full overflow-hidden">
  <div className="h-full bg-primary rounded-full
    transition-[width] duration-500 ease-out"
    style={{ width: `${progress}%` }} />
</div>

{/* Circular progress */}
<svg className="animate-spin w-5 h-5 text-primary">
  <circle cx="12" cy="12" r="10" stroke="currentColor"
    strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
</svg>
```

---

## 7. Success Animations

### 7.1 Check Mark

```tsx
{/* Success check animation */}
<div className="w-12 h-12 rounded-full bg-success
  flex items-center justify-center
  animate-in zoom-in duration-300">
  <Check className="w-6 h-6 text-white" />
</div>
```

### 7.2 Onboarding Complete

```tsx
{/* Confetti-like effect (subtle) */}
<div className="relative">
  <div className="w-16 h-16 rounded-full bg-success
    flex items-center justify-center
    animate-in zoom-in duration-500">
    <Check className="w-8 h-8 text-white" />
  </div>
  {/* Decorative circles */}
  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full
    bg-accent animate-in zoom-in duration-500 delay-100" />
  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full
    bg-primary animate-in zoom-in duration-500 delay-200" />
</div>
```

### 7.3 Property Saved

```tsx
{/* Brief success indicator */}
<div className="flex items-center gap-2 text-success
  animate-in fade-in duration-200">
  <CheckCircle2 className="w-4 h-4" />
  <span className="text-sm font-medium">Saved!</span>
</div>
```

---

## 8. Scroll Animations

### 8.1 Scroll to Top

```tsx
{/* Scroll to top button */}
<button className="fixed bottom-8 right-8 z-50
  w-10 h-10 rounded-full bg-primary text-white
  shadow-lg
  opacity-0 translate-y-4
  data-[visible]:opacity-100 data-[visible]:translate-y-0
  transition-all duration-200">
  <ArrowUp className="w-5 h-5" />
</button>
```

### 8.2 Infinite Scroll

```tsx
{/* Trigger point for infinite scroll */}
<div ref={sentinelRef} className="h-10" />

{/* Loading indicator */}
<div className="flex justify-center py-4">
  <Loader2 className="w-6 h-6 animate-spin text-primary" />
</div>
```

---

## 9. Form Animations

### 9.1 Error Shake

```tsx
{/* Input error shake */}
<input className="animate-[shake_0.3s_ease-in-out]" />

{/* CSS for shake */}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

### 9.2 Success Check

```tsx
{/* Inline success indicator */}
<div className="flex items-center gap-1.5 text-success
  animate-in fade-in duration-200">
  <CheckCircle2 className="w-4 h-4" />
  <span className="text-xs">Valid</span>
</div>
```

### 9.3 Field Expansion

```tsx
{/* Textarea auto-expand */}
<textarea className="min-h-[100px] transition-[height] duration-200
  resize-none" />
```

---

## 10. Micro-Interactions

### 10.1 Like/Favorite Toggle

```tsx
{/* Heart toggle */}
<button className="transition-transform duration-200
  hover:scale-110 active:scale-90">
  <Heart className={cn(
    "w-5 h-5 transition-colors duration-200",
    isFavorite ? "fill-error text-error" : "text-gray-400"
  )} />
</button>
```

### 10.2 Copy to Clipboard

```tsx
{/* Copy button feedback */}
<button onClick={copyToClipboard}
  className="transition-colors duration-200">
  {copied ? (
    <Check className="w-4 h-4 text-success" />
  ) : (
    <Copy className="w-4 h-4 text-gray-400" />
  )}
</button>
```

### 10.3 Toggle Switch

```tsx
{/* Toggle animation */}
<div className={cn(
  "w-10 h-6 rounded-full transition-colors duration-200",
  isEnabled ? "bg-primary" : "bg-gray-300"
)}>
  <div className={cn(
    "w-4 h-4 rounded-full bg-white shadow-sm
    transform transition-transform duration-200",
    isEnabled ? "translate-x-5" : "translate-x-1"
  )} />
</div>
```

---

## 11. Page Transition

### 11.1 Route Change

```tsx
// In layout.tsx or page wrapper
<main className="animate-in fade-in duration-300">
  {children}
</main>
```

### 11.2 Tab Switch

```tsx
{/* Tab content transition */}
<div className="animate-in fade-in duration-200">
  {activeTab === 'properties' && <PropertiesTab />}
  {activeTab === 'leads' && <LeadsTab />}
</div>
```

---

## 12. Animation Tokens

```css
:root {
  /* Durations */
  --animate-duration-fast:   100ms;
  --animate-duration-normal: 200ms;
  --animate-duration-slow:   300ms;

  /* Easings */
  --animate-ease:    cubic-bezier(0.4, 0, 0.2, 1);
  --animate-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --animate-ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

---

## 13. Tailwind Config

```tsx
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in-from-right': 'slideInFromRight 300ms ease-out',
        'slide-in-from-top': 'slideInFromTop 300ms ease-out',
        'zoom-in': 'zoomIn 200ms ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'shake': 'shake 300ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
};
```

---

## 14. Reduced Motion

```tsx
// Respect user's motion preference
<div className="motion-safe:animate-in motion-safe:fade-in
  motion-reduce:opacity-100">

// CSS approach
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 15. Animation Checklist

```
For every animation, verify:

  ☐ Purpose: Does this animation serve a UX purpose?
  ☐ Duration: Is it fast enough (≤300ms)?
  ☐ Easing: Does it feel natural?
  ☐ Accessibility: Does it respect prefers-reduced-motion?
  ☐ Performance: Does it use transform/opacity (GPU-accelerated)?
  ☐ Consistency: Does it match other animations in the app?
  ☐ Mobile: Does it work well on touch devices?
```

---

## 16. Anti-Patterns

```tsx
{/* ❌ WRONG — Slow animation */}
<div className="transition-all duration-1000">

{/* ❌ WRONG — Animating layout properties */}
<div className="transition-[width,height] duration-300">
{/* Use transform instead */}

{/* ❌ WRONG — No easing */}
<div className="transition-all duration-200 ease-linear">

{/* ❌ WRONG — Bounce effect (not premium) */}
<div className="animate-bounce">

{/* ❌ WRONG — Animating everything */}
<div className="transition-all">
{/* Be specific about what transitions */}

{/* ✅ CORRECT — Purposeful, fast, GPU-accelerated */}
<div className="transition-transform duration-200 ease-out
  hover:scale-[1.02] active:scale-[0.98]">
```

---

## 17. Summary

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Hover shadow | 200ms | ease | Cards, buttons |
| Button press | 100ms | ease | Buttons |
| Modal open | 200ms | ease-out | Dialogs |
| Modal close | 150ms | ease-in | Dialogs |
| Dropdown open | 200ms | ease-out | Menus |
| Toast enter | 300ms | ease-out | Notifications |
| Toast exit | 200ms | ease-in | Notifications |
| Page fade | 300ms | ease | Route changes |
| Skeleton pulse | 1.5s | ease-in-out | Loading states |
| Spinner | 1s | linear | Loading indicators |
| Success check | 300ms | ease-out | Confirmations |
| Error shake | 300ms | ease-in-out | Form validation |
