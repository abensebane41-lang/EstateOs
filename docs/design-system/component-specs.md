# Component Specs — EstateOS

> Every component is documented here.
> No component should be created without a spec in this document.
> This is the single source of truth for all UI components.

---

## Table of Contents

1. [Button](#1-button)
2. [Input](#2-input)
3. [Select](#3-select)
4. [Textarea](#4-textarea)
5. [Label](#5-label)
6. [Badge](#6-badge)
7. [Card](#7-card)
8. [Table](#8-table)
9. [Modal / Dialog](#9-modal--dialog)
10. [Dropdown](#10-dropdown)
11. [Tooltip](#11-tooltip)
12. [Toast](#12-toast)
13. [Confirm Dialog](#13-confirm-dialog)
14. [Empty State](#14-empty-state)
15. [Skeleton Loading](#15-skeleton-loading)
16. [Avatar](#16-avatar)
17. [Tabs](#17-tabs)
18. [Pagination](#18-pagination)
19. [Search Input](#19-search-input)
20. [Property Card](#20-property-card)
21. [Stat Card](#21-stat-card)
22. [Success Path](#22-success-path)
23. [Sidebar Navigation](#23-sidebar-navigation)
24. [Topbar](#24-topbar)
25. [Page Header](#25-page-header)

---

## 1. Button

### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | primary | white | none | Main CTA, form submit |
| Secondary | white | gray-700 | gray-200 | Secondary actions |
| Ghost | transparent | gray-600 | none | Tertiary, cancel |
| Danger | error-light | error | error | Delete, destructive |
| Accent | accent | white | none | Premium CTA (rare) |

### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| sm | 32px | px-3 py-1.5 | 13px | 14px |
| md | 40px | px-6 py-2 | 14px | 16px |
| lg | 48px | px-8 py-3 | 16px | 20px |
| icon | 40px | p-2 | — | 20px |
| icon-sm | 32px | p-1.5 | — | 16px |

### States

```
Default → Normal appearance
Hover   → Slightly darker background
Active  → Even darker, scale(0.98)
Disabled → Opacity 50%, cursor-not-allowed
Loading → Spinner replacing text, disabled
```

### Tailwind Classes

```tsx
{/* Primary */}
<button className="inline-flex items-center justify-center
  rounded-lg px-6 py-2 text-sm font-medium
  bg-primary text-white
  hover:bg-primary-light
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200">

{/* Secondary */}
<button className="inline-flex items-center justify-center
  rounded-lg px-6 py-2 text-sm font-medium
  bg-white text-gray-700 border border-gray-200
  hover:bg-gray-50
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200">

{/* Ghost */}
<button className="inline-flex items-center justify-center
  rounded-lg px-6 py-2 text-sm font-medium
  text-gray-600 bg-transparent
  hover:bg-gray-100
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200">

{/* Danger */}
<button className="inline-flex items-center justify-center
  rounded-lg px-6 py-2 text-sm font-medium
  bg-error-light text-error border border-error/20
  hover:bg-error/10
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200">
```

### Button with Icon

```tsx
{/* Icon left */}
<button className="inline-flex items-center gap-2">
  <Plus className="w-4 h-4" />
  <span>Add Property</span>
</button>

{/* Icon right */}
<button className="inline-flex items-center gap-2">
  <span>View All</span>
  <ArrowRight className="w-4 h-4" />
</button>

{/* Icon only */}
<button className="inline-flex items-center justify-center
  rounded-full p-2 text-gray-600
  hover:bg-gray-100">
  <MoreHorizontal className="w-5 h-5" />
</button>
```

### Loading State

```tsx
<button disabled className="inline-flex items-center gap-2">
  <Loader2 className="w-4 h-4 animate-spin" />
  <span>Saving...</span>
</button>
```

---

## 2. Input

### Structure

```
┌──────────────────────────────────────┐
│  Label (optional)                    │
├──────────────────────────────────────┤
│  [Icon] Input text............ [X]  │
├──────────────────────────────────────┤
│  Helper text / Error message         │
└──────────────────────────────────────┘
```

### Specifications

| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | px-3 py-2 |
| Border | 1px solid #E5E7EB |
| Border Radius | 8px (rounded-lg) |
| Font Size | 14px |
| Font Weight | Regular (400) |
| Text Color | text-content-primary |
| Placeholder Color | text-content-tertiary |
| Background | white |

### States

| State | Border | Ring | Background |
|-------|--------|------|------------|
| Default | gray-200 | none | white |
| Focus | primary | focus:ring-primary/20 | white |
| Error | error | focus:ring-error/20 | white |
| Disabled | gray-200 | none | gray-50 |
| Success | success | none | white |

### Tailwind Classes

```tsx
{/* Default */}
<input className="w-full h-10 px-3 py-2 text-sm
  bg-white border border-gray-200 rounded-lg
  text-content-primary placeholder:text-content-tertiary
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
  disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
  transition-colors duration-200" />

{/* Error state */}
<input className="w-full h-10 px-3 py-2 text-sm
  bg-white border border-error rounded-lg
  text-content-primary placeholder:text-content-tertiary
  focus:outline-none focus:ring-2 focus:ring-error/20 focus:border-error
  transition-colors duration-200" />
```

### Input with Icon

```tsx
{/* Left icon */}
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2
    w-4 h-4 text-content-tertiary" />
  <input className="w-full h-10 pl-10 pr-3 py-2 ..." />
</div>

{/* Right icon (clear) */}
<div className="relative">
  <input className="w-full h-10 px-3 pr-10 py-2 ..." />
  <button className="absolute right-3 top-1/2 -translate-y-1/2">
    <X className="w-4 h-4 text-content-tertiary" />
  </button>
</div>
```

### Error Message

```tsx
<div className="space-y-1.5">
  <Label error>Email</Label>
  <Input error />
  <p className="text-xs text-error">Invalid email address</p>
</div>
```

---

## 3. Select

### Specifications

| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | px-3 py-2 |
| Border | 1px solid #E5E7EB |
| Border Radius | 8px |
| Font Size | 14px |
| Arrow | ChevronDown (right side) |

### Tailwind Classes

```tsx
<select className="w-full h-10 px-3 py-2 text-sm
  bg-white border border-gray-200 rounded-lg
  text-content-primary appearance-none
  bg-[url('data:image/svg+xml,...')] bg-no-repeat bg-[position:left_12px_center]
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
  transition-colors duration-200">
  <option value="">Select...</option>
</select>
```

---

## 4. Textarea

### Specifications

| Property | Value |
|----------|-------|
| Min Height | 100px |
| Padding | px-3 py-2 |
| Border | 1px solid #E5E7EB |
| Border Radius | 8px |
| Font Size | 14px |
| Resize | Vertical only |

### Tailwind Classes

```tsx
<textarea className="w-full min-h-[100px] px-3 py-2 text-sm
  bg-white border border-gray-200 rounded-lg
  text-content-primary placeholder:text-content-tertiary
  resize-y
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
  transition-colors duration-200" />
```

---

## 5. Label

### Specifications

| Property | Value |
|----------|-------|
| Font Size | 13px |
| Font Weight | Medium (500) |
| Color | text-content-primary |
| Bottom Margin | 6px (space-y-1.5 with input) |

### Variants

```tsx
{/* Default */}
<label className="text-sm font-medium text-content-primary">

{/* Required */}
<label className="text-sm font-medium text-content-primary">
  Email <span className="text-error">*</span>
</label>

{/* Error */}
<label className="text-sm font-medium text-error">

{/* Optional */}
<label className="text-sm font-medium text-content-primary">
  Phone <span className="text-content-tertiary font-normal">(optional)</span>
</label>
```

---

## 6. Badge

### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| default | gray-100 | gray-700 | gray-200 | Default |
| primary | primary-50 | primary | primary-200 | Primary status |
| success | success-light | success | success/20 | Active |
| warning | warning-light | warning | warning/20 | Expiring |
| error | error-light | error | error/20 | Expired |
| accent | accent-50 | accent-700 | accent-200 | Premium |
| info | info-light | info | info/20 | Informational |

### Sizes

| Size | Height | Padding | Font Size | Icon |
|------|--------|---------|-----------|------|
| sm | 20px | px-2 py-0.5 | 11px | 12px |
| md | 24px | px-2.5 py-0.5 | 12px | 14px |
| lg | 32px | px-3 py-1 | 13px | 16px |

### Tailwind Classes

```tsx
{/* Success badge */}
<span className="inline-flex items-center gap-1
  rounded-full px-2.5 py-0.5
  text-xs font-medium
  bg-success-light text-success border border-success/20">
  <CheckCircle2 className="w-3 h-3" />
  Active
</span>

{/* Warning badge */}
<span className="inline-flex items-center gap-1
  rounded-full px-2.5 py-0.5
  text-xs font-medium
  bg-warning-light text-warning border border-warning/20">
  <AlertTriangle className="w-3 h-3" />
  Expiring
</span>

{/* Error badge */}
<span className="inline-flex items-center gap-1
  rounded-full px-2.5 py-0.5
  text-xs font-medium
  bg-error-light text-error border border-error/20">
  <XCircle className="w-3 h-3" />
  Expired
</span>

{/* Accent badge (premium) */}
<span className="inline-flex items-center gap-1
  rounded-full px-2.5 py-0.5
  text-xs font-medium
  bg-accent-50 text-accent-700 border border-accent-200">
  Featured
</span>
```

### Badge Without Icon

```tsx
<span className="inline-flex items-center
  rounded-full px-2.5 py-0.5
  text-xs font-medium
  bg-gray-100 text-gray-700">
  Draft
</span>
```

---

## 7. Card

### Specifications

| Property | Value |
|----------|-------|
| Background | white |
| Border | 1px solid #E5E7EB |
| Border Radius | 12px (rounded-xl) |
| Padding | 24px (p-6) |
| Shadow | shadow-sm |
| Hover Shadow | shadow-md (if clickable) |

### Standard Card

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm p-6">
  <h3 className="text-lg font-semibold text-content-primary mb-4">
    Card Title
  </h3>
  <p className="text-sm text-content-secondary">
    Card content goes here.
  </p>
</div>
```

### Clickable Card

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm p-6
  hover:shadow-md hover:border-gray-300
  transition-all duration-200
  cursor-pointer">
  Content
</div>
```

### Card with Header/Footer

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm">
  {/* Header */}
  <div className="p-6 pb-0">
    <h3 className="text-lg font-semibold">Title</h3>
  </div>

  {/* Content */}
  <div className="p-6">
    Content
  </div>

  {/* Footer */}
  <div className="p-6 pt-0 flex items-center gap-3">
    <Button variant="secondary">Cancel</Button>
    <Button>Save</Button>
  </div>
</div>
```

### Card with Image

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm overflow-hidden
  hover:shadow-md transition-all duration-200">
  <img className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="font-semibold">Title</h3>
  </div>
</div>
```

---

## 8. Table

### Specifications

| Property | Value |
|----------|-------|
| Header Background | gray-50 |
| Header Text | text-content-secondary, font-medium, 13px |
| Row Border | border-b border-gray-200 |
| Cell Padding | px-4 py-3 |
| Row Hover | hover:bg-gray-50 |
| Row Height | auto (content-based) |

### Standard Table

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm overflow-hidden">
  <table className="w-full">
    {/* Header */}
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="px-4 py-3 text-right text-xs font-medium
          text-content-secondary uppercase tracking-wider">
          Name
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium
          text-content-secondary uppercase tracking-wider">
          Status
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium
          text-content-secondary uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm">Property Name</td>
        <td className="px-4 py-3">
          <Badge variant="success">Active</Badge>
        </td>
        <td className="px-4 py-3">
          <Button variant="ghost" size="sm">Edit</Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Responsive Table (Mobile)

```tsx
{/* On mobile, convert table to card list */}
<div className="md:hidden space-y-4">
  <div className="bg-surface-card border rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium">Property Name</span>
      <Badge variant="success">Active</Badge>
    </div>
    <Button variant="ghost" size="sm">Edit</Button>
  </div>
</div>

{/* On desktop, show table */}
<div className="hidden md:block">
  <table>...</table>
</div>
```

---

## 9. Modal / Dialog

### Specifications

| Property | Value |
|----------|-------|
| Overlay | bg-black/50, backdrop-blur-sm |
| Container | centered, max-w-md (448px) |
| Background | white |
| Border Radius | 16px (rounded-2xl) |
| Shadow | shadow-xl |
| Padding | 24px (p-6) |
| Animation | fade-in + scale(0.95 → 1) |

### Standard Modal

```tsx
{/* Overlay */}
<div className="fixed inset-0 z-50
  bg-black/50 backdrop-blur-sm
  flex items-center justify-center p-4">

  {/* Modal Content */}
  <div className="bg-white rounded-2xl shadow-xl
    w-full max-w-md p-6
    animate-in fade-in zoom-in-95 duration-200">

    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Modal Title</h2>
      <button className="p-1 rounded-lg hover:bg-gray-100">
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Body */}
    <div className="mb-6">
      <p className="text-sm text-content-secondary">
        Modal content goes here.
      </p>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3">
      <Button variant="ghost">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  </div>
</div>
```

### Modal Sizes

| Size | Max Width | Usage |
|------|-----------|-------|
| sm | 384px | Simple confirmations |
| md | 448px | Standard forms |
| lg | 640px | Complex forms, property editor |
| xl | 768px | Full property management |
| full | 90vw | Image gallery, data tables |

---

## 10. Dropdown

### Specifications

| Property | Value |
|----------|-------|
| Background | white |
| Border | 1px solid #E5E7EB |
| Border Radius | 12px (rounded-xl) |
| Shadow | shadow-lg |
| Min Width | 200px |
| Max Height | 300px |
| Item Padding | px-3 py-2 |
| Item Font Size | 14px |
| Item Hover | bg-gray-50 |

### Standard Dropdown

```tsx
<div className="bg-white border border-gray-200
  rounded-xl shadow-lg py-2 min-w-[200px]">
  <button className="w-full px-3 py-2 text-right text-sm
    hover:bg-gray-50 transition-colors">
    Action 1
  </button>
  <button className="w-full px-3 py-2 text-right text-sm
    hover:bg-gray-50 transition-colors">
    Action 2
  </button>
  <div className="border-t border-gray-200 my-1" />
  <button className="w-full px-3 py-2 text-right text-sm
    text-error hover:bg-error-light transition-colors">
    Delete
  </button>
</div>
```

---

## 11. Tooltip

### Specifications

| Property | Value |
|----------|-------|
| Background | gray-800 |
| Text | white |
| Font Size | 12px |
| Padding | px-3 py-1.5 |
| Border Radius | 6px |
| Shadow | shadow-lg |
| Max Width | 250px |
| Arrow | 6px triangle |

### Usage

```tsx
{/* On hover */}
<div className="relative group">
  <button>Hover me</button>
  <div className="absolute bottom-full left-1/2 -translate-x-1/2
    mb-2 px-3 py-1.5 text-xs text-white bg-gray-800
    rounded-lg shadow-lg whitespace-nowrap
    opacity-0 group-hover:opacity-100
    transition-opacity duration-200
    pointer-events-none">
    Tooltip text
    <div className="absolute top-full left-1/2 -translate-x-1/2
      border-4 border-transparent border-t-gray-800" />
  </div>
</div>
```

---

## 12. Toast

### Priority: MEDIUM (implement when needed)

### Specifications

| Property | Value |
|----------|-------|
| Position | bottom-right (desktop), top-center (mobile) |
| Background | white |
| Border | 1px solid (variant-based) |
| Border Radius | 12px |
| Shadow | shadow-lg |
| Max Width | 384px |
| Auto Dismiss | 5 seconds |
| Animation | slide-in from right (desktop), top (mobile) |

### Variants

| Variant | Border Color | Icon | Usage |
|---------|-------------|------|-------|
| success | success | CheckCircle2 | Operation successful |
| error | error | XCircle | Operation failed |
| warning | warning | AlertTriangle | Warning message |
| info | info | Info | Informational |

### Structure

```tsx
<div className="flex items-start gap-3 p-4
  bg-white border border-success rounded-xl shadow-lg
  max-w-[384px]">
  <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
  <div className="flex-1">
    <p className="text-sm font-medium">Success</p>
    <p className="text-sm text-content-secondary">Property saved.</p>
  </div>
  <button className="p-1 hover:bg-gray-100 rounded">
    <X className="w-4 h-4" />
  </button>
</div>
```

---

## 13. Confirm Dialog

### Priority: MEDIUM (implement when needed)

### Specifications

| Property | Value |
|----------|-------|
| Type | Modal overlay |
| Max Width | 400px |
| Background | white |
| Border Radius | 16px |
| Shadow | shadow-xl |

### Variants

| Variant | Confirm Button | Usage |
|---------|---------------|-------|
| danger | Danger button | Delete, suspend |
| warning | Primary button | Destructive action |
| info | Primary button | Confirmation |

### Structure

```tsx
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
  flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-6">
    {/* Icon */}
    <div className="flex justify-center mb-4">
      <div className="w-12 h-12 rounded-full bg-error-light
        flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-error" />
      </div>
    </div>

    {/* Title */}
    <h3 className="text-lg font-semibold text-center mb-2">
      Delete Property?
    </h3>

    {/* Message */}
    <p className="text-sm text-content-secondary text-center mb-6">
      This action cannot be undone.
    </p>

    {/* Actions */}
    <div className="flex gap-3">
      <Button variant="ghost" className="flex-1">Cancel</Button>
      <Button variant="danger" className="flex-1">Delete</Button>
    </div>
  </div>
</div>
```

---

## 14. Empty State

### Priority: HIGH

### Specifications

| Property | Value |
|----------|-------|
| Container | centered, max-w-sm |
| Icon | 48px (w-12 h-12) |
| Icon Color | text-content-tertiary |
| Title | 16px, font-medium, text-content-primary |
| Description | 14px, text-content-secondary |
| Spacing | space-y-4 between elements |
| Action | Primary button (optional) |

### Standard Empty State

```tsx
<div className="flex flex-col items-center justify-center
  py-12 px-4 text-center">
  <Building2 className="w-12 h-12 text-content-tertiary mb-4" />
  <h3 className="text-base font-medium text-content-primary mb-2">
    No Properties Yet
  </h3>
  <p className="text-sm text-content-secondary mb-6 max-w-[300px]">
    Add your first property to start attracting clients.
  </p>
  <Button>
    <Plus className="w-4 h-4 mr-2" />
    Add Property
  </Button>
</div>
```

### Empty State Variants

```tsx
{/* No properties */}
<EmptyState
  icon={Building2}
  title="No Properties Yet"
  description="Add your first property to start attracting clients."
  action={{ label: "Add Property", href: "/dashboard/properties/new" }}
/>

{/* No leads */}
<EmptyState
  icon={Users}
  title="No Leads Yet"
  description="When clients contact you, their messages will appear here."
/>

{/* No search results */}
<EmptyState
  icon={Search}
  title="No Results Found"
  description="Try adjusting your search or filters."
  action={{ label: "Clear Filters", onClick: clearFilters }}
/>
```

---

## 15. Skeleton Loading

### Priority: HIGH

### Specifications

| Property | Value |
|----------|-------|
| Background | bg-gray-200 |
| Animation | pulse (1.5s infinite) |
| Border Radius | matches target element |
| Color | gray-200 → gray-100 → gray-200 |

### Variants

```tsx
{/* Text skeleton */}
<div className="h-4 bg-gray-200 rounded animate-pulse" />

{/* Title skeleton */}
<div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />

{/* Circle skeleton (avatar) */}
<div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />

{/* Rectangle skeleton (image) */}
<div className="h-48 bg-gray-200 rounded-xl animate-pulse" />

{/* Card skeleton */}
<div className="bg-surface-card border border-surface-border
  rounded-xl p-6 space-y-4">
  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
</div>
```

### Page Skeleton Examples

```tsx
{/* Dashboard skeleton */}
<div className="p-8 space-y-8">
  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
  <div className="grid grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-surface-card border rounded-xl p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
      </div>
    ))}
  </div>
</div>

{/* Property list skeleton */}
<div className="grid grid-cols-3 gap-6">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="bg-surface-card border rounded-xl overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  ))}
</div>
```

---

## 16. Avatar

### Specifications

| Size | Dimensions | Font Size | Usage |
|------|-----------|-----------|-------|
| xs | 24px | 10px | Inline badges |
| sm | 32px | 12px | List items |
| md | 40px | 14px | Navigation, comments |
| lg | 48px | 16px | Profile cards |
| xl | 64px | 20px | Profile page |
| 2xl | 96px | 28px | Settings |

### Variants

```tsx
{/* Image avatar */}
<img className="w-10 h-10 rounded-full object-cover" />

{/* Initials avatar */}
<div className="w-10 h-10 rounded-full bg-primary
  flex items-center justify-center
  text-sm font-medium text-white">
  GH  {/* Golden House */}
</div>

{/* Icon avatar (fallback) */}
<div className="w-10 h-10 rounded-full bg-gray-100
  flex items-center justify-center">
  <User className="w-5 h-5 text-content-secondary" />
</div>

{/* Agency logo (square with radius) */}
<img className="w-16 h-16 rounded-xl object-cover" />
```

### Avatar Group

```tsx
<div className="flex -space-x-2">
  <img className="w-8 h-8 rounded-full border-2 border-white" />
  <img className="w-8 h-8 rounded-full border-2 border-white" />
  <img className="w-8 h-8 rounded-full border-2 border-white" />
  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white
    flex items-center justify-center text-xs font-medium">
    +5
  </div>
</div>
```

---

## 17. Tabs

### Specifications

| Property | Value |
|----------|-------|
| Container | border-b border-gray-200 |
| Item Padding | px-4 py-2.5 |
| Item Font | 14px, font-medium |
| Active | border-b-2 border-primary, text-primary |
| Inactive | text-content-secondary, hover:text-content-primary |
| Indicator | 2px bottom border |

### Tailwind Classes

```tsx
<div className="border-b border-gray-200">
  <nav className="flex gap-8">
    <button className="py-2.5 px-1 text-sm font-medium
      border-b-2 border-primary text-primary">
      Properties
    </button>
    <button className="py-2.5 px-1 text-sm font-medium
      border-b-2 border-transparent text-content-secondary
      hover:text-content-primary hover:border-gray-300
      transition-colors">
      Leads
    </button>
  </nav>
</div>
```

---

## 18. Pagination

### Specifications

| Property | Value |
|----------|-------|
| Item Size | 36px × 36px |
| Border Radius | 8px |
| Active | bg-primary, text-white |
| Inactive | text-content-primary, hover:bg-gray-100 |
| Gap | 4px |

### Tailwind Classes

```tsx
<div className="flex items-center gap-1">
  <button className="w-9 h-9 rounded-lg flex items-center justify-center
    text-content-secondary hover:bg-gray-100
    disabled:opacity-50 disabled:cursor-not-allowed">
    <ChevronRight className="w-4 h-4" />
  </button>

  <button className="w-9 h-9 rounded-lg flex items-center justify-center
    bg-primary text-white text-sm font-medium">
    1
  </button>

  <button className="w-9 h-9 rounded-lg flex items-center justify-center
    text-content-primary hover:bg-gray-100 text-sm font-medium">
    2
  </button>

  <button className="w-9 h-9 rounded-lg flex items-center justify-center
    text-content-primary hover:bg-gray-100 text-sm font-medium">
    3
  </button>

  <button className="w-9 h-9 rounded-lg flex items-center justify-center
    text-content-secondary hover:bg-gray-100
    disabled:opacity-50 disabled:cursor-not-allowed">
    <ChevronLeft className="w-4 h-4" />
  </button>
</div>
```

---

## 19. Search Input

### Specifications

| Property | Value |
|----------|-------|
| Height | 40px |
| Width | 320px (desktop), full (mobile) |
| Icon | Search (left) |
| Placeholder | "Search properties..." |
| Clear Button | X icon (right, visible when has value) |

### Tailwind Classes

```tsx
<div className="relative w-full md:w-80">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2
    w-4 h-4 text-content-tertiary" />
  <input className="w-full h-10 pl-10 pr-10 py-2 text-sm
    bg-white border border-gray-200 rounded-lg
    placeholder:text-content-tertiary
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    transition-colors" />
  <button className="absolute right-3 top-1/2 -translate-y-1/2
    p-0.5 rounded hover:bg-gray-100
    text-content-tertiary hover:text-content-secondary
    transition-colors">
    <X className="w-4 h-4" />
  </button>
</div>
```

---

## 20. Property Card

### Specifications

| Property | Value |
|----------|-------|
| Width | full (grid-controlled) |
| Border Radius | 12px (rounded-xl) |
| Border | 1px solid #E5E7EB |
| Shadow | shadow-sm → shadow-md (hover) |
| Image Height | 160px |
| Content Padding | 16px (p-4) |
| Card Height | auto (content-based) |

### Structure

```
┌─────────────────────────────────────┐
│                                     │
│            [Image]                  │  ← h-40, object-cover
│                                     │
├─────────────────────────────────────┤
│  [For Sale]  [Featured]            │  ← Badges row
│                                     │
│  Villa Modern                      │  ← Title (font-medium)
│  Algiers, Bab Ezzouar              │  ← Location (text-secondary)
│                                     │
│  15,000,000 دج                     │  ← Price (font-semibold)
│                                     │
│  ─────────────────────────────────  │
│  4🛏  3🚿  250m²                   │  ← Stats row
└─────────────────────────────────────┘
```

### Tailwind Classes

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm overflow-hidden
  hover:shadow-md hover:border-gray-300
  transition-all duration-200 cursor-pointer">

  {/* Image */}
  <div className="relative h-40">
    <img className="w-full h-full object-cover" />
    <div className="absolute top-3 right-3 flex gap-2">
      <Badge variant="primary">For Sale</Badge>
      <Badge variant="accent">Featured</Badge>
    </div>
  </div>

  {/* Content */}
  <div className="p-4 space-y-2">
    <h3 className="font-medium text-content-primary truncate">
      Villa Modern
    </h3>
    <div className="flex items-center gap-1 text-sm text-content-secondary">
      <MapPin className="w-3.5 h-3.5" />
      <span className="truncate">Algiers, Bab Ezzouar</span>
    </div>
    <p className="text-base font-semibold text-content-primary">
      15,000,000 دج
    </p>
    <div className="flex items-center gap-4 text-sm text-content-secondary
      pt-2 border-t border-gray-100">
      <span className="flex items-center gap-1">
        <Bed className="w-4 h-4" /> 4
      </span>
      <span className="flex items-center gap-1">
        <Bath className="w-4 h-4" /> 3
      </span>
      <span className="flex items-center gap-1">
        <Square className="w-4 h-4" /> 250m²
      </span>
    </div>
  </div>
</div>
```

---

## 21. Stat Card

### Specifications

| Property | Value |
|----------|-------|
| Background | white |
| Border | 1px solid #E5E7EB |
| Border Radius | 12px |
| Padding | 24px (p-6) |
| Shadow | shadow-sm |

### Structure

```
┌─────────────────────────────────┐
│  [Icon]  Label                  │
│                                 │
│  12                             │  ← Stat number
│  properties                     │  ← Stat description
└─────────────────────────────────┘
```

### Tailwind Classes

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm p-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-lg bg-primary-50
      flex items-center justify-center">
      <Building2 className="w-5 h-5 text-primary" />
    </div>
    <span className="text-sm text-content-secondary">Properties</span>
  </div>
  <p className="text-3xl font-bold text-content-primary">12</p>
  <p className="text-sm text-content-secondary mt-1">Total properties</p>
</div>
```

---

## 22. Success Path

### Specifications

| Property | Value |
|----------|-------|
| Container | bg-surface-card, rounded-xl, p-6 |
| Step Size | 24px circle |
| Completed | bg-success, white check |
| Pending | bg-gray-200, gray number |
| Connector | dashed line between steps |

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Complete Your Profile                              │
│                                                     │
│  ✅ ─── ⬜ ─── ⬜ ─── ⬜ ─── ⬜                   │
│  Create  Add    Upload  Share   Get first           │
│  agency  first  logo    link    contact             │
│          property                                   │
└─────────────────────────────────────────────────────┘
```

### Tailwind Classes

```tsx
<div className="bg-surface-card border border-surface-border
  rounded-xl shadow-sm p-6">
  <h3 className="text-base font-semibold mb-6">Complete Your Profile</h3>

  <div className="flex items-center justify-between">
    {/* Step 1 — Completed */}
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-success
        flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-xs text-success font-medium">Create Agency</span>
    </div>

    {/* Connector */}
    <div className="flex-1 h-px border-t-2 border-dashed border-gray-300 mx-2" />

    {/* Step 2 — Current */}
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-primary
        flex items-center justify-center">
        <span className="text-xs text-white font-medium">2</span>
      </div>
      <span className="text-xs text-primary font-medium">Add Property</span>
    </div>

    {/* Connector */}
    <div className="flex-1 h-px border-t-2 border-dashed border-gray-300 mx-2" />

    {/* Step 3 — Pending */}
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gray-200
        flex items-center justify-center">
        <span className="text-xs text-gray-500 font-medium">3</span>
      </div>
      <span className="text-xs text-content-tertiary">Upload Logo</span>
    </div>
  </div>
</div>
```

---

## 23. Sidebar Navigation

### Specifications

| Property | Value |
|----------|-------|
| Width (full) | 260px |
| Width (collapsed) | 72px |
| Background | white |
| Border | border-l (RTL) or border-r (LTR) |
| Item Height | 44px |
| Item Padding | px-3 |
| Active | bg-primary/10, text-primary |
| Inactive | text-content-secondary, hover:bg-gray-50 |
| Logo Area | h-16 |

### Structure

```
┌─────────────────────┐
│  [Logo]  Agency     │  ← h-16, logo + name
│                     │
│  Dashboard          │  ← Active (bg-primary/10)
│  Properties         │
│  Leads              │
│  Analytics          │
│  Settings           │
│                     │
│                     │
│  ─────────────────  │
│  [User] Name        │  ← User info at bottom
│  Role               │
└─────────────────────┘
```

### Tailwind Classes

```tsx
<aside className="w-[260px] h-screen bg-white
  border-l border-gray-200
  flex flex-col
  fixed right-0 top-0 z-40
  lg:relative">

  {/* Logo */}
  <div className="h-16 px-4 flex items-center gap-3
    border-b border-gray-200">
    <img className="w-8 h-8 rounded-lg" />
    <span className="font-semibold text-content-primary truncate">
      Agency Name
    </span>
  </div>

  {/* Navigation */}
  <nav className="flex-1 p-3 space-y-1">
    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg
      bg-primary/10 text-primary font-medium text-sm">
      <LayoutDashboard className="w-5 h-5" />
      Dashboard
    </a>
    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg
      text-content-secondary hover:bg-gray-50
      transition-colors text-sm">
      <Building2 className="w-5 h-5" />
      Properties
    </a>
  </nav>

  {/* User Info */}
  <div className="p-3 border-t border-gray-200">
    <div className="flex items-center gap-3 px-3 py-2">
      <Avatar size="md" />
      <div>
        <p className="text-sm font-medium">Owner Name</p>
        <p className="text-xs text-content-secondary">Agency Owner</p>
      </div>
    </div>
  </div>
</aside>
```

---

## 24. Topbar

### Specifications

| Property | Value |
|----------|-------|
| Height | 64px |
| Background | white |
| Border | border-b border-gray-200 |
| Padding | px-8 |
| Position | sticky top-0 z-30 |

### Tailwind Classes

```tsx
<header className="h-16 bg-white border-b border-gray-200
  sticky top-0 z-30
  flex items-center justify-between px-8">
  <h1 className="text-xl font-semibold">Page Title</h1>
  <div className="flex items-center gap-4">
    <SearchInput />
    <Button variant="ghost" size="icon">
      <Bell className="w-5 h-5" />
    </Button>
    <Avatar />
  </div>
</header>
```

---

## 25. Page Header

### Specifications

| Property | Value |
|----------|-------|
| Title | 24px, font-semibold |
| Subtitle | 14px, text-content-secondary |
| Actions | right-aligned buttons |
| Margin Bottom | 32px (mb-8) |

### Tailwind Classes

```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-2xl font-semibold text-content-primary">
      Properties
    </h1>
    <p className="text-sm text-content-secondary mt-1">
      Manage your property listings
    </p>
  </div>
  <Button>
    <Plus className="w-4 h-4 mr-2" />
    Add Property
  </Button>
</div>
```

---

## Component Priority for MVP

| Priority | Component | Sprint |
|----------|-----------|--------|
| P0 | Button, Input, Label, Card, Badge | 1 |
| P0 | Sidebar, Topbar, Page Header | 1 |
| P0 | Empty State, Skeleton Loading | 1 |
| P0 | Property Card, Stat Card | 2 |
| P0 | Table, Pagination | 2 |
| P1 | Modal/Dialog, Confirm Dialog | 3 |
| P1 | Search Input, Tabs | 3 |
| P1 | Toast, Dropdown | 4 |
| P1 | Success Path, Avatar | 4 |
| P2 | Tooltip, Select, Textarea | 5 |
