# Icons System — EstateOS

> Icons provide visual cues and improve scanability.
> Consistency in icons = consistency in experience.

---

## 1. Icon Library

### Primary: Lucide React

```bash
npm install lucide-react
```

- **Source:** https://lucide.dev
- **License:** ISC (free, open source)
- **Size:** Lightweight, tree-shakeable
- **Style:** Outline (stroke-based)
- **Consistency:** All icons share the same stroke width

### Why Lucide?

```
✅ Consistent stroke width (1.5px default)
✅ Tree-shakeable (only import what you use)
✅ Lightweight (~0.5KB per icon)
✅ Covers all common UI patterns
✅ Active maintenance
✅ TypeScript support
```

---

## 2. Icon Sizes

```tsx
// Size scale
const iconSizes = {
  xs:  12,  // Inline with text, badges
  sm:  16,  // Compact UI, table cells
  md:  20,  // Default, buttons, navigation
  lg:  24,  // Feature icons, page headers
  xl:  32,  // Empty states, hero sections
  '2xl': 48, // Large empty states, onboarding
};
```

### Tailwind Mapping

```tsx
{/* Extra Small — inline with text */}
<Icon className="w-3 h-3" />     {/* 12px */}

{/* Small — compact UI */}
<Icon className="w-4 h-4" />     {/* 16px */}

{/* Medium — default */}
<Icon className="w-5 h-5" />     {/* 20px */}

{/* Large — feature icons */}
<Icon className="w-6 h-6" />     {/* 24px */}

{/* XL — empty states */}
<Icon className="w-8 h-8" />     {/* 32px */}

{/* 2XL — hero/onboarding */}
<Icon className="w-12 h-12" />   {/* 48px */}
```

---

## 3. Icon Colors

```tsx
{/* Default — inherit text color */}
<Icon className="text-current" />

{/* Primary — interactive elements */}
<Icon className="text-primary" />

{/* Secondary — muted, decorative */}
<Icon className="text-content-secondary" />

{/* Tertiary — very muted */}
<Icon className="text-content-tertiary" />

{/* Success — positive states */}
<Icon className="text-success" />

{/* Warning — caution states */}
<Icon className="text-warning" />

{/* Error — destructive states */}
<Icon className="text-error" />

{/* White — on dark backgrounds */}
<Icon className="text-white" />

{/* Inverse — on primary background */}
<Icon className="text-primary-foreground" />
```

---

## 4. Stroke Width

```tsx
{/* Default stroke — 1.5px (recommended) */}
<Icon strokeWidth={1.5} />

{/* Thin stroke — decorative icons */}
<Icon strokeWidth={1} />

{/* Thick stroke — emphasis */}
<Icon strokeWidth={2} />
```

### Rules

```
Default:  strokeWidth={1.5}  → All UI icons
Thin:     strokeWidth={1}    → Background patterns, decorative
Thick:    strokeWidth={2}    → Emphasis icons (never use for navigation)
```

---

## 5. Navigation Icons

### Sidebar Navigation

```tsx
import {
  LayoutDashboard,  // Dashboard
  Building2,        // Properties
  Users,            // Leads
  BarChart3,        // Analytics
  Settings,         // Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard',  icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Properties', icon: Building2,       href: '/dashboard/properties' },
  { name: 'Leads',      icon: Users,           href: '/dashboard/leads' },
  { name: 'Analytics',  icon: BarChart3,       href: '/dashboard/analytics' },
  { name: 'Settings',   icon: Settings,        href: '/dashboard/settings' },
];
```

### Super Admin Navigation

```tsx
import {
  LayoutDashboard,  // Overview
  Building2,        // Agencies
  CreditCard,       // Subscriptions
  BarChart3,        // Analytics
  Settings,         // System Settings
} from 'lucide-react';

const adminNavigation = [
  { name: 'Overview',       icon: LayoutDashboard, href: '/admin' },
  { name: 'Agencies',       icon: Building2,       href: '/admin/agencies' },
  { name: 'Subscriptions',  icon: CreditCard,      href: '/admin/subscriptions' },
  { name: 'Analytics',      icon: BarChart3,       href: '/admin/analytics' },
  { name: 'Settings',       icon: Settings,        href: '/admin/settings' },
];
```

