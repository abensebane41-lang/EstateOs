# Responsive Guidelines — EstateOS

> Mobile-first design approach.
> Every component must work across all breakpoints.

---

## 1. Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px     /* Small devices (landscape phones) */
md: 768px     /* Medium devices (tablets) */
lg: 1024px    /* Large devices (desktops) */
xl: 1280px    /* Extra large devices (large desktops) */
2xl: 1536px   /* Extra extra large */
```

### EstateOS Breakpoint Usage

| Breakpoint | Width | Layout | Sidebar | Grid |
|------------|-------|--------|---------|------|
| Default | 0-767px | Mobile | Hidden (hamburger) | 1 column |
| md | 768-1023px | Tablet | Collapsed (72px) | 2 columns |
| lg | 1024px+ | Desktop | Full (260px) | 3 columns |
| xl | 1280px+ | Large Desktop | Full (260px) | 4 columns |

---

## 2. Mobile-First Strategy

### Approach

```tsx
{/* Base: Mobile styles (default) */}
{/* Override: Tablet and desktop with md:/lg: prefixes */}

{/* CORRECT — Mobile first */}
<div className="p-4 md:p-6 lg:p-8">

{/* WRONG — Desktop first (don't do this) */}
<div className="p-8 max-lg:p-6 max-md:p-4">
```

### Why Mobile-First?

```
1. Performance: Mobile devices load less CSS
2. Progressive Enhancement: Base experience works everywhere
3. Consistency: Overrides are explicit, not implicit
4. Maintainability: Easier to reason about styles
```

---

## 3. Layout Responsiveness

### 3.1 Sidebar Behavior

```tsx
{/* Mobile: Hidden by default, hamburger toggle */}
<aside className="hidden md:block md:w-[72px] lg:w-[260px]">

{/* Mobile menu toggle */}
<button className="md:hidden">
  <Menu className="w-5 h-5" />
</button>

{/* Mobile overlay */}
<div className="fixed inset-0 z-40 bg-black/50 md:hidden"
  onClick={closeSidebar} />

{/* Mobile sidebar (slides from right in RTL) */}
<aside className="fixed right-0 top-0 z-50 h-full w-[260px]
  bg-white transform transition-transform
  md:hidden
  translate-x-0 data-[closed]:translate-x-full">
```

### Sidebar States

```
Mobile (< 768px):
  - Hidden by default
  - Toggle with hamburger button
  - Full overlay with backdrop
  - Slides from right (RTL)

Tablet (768px - 1024px):
  - Always visible
  - Collapsed: 72px width
  - Icons only, no text labels
  - Tooltip on hover for labels

Desktop (> 1024px):
  - Always visible
  - Full: 260px width
  - Icons + text labels
  - User info at bottom
```

### 3.2 Content Area

```tsx
{/* Content wrapper */}
<main className="flex-1
  p-4 md:p-6 lg:p-8
  max-w-7xl mx-auto">

{/* With sidebar offset */}
<main className="mr-0 md:mr-[72px] lg:mr-[260px]
  p-4 md:p-6 lg:p-8">
```

### 3.3 Topbar

```tsx
{/* Topbar */}
<header className="h-16 sticky top-0 z-30
  bg-white border-b border-gray-200
  flex items-center justify-between
  px-4 md:px-6 lg:px-8">

{/* Mobile: hamburger + title only */}
<div className="flex items-center gap-3">
  <button className="md:hidden">
    <Menu className="w-5 h-5" />
  </button>
  <h1 className="text-lg font-semibold">Page Title</h1>
</div>

{/* Desktop: search + notifications + avatar */}
<div className="hidden md:flex items-center gap-4">
  <SearchInput />
  <Button variant="ghost" size="icon">
    <Bell className="w-5 h-5" />
  </Button>
  <Avatar />
</div>
</header>
```

---

## 4. Grid Responsiveness

### 4.1 Property Cards Grid

```tsx
{/* Property grid */}
<div className="grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4 md:gap-6">
  {properties.map(property => (
    <PropertyCard key={property.id} property={property} />
  ))}
