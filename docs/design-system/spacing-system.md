# Spacing System — EstateOS

> Consistent spacing creates visual rhythm and luxury feel.
> All spacing must follow this scale. No arbitrary values.

---

## 1. Spacing Scale

```css
:root {
  --space-0:   0px;
  --space-px:  1px;
  --space-0_5: 2px;
  --space-1:   4px;
  --space-1_5: 6px;
  --space-2:   8px;
  --space-2_5: 10px;
  --space-3:   12px;
  --space-3_5: 14px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-7:   28px;
  --space-8:   32px;
  --space-9:   36px;
  --space-10:  40px;
  --space-11:  44px;
  --space-12:  48px;
  --space-14:  56px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;
}
```

---

## 2. Tailwind Mapping

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| space-1 | 4px | `p-1` / `m-1` / `gap-1` | Micro spacing |
| space-2 | 8px | `p-2` / `m-2` / `gap-2` | Tight spacing |
| space-3 | 12px | `p-3` / `m-3` / `gap-3` | Compact spacing |
| space-4 | 16px | `p-4` / `m-4` / `gap-4` | Default spacing |
| space-5 | 20px | `p-5` / `m-5` / `gap-5` | Medium spacing |
| space-6 | 24px | `p-6` / `m-6` / `gap-6` | Comfortable spacing |
| space-8 | 32px | `p-8` / `m-8` / `gap-8` | Spacious spacing |
| space-10 | 40px | `p-10` / `m-10` / `gap-10` | Section spacing |
| space-12 | 48px | `p-12` / `m-12` / `gap-12` | Large section |
| space-16 | 64px | `p-16` / `m-16` / `gap-16` | Page section |
| space-20 | 80px | `p-20` / `m-20` / `gap-20` | Hero spacing |
| space-24 | 96px | `p-24` / `m-24` / `gap-24` | Maximum spacing |

---

## 3. Spacing Rules

### 3.1 Component Internal Spacing

```
Component          Padding (Internal)
─────────────────────────────────────────
Button (sm)        px-3 py-1.5        (12px, 6px)
Button (md)        px-6 py-2          (24px, 8px)
Button (lg)        px-8 py-3          (32px, 12px)
Input              px-3 py-2          (12px, 8px)
Card               p-6                (24px all sides)
Modal              p-6                (24px all sides)
Table Cell         px-4 py-3          (16px, 12px)
Badge              px-2 py-0.5        (8px, 2px)
Tooltip            px-3 py-1.5        (12px, 6px)
```

### 3.2 Component External Spacing (Margins/Gaps)

```
Component          Gap/Margin         Usage
─────────────────────────────────────────
Card Grid          gap-6              (24px between cards)
Form Fields        space-y-4          (16px between fields)
Button Group       gap-3              (12px between buttons)
Table Rows         border-b           (border, no gap)
Section            space-y-8          (32px between sections)
Page Content       p-8                (32px page padding)
Sidebar Items      space-y-1          (4px between nav items)
Stats Cards        gap-4              (16px between stat cards)
```

### 3.3 Layout Spacing

```
Element            Spacing
─────────────────────────────────────────
Page Padding       p-8 (32px) all sides
Content Max Width  max-w-7xl (1200px)
Card Grid          grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Section Gap        space-y-8 (32px)
Page Section       py-16 (64px vertical)
Hero Section       py-20 (80px vertical)
```

---

## 4. Spacing Patterns

### 4.1 Card Pattern

```tsx
{/* Card with consistent spacing */}
<div className="p-6 space-y-4">
  {/* Card Header */}
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">عنوان البطاقة</h3>
    <Badge>نشط</Badge>
  </div>

  {/* Card Content */}
  <p className="text-sm text-content-secondary">
    وصف تفصيلي لمحتوى البطاقة
  </p>

  {/* Card Footer */}
  <div className="flex items-center gap-3 pt-4 border-t">
    <Button variant="secondary">إلغاء</Button>
    <Button>حفظ</Button>
  </div>
</div>
```

### 4.2 Form Pattern

```tsx
{/* Form with consistent spacing */}
<form className="space-y-4">
  {/* Field Group */}
  <div className="space-y-1.5">
    <Label>اسم العقار</Label>
    <Input placeholder="أدخل اسم العقار" />
    <HelperText>اسم العقار كما يظهر للمستخدمين</HelperText>
  </div>

  {/* Field Group */}
  <div className="space-y-1.5">
    <Label>السعر</Label>
    <Input placeholder="0000" />
  </div>

  {/* Form Actions */}
  <div className="flex items-center gap-3 pt-4">
    <Button variant="ghost">إلغاء</Button>
    <Button>حفظ التغييرات</Button>
  </div>
</form>
```

### 4.3 Page Layout Pattern

```tsx
{/* Page with consistent spacing */}
<main className="p-8">
  {/* Page Header */}
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-2xl font-semibold">العقارات</h1>
    <Button>+ إضافة عقار</Button>
  </div>

  {/* Filters Bar */}
  <div className="flex items-center gap-4 mb-6">
    <SearchInput />
    <FilterDropdown />
    <SortDropdown />
  </div>

  {/* Content Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {properties.map(property => (
      <PropertyCard key={property.id} property={property} />
    ))}
  </div>
</main>
```

---

## 5. Responsive Spacing

```tsx
{/* Mobile: tighter spacing */}
<div className="p-4 md:p-6 lg:p-8">

{/* Mobile: smaller gaps */}
<div className="gap-4 md:gap-6">

{/* Mobile: reduced section spacing */}
<section className="py-8 md:py-12 lg:py-16">

{/* Mobile: full width */}
<div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
```

### Mobile Spacing Adjustments

```
Element            Desktop     Mobile
─────────────────────────────────────────
Page Padding       32px        16px
Card Padding       24px        16px
Card Gap           24px        16px
Section Gap        32px        24px
Button Padding     24px/8px    16px/8px
```

---

## 6. Spacing Anti-Patterns

```tsx
{/* ❌ WRONG — Inconsistent spacing */}
<div className="p-5">
  <div className="mb-7">
    <div className="mt-3">
      <div className="gap-5">
        {/* Random values: 5, 7, 3, 5 — no rhythm */}

{/* ✅ CORRECT — Consistent spacing from scale */}
<div className="p-6">
  <div className="mb-8">
    <div className="mt-4">
      <div className="gap-6">
        {/* Consistent values: 6, 8, 4, 6 — clear rhythm */}
```

### Common Mistakes

```
❌ p-5 (not in scale — use p-4 or p-6)
❌ gap-7 (not in scale — use gap-6 or gap-8)
❌ mb-9 (not in scale — use mb-8 or mb-10)
❌ space-y-5 (not in scale — use space-y-4 or space-y-6)
❌ mx-[23px] (arbitrary values — never use)
```

---

## 7. Quick Reference

### Micro Spacing (4-8px)
Use for: inline elements, icon padding, badge padding, tight groups

### Small Spacing (8-12px)
Use for: form field gaps, button gaps, list item spacing

### Medium Spacing (16-24px)
Use for: card padding, section content, form sections

### Large Spacing (32-48px)
Use for: page sections, major divisions, hero sections

### Extra Large Spacing (64-96px)
Use for: page margins, section separators, hero padding

---

## 8. File Location

```text
src/shared/lib/theme/
└── spacing.ts    ← Spacing constants (if needed for JS)
```

CSS values are defined in `design-tokens.md` and used via Tailwind classes.