---

## 6. Action Icons

### CRUD Operations

```tsx
import {
  Plus,         // Add new
  Pencil,       // Edit
  Trash2,       // Delete
  Eye,          // View
  EyeOff,       // Hide
  Download,     // Download
  Upload,       // Upload
  Copy,         // Copy
  RefreshCw,    // Refresh
  Search,       // Search
} from 'lucide-react';
```

### Content Operations

```tsx
import {
  ArrowUpDown,      // Sort
  SlidersHorizontal, // Filter
  X,                // Close / Clear
  Check,            // Confirm / Select
  ChevronDown,      // Dropdown
  ChevronRight,     // Navigate
  ChevronLeft,      // Navigate (RTL)
  MoreHorizontal,   // More options
} from 'lucide-react';
```

---

## 7. Status Icons

```tsx
import {
  CheckCircle2,     // Success / Active
  AlertTriangle,    // Warning / Expiring
  XCircle,          // Error / Expired
  Clock,            // Pending / In Progress
  Info,             // Information
  Shield,           // Security
  ShieldCheck,      // Verified
} from 'lucide-react';
```

### Status Icon Usage

```tsx
{/* Active status */}
<CheckCircle2 className="w-4 h-4 text-success" />

{/* Warning status */}
<AlertTriangle className="w-4 h-4 text-warning" />

{/* Error status */}
<XCircle className="w-4 h-4 text-error" />

{/* Pending status */}
<Clock className="w-4 h-4 text-content-secondary" />

{/* Info */}
<Info className="w-4 h-4 text-info" />
```

---

## 8. Property Icons

```tsx
import {
  Bed,            // Bedrooms
  Bath,           // Bathrooms
  Square,         // Area (m²)
  MapPin,         // Location
  Calendar,       // Year built
  Car,            // Parking
  TreePine,       // Garden / Outdoor
  Waves,          // Pool
  Wifi,           // Internet
  Zap,            // Electricity
  Droplets,       // Water
  Thermometer,    // Heating / AC
} from 'lucide-react';
```

### Property Details Usage

```tsx
{/* Property stats */}
<div className="flex items-center gap-4">
  <div className="flex items-center gap-1">
    <Bed className="w-4 h-4 text-content-secondary" />
    <span>4</span>
  </div>
  <div className="flex items-center gap-1">
    <Bath className="w-4 h-4 text-content-secondary" />
    <span>3</span>
  </div>
  <div className="flex items-center gap-1">
    <Square className="w-4 h-4 text-content-secondary" />
    <span>250m²</span>
  </div>
</div>

{/* Property location */}
<div className="flex items-center gap-1">
  <MapPin className="w-4 h-4 text-primary" />
  <span>Alger, Bab Ezzouar</span>
</div>
```

---

## 9. Empty State Icons

```tsx
import {
  Building2,      // No properties
  Users,          // No leads
  BarChart3,      // No analytics
  Inbox,          // No data
  FileX,          // No results
  Search,         // No search results
} from 'lucide-react';

{/* Empty state — no properties */}
<div className="flex flex-col items-center">
  <Building2 className="w-12 h-12 text-content-tertiary mb-4" />
  <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
  <p className="text-content-secondary mb-4">Add your first property to get started</p>
  <Button>+ Add Property</Button>
</div>
```

---

## 10. Social Icons

```tsx
import {
  Phone,          // Phone call
  MessageCircle,  // WhatsApp
  Mail,           // Email
  Globe,          // Website
  Facebook,       // Facebook
  Instagram,      // Instagram
  Twitter,        // Twitter
  Linkedin,       // LinkedIn
  Share2,         // Share
} from 'lucide-react';
```

---

## 11. Icon Component Pattern

### Reusable Icon Wrapper

```tsx
// src/shared/components/ui/icon.tsx

import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

export function Icon({
  icon: LucideIcon,
  size = 'md',
  color,
  className,
}: IconProps) {
  return (
    <LucideIcon
      className={cn(sizeMap[size], color, className)}
      strokeWidth={1.5}
    />
  );
}
```

### Usage

```tsx
<Icon icon={Building2} size="md" />
<Icon icon={CheckCircle2} size="sm" color="text-success" />
<Icon icon={AlertTriangle} size="lg" color="text-warning" />
```