</div>
```

### Grid Patterns

```tsx
{/* 1 → 2 → 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

{/* 1 → 2 → 4 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

{/* 1 → 3 columns */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

{/* Full width → 2 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
```

---

## 5. Component Responsiveness

### 5.1 Buttons

```tsx
{/* Full width on mobile, auto on desktop */}
<button className="w-full md:w-auto">

{/* Hide text on mobile, show icon only */}
<button className="flex items-center gap-2">
  <Plus className="w-4 h-4" />
  <span className="hidden md:inline">Add Property</span>
</button>
```

### 5.2 Cards

```tsx
{/* Card padding responsive */}
<div className="p-4 md:p-6">

{/* Card height responsive */}
<div className="h-40 md:h-48 lg:h-56">

{/* Badge positioning */}
<div className="absolute top-2 right-2 md:top-3 md:right-3">
```

### 5.3 Tables

```tsx
{/* Desktop: Table */}
<div className="hidden md:block">
  <table>...</table>
</div>

{/* Mobile: Card list */}
<div className="md:hidden space-y-4">
  {items.map(item => (
    <div key={item.id} className="bg-surface-card border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{item.name}</span>
        <Badge variant={item.status}>{item.status}</Badge>
      </div>
    </div>
  ))}
</div>
```

### 5.4 Modals

```tsx
{/* Desktop: Centered modal */}
<div className="hidden md:flex fixed inset-0 items-center justify-center">
  <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
    Content
  </div>
</div>

{/* Mobile: Bottom sheet */}
<div className="md:hidden fixed inset-x-0 bottom-0 z-50">
  <div className="bg-white rounded-t-2xl shadow-xl p-6">
    Content
  </div>
</div>
```

### 5.5 Forms

```tsx
{/* Form grid responsive */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-1.5">
    <Label>First Name</Label>
    <Input />
  </div>
  <div className="space-y-1.5">
    <Label>Last Name</Label>
    <Input />
  </div>
</div>

{/* Full width on mobile */}
<Input className="w-full" />
```

---

## 6. Typography Responsiveness

### 6.1 Heading Scaling

```tsx
{/* H1 */}
<h1 className="text-2xl md:text-3xl font-semibold">

{/* H2 */}
<h2 className="text-xl md:text-2xl font-semibold">

{/* H3 */}
<h3 className="text-lg md:text-xl font-semibold">
```

### 6.2 Price Display

```tsx
{/* Price responsive */}
<p className="text-xl md:text-2xl font-semibold">
  15,000,000 دج
</p>
```

### 6.3 Text Truncation

```tsx
{/* Truncate on all screens */}
<p className="truncate">

{/* Truncate on mobile only */}
<p className="md:line-clamp-none truncate">
```

---

## 7. Spacing Responsiveness

```tsx
{/* Page padding */}
<main className="p-4 md:p-6 lg:p-8">

{/* Section spacing */}
<section className="space-y-6 md:space-y-8">

{/* Grid gaps */}
<div className="gap-4 md:gap-6">

{/* Card gaps */}
<div className="space-y-4 md:space-y-6">

{/* Inline gaps */}
<div className="gap-2 md:gap-3">
```

---

## 8. Navigation Patterns

### 8.1 Mobile Navigation

```tsx
{/* Hamburger menu */}
<header className="flex items-center justify-between">
  <button onClick={openSidebar}>
    <Menu className="w-5 h-5" />
  </button>
  <h1>Dashboard</h1>
  <div /> {/* Spacer */}
</header>

{/* Sidebar overlay */}
{isSidebarOpen && (
  <>
    <div className="fixed inset-0 z-40 bg-black/50 md:hidden"
      onClick={closeSidebar} />
    <aside className="fixed right-0 top-0 z-50 h-full w-[260px]
      bg-white md:hidden">
      <nav>...</nav>
    </aside>
  </>
)}
```

### 8.2 Tablet Navigation

```tsx
{/* Collapsed sidebar */}
<aside className="hidden md:flex md:w-[72px] flex-col items-center
  py-4 gap-4">
  <nav className="flex flex-col gap-1">
    <a className="w-10 h-10 flex items-center justify-center rounded-lg
      hover:bg-gray-100">
      <LayoutDashboard className="w-5 h-5" />
    </a>
    <a className="w-10 h-10 flex items-center justify-center rounded-lg
      bg-primary/10 text-primary">
      <Building2 className="w-5 h-5" />
    </a>
  </nav>
</aside>
```

### 8.3 Desktop Navigation

```tsx
{/* Full sidebar */}
<aside className="hidden lg:flex lg:w-[260px] flex-col
  border-l border-gray-200">
  <nav className="flex-1 p-3 space-y-1">
    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
      <LayoutDashboard className="w-5 h-5" />
      <span>Dashboard</span>
    </a>
  </nav>
</aside>
```

---

## 9. Image Responsiveness

### 9.1 Property Images

```tsx
{/* Hero image responsive */}
<img className="w-full h-48 md:h-64 lg:h-80 object-cover" />

{/* Card image responsive */}
<img className="w-full h-40 md:h-48 object-cover" />

{/* Gallery main image */}
<img className="w-full h-64 md:h-96 object-cover" />
```

### 9.2 Image Sizes

```
Mobile:  Full width, height determined by aspect ratio
Tablet:  Full width, fixed height
Desktop: Fixed width, fixed height
```

### 9.3 Responsive Images with srcset

```tsx
<img
  src="/property-1.jpg"
  srcSet="/property-1-sm.jpg 400w,
          /property-1-md.jpg 800w,
          /property-1-lg.jpg 1200w"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  className="w-full h-40 object-cover"
/>
```

---

## 10. Touch Interactions

### 10.1 Touch Targets

```
Minimum touch target: 44px × 44px

Buttons:  h-10 (40px) minimum
Icons:    w-10 h-10 (40px) for interactive
Links:    py-2 (8px padding top/bottom)
```

### 10.2 Touch Feedback

```tsx
{/* Tap feedback */}
<button className="active:scale-[0.98] transition-transform">

{/* Long press */}
<div onContextMenu={handleLongPress}>

{/* Swipe */}
<div onTouchStart={handleSwipe} onTouchEnd={handleSwipeEnd}>
```

### 10.3 Swipeable Cards

```tsx
{/* Horizontal scroll on mobile */}
<div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory
  md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
  {items.map(item => (
    <div key={item.id} className="snap-center shrink-0 w-[85vw] md:w-auto">
      <Card />
    </div>
  ))}
</div>
```

---

## 11. Responsive Utilities

### 11.1 Show/Hide

```tsx
{/* Hide on mobile */}
<div className="hidden md:block">

{/* Show only on mobile */}
<div className="block md:hidden">

{/* Hide on tablet */}
<div className="hidden lg:block">

{/* Show only on desktop */}
<div className="hidden lg:block">
```

### 11.2 Flex Direction

```tsx
{/* Column on mobile, row on desktop */}
<div className="flex flex-col md:flex-row gap-4">

{/* Row on mobile, column on desktop */}
<div className="flex flex-row md:flex-col gap-4">
```

### 11.3 Text Alignment

```tsx
{/* Center on mobile, left on desktop */}
<h1 className="text-center md:text-right">

{/* Always right for Arabic */}
<h1 className="text-right">
```

---

## 12. Responsive Patterns

### 12.1 Stacked to Side-by-Side

```tsx
{/* Mobile: Stacked */}
{/* Desktop: Side by side */}
<div className="flex flex-col md:flex-row gap-8">
  <div className="flex-1">Main content</div>
  <div className="flex-1">Sidebar content</div>
</div>
```

### 12.2 Full to Grid

```tsx
{/* Mobile: Full width cards */}
{/* Desktop: Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {cards.map(card => <Card key={card.id} />)}
</div>
```

### 12.3 Overlay to Inline

```tsx
{/* Mobile: Overlay/drawer */}
{/* Desktop: Inline */}
<div className="relative">
  <div className="lg:static lg:block">Content</div>
  <div className="fixed inset-0 lg:static lg:block">Sidebar</div>
</div>
```

---

## 13. Responsive Testing Checklist

```
Mobile (375px — iPhone SE):
  ☐ All content readable
  ☐ All buttons tappable (44px min)
  ☐ Sidebar hidden, hamburger works
  ☐ Forms usable (no horizontal scroll)
  ☐ Images scaled properly
  ☐ Text not truncated unexpectedly
  ☐ Modals as bottom sheets

Tablet (768px — iPad):
  ☐ Sidebar collapsed, icons visible
  ☐ Grid shows 2 columns
  ☐ Tables readable
  ☐ Modals centered
  ☐ Forms in 2-column grid

Desktop (1024px):
  ☐ Sidebar full with labels
  ☐ Grid shows 3 columns
  ☐ All features accessible
  ☐ Hover states working
  ☐ Focus states visible

Large Desktop (1440px):
  ☐ Content centered (max-w-7xl)
  ☐ No excessive whitespace
  ☐ All elements properly sized
```

---

## 14. Responsive Anti-Patterns

```tsx
{/* ❌ WRONG — Fixed pixel values */}
<div style={{ width: '320px' }}>

{/* ✅ CORRECT — Responsive values */}
<div className="w-full md:w-80">

{/* ❌ WRONG — Desktop-first */}
<div className="p-8 max-lg:p-6 max-md:p-4">

{/* ✅ CORRECT — Mobile-first */}
<div className="p-4 md:p-6 lg:p-8">

{/* ❌ WRONG — No responsive breakpoints */}
<div className="grid grid-cols-3">

{/* ✅ CORRECT — Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

{/* ❌ WRONG — Fixed font sizes */}
<span style={{ fontSize: '24px' }}>

{/* ✅ CORRECT — Responsive font sizes */}
<span className="text-xl md:text-2xl">
```

---

## 15. RTL Responsive Notes

```
RTL Considerations:
  - Sidebar is on the RIGHT (not left)
  - Margin/padding: mr- (not ml-)
  - Transform: translateX (mirrored)
  - Icons: directional icons mirrored

Examples:
  {/* RTL sidebar offset */}
  <main className="mr-0 md:mr-[72px] lg:mr-[260px]">

  {/* RTL slide direction */}
  <aside className="translate-x-full data-[open]:translate-x-0">

  {/* RTL chevron */}
  <ChevronRight className="rotate-180" />
```

---

## 16. Performance on Mobile

```
Optimizations:
  1. Lazy load images below the fold
  2. Use placeholder/skeleton for dynamic content
  3. Minimize JavaScript bundle size
  4. Use Next.js Image component for optimization
  5. Implement virtual scrolling for long lists
  6. Debounce search inputs (300ms)
  7. Use CSS transforms instead of JavaScript animations
```