---

## 12. Icon + Text Alignment

```tsx
{/* Button with icon */}
<button className="flex items-center gap-2">
  <Plus className="w-4 h-4" />
  <span>Add Property</span>
</button>

{/* Navigation item with icon */}
<a className="flex items-center gap-3">
  <Building2 className="w-5 h-5" />
  <span>Properties</span>
</a>

{/* Badge with icon */}
<Badge variant="success">
  <CheckCircle2 className="w-3 h-3 mr-1" />
  Active
</Badge>

{/* List item with icon */}
<div className="flex items-center gap-2">
  <MapPin className="w-4 h-4 text-content-secondary" />
  <span className="text-sm">Algiers, Algeria</span>
</div>
```

---

## 13. RTL Support

```tsx
{/* Icons that should mirror in RTL */}
<ArrowLeft className="w-4 h-4 rtl:rotate-180" />
<ChevronRight className="w-4 h-4 rtl:rotate-180" />
<ChevronLeft className="w-4 h-4 rtl:-rotate-180" />

{/* Icons that should NOT mirror */}
<Search className="w-4 h-4" />        {/* Symmetric */}
<Settings className="w-4 h-4" />      {/* Symmetric */}
<Plus className="w-4 h-4" />          {/* Symmetric */}
<Check className="w-4 h-4" />         {/* Symmetric */}
```

### Mirror Rule

```
MIRROR (rotate 180° in RTL):
  - Directional arrows (left/right)
  - Chevrons (for navigation)
  - Progress indicators

DO NOT MIRROR:
  - Symmetric icons (search, plus, check)
  - Status icons (success, warning, error)
  - Object icons (building, user, card)
```

---

## 14. Icon Anti-Patterns

```tsx
{/* ❌ WRONG — Inconsistent sizes */}
<Building2 className="w-4 h-4" />
<Building2 className="w-5 h-5" />  {/* Same icon, different size */}

{/* ❌ WRONG — Hardcoded colors */}
<Building2 className="text-[#0F2747]" />

{/* ❌ WRONG — Using wrong icon for context */}
<Settings className="w-5 h-5 text-success" />  {/* Settings = not success */}

{/* ✅ CORRECT — Consistent usage */}
<Icon icon={Building2} size="md" color="text-content-secondary" />
```

### Common Mistakes

```
❌ Using Trash2 for "archive" (use Archive instead)
❌ Using X for "back" (use ArrowLeft instead)
❌ Using Eye for "edit" (use Pencil instead)
❌ Mixing icon libraries in the same view
❌ Using icons without text labels for navigation
❌ Using icons larger than 24px in navigation
```

---

## 15. Icon Import Pattern

```tsx
// CORRECT — Import only what you use
import { Building2, Users, BarChart3 } from 'lucide-react';

// WRONG — Import entire library
import * as Icons from 'lucide-react';  // ❌ No tree-shaking!
```

---

## 16. Quick Reference

### Navigation

| Icon | Name | Usage |
|------|------|-------|
| LayoutDashboard | Dashboard | Main dashboard |
| Building2 | Properties | Property management |
| Users | Leads | Customer leads |
| BarChart3 | Analytics | Statistics |
| Settings | Settings | Configuration |
| CreditCard | Subscriptions | Subscription management |

### Actions

| Icon | Name | Usage |
|------|------|-------|
| Plus | Add | Create new item |
| Pencil | Edit | Edit existing item |
| Trash2 | Delete | Remove item |
| Eye | View | View details |
| Search | Search | Search functionality |
| Download | Download | Export/download |
| Upload | Upload | Upload files |
| X | Close | Close dialog/modal |

### Status

| Icon | Name | Usage |
|------|------|-------|
| CheckCircle2 | Success | Active, completed |
| AlertTriangle | Warning | Expiring, caution |
| XCircle | Error | Expired, failed |
| Clock | Pending | In progress, waiting |
| Info | Info | Information |

### Property

| Icon | Name | Usage |
|------|------|-------|
| Bed | Bedrooms | Number of bedrooms |
| Bath | Bathrooms | Number of bathrooms |
| Square | Area | Property area (m²) |
| MapPin | Location | Property location |
| Calendar | Year | Year built |
| Car | Parking | Parking available |
