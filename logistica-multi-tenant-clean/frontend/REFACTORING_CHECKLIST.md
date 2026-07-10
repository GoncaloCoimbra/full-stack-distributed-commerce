# 🎨 Component Migration Checklist

## Quick Reference for Refactoring Pages

### Old Pattern → New Pattern

```tsx
// OLD - Tailwind Classes
<div className="bg-slate-800 border-amber-500/30 rounded-2xl p-6">
  <button className="px-6 py-3 bg-amber-500 text-white rounded-lg">Click</button>
</div>

// NEW - Component System
<Card>
  <Button variant="primary">Click</Button>
</Card>
```

---

## Import Statement
Every refactored page starts with:
```tsx
import { Button, Input, Card, Badge, Alert } from '../components/common';
```

---

## Component Mapping

| Old Pattern | New Component | Example |
|---|---|---|
| `className="px-4 py-2 bg-* rounded-lg"` | `<Button variant="..." size="md">` | `<Button variant="primary">Save</Button>` |
| `<input className="bg-slate..." />` | `<Input label="..." />` | `<Input type="email" label="Email" />` |
| `<div className="bg-gradient-to-br... rounded-2xl">` | `<Card header={...}>` | `<Card header={<h2>Title</h2>}>Content</Card>` |
| `<span className="bg-blue-500/20...">` | `<Badge variant="...">` | `<Badge variant="success">Active</Badge>` |
| `<div className="rounded-2xl p-6 border-blue...">` | `<Alert type="...">` | `<Alert type="info" message="..." />` |

---

## Pages to Refactor (Priority Order)

### Phase 1: Core Management Pages (HIGH PRIORITY)
- [ ] **ProductList.tsx** — Add/Edit/Delete products with status badges
- [ ] **SupplierList.tsx** — Supplier management with CRUD
- [ ] **TransportList.tsx** — Track shipments with status tracking

### Phase 2: User & Admin Pages (MEDIUM PRIORITY)
- [ ] **Profile.tsx** — User profile and password change
- [ ] **Settings.tsx** — App settings and preferences
- [ ] **AdminHome.tsx** — Admin dashboard overview
- [ ] **OperatorHome.tsx** — Operator view

### Phase 3: Advanced Features (LOW PRIORITY)
- [ ] **AuditLog.tsx** — Historical tracking table
- [ ] **Tasks.tsx** — Task list view
- [ ] **Reports/** — Reporting pages
- [ ] **LiveTrackingAndRouteOptimization.tsx** — Map-based tracking

### Phase 4: Public Pages (LAST)
- [ ] **Login.tsx** — Login form
- [ ] **Register.tsx** — Registration form
- [ ] **TermsofUse.tsx** — Static pages
- [ ] **PrivacyPolicy.tsx** — Static pages

---

## Refactoring Workflow

### Step 1: Replace Imports
```tsx
// Remove old imports, add new ones
import { Button, Input, Card, Badge, Alert } from '../components/common';
```

### Step 2: Find & Replace Patterns

| Search | Replace | Notes |
|--------|---------|-------|
| `className=".*bg-slate-.*"` | Remove className, use `<Card>` | Container divs |
| `className=".*px-.*py-.*bg-.*button"` | Use `<Button variant="...">` | Button elements |
| `<input.*/>` | Use `<Input label="..." />` | Form inputs |
| `<span className=".*badge"` | Use `<Badge variant="...">` | Status indicators |

### Step 3: CSS Variables for Styling
When inline styles needed:
```tsx
style={{
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-lg)',
}}
```

### Step 4: Test & Validate
- ✅ Light mode looks good
- ✅ Dark mode works (toggle 🌙 in header)
- ✅ Responsive (mobile/tablet/desktop)
- ✅ All buttons functional
- ✅ Forms submit correctly

---

## Common CSS Variables Reference

```css
/* Colors */
--color-brand-red: #d90429
--color-surface: #faf9f8 (light) / #141517 (dark)
--color-text: #0e0e0e (light) / #e8e4e1 (dark)
--color-text-muted: #7d7d7d (light) / #8b8582 (dark)
--color-border: #e8e3e1 (light) / rgba(255,255,255,0.09) (dark)

/* Typography */
--font-display: Outfit
--font-body: DM Sans
--font-mono: DM Mono
--fs-xs: 0.75rem
--fs-sm: 0.875rem
--fs-base: 1rem
--fs-lg: 1.125rem
--fs-2xl: 1.5rem
--fs-3xl: 1.875rem

/* Spacing */
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem

/* Radius */
--radius-sm: 0.375rem
--radius-md: 0.5rem
--radius-lg: 0.75rem

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
```

---

## Example: Refactored Form Page

### Before:
```tsx
const SettingsPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen p-6">
      <div className="rounded-2xl bg-slate-700 border border-amber-500/30 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
        <div className="space-y-4">
          <input type="email" className="w-full px-4 py-2 bg-slate-600 border border-amber-500/30 rounded-lg text-white" />
          <button className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Save</button>
        </div>
      </div>
    </div>
  );
};
```

### After:
```tsx
import { Button, Input, Card } from '../components/common';

const SettingsPage = () => {
  return (
    <div style={{ padding: 'var(--space-2xl)' }}>
      <Card header={<h2>Settings</h2>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Input type="email" label="Email" />
          <Button variant="primary">Save</Button>
        </div>
      </Card>
    </div>
  );
};
```

---

## Tips & Tricks

### Flexible Layout
```tsx
// Grid for multiple cards
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'var(--space-lg)',
}}>
  <Card>{/* ... */}</Card>
</div>
```

### Responsive Text
```tsx
<p style={{ fontSize: 'var(--fs-sm)' }}>Small text</p>
<h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700 }}>Large heading</h1>
```

### Status Colors
```tsx
const statusVariant = status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'error';
<Badge variant={statusVariant}>{status}</Badge>
```

### Dark Mode Auto
No need to handle dark mode manually! It works automatically:
- Light/Dark toggle in header (🌙)
- All components adapt via CSS variables
- Just use the components, theme takes care of the rest

---

## Progress Tracking

Use this checklist to track progress:

```
Phase 1: Core Pages
- [ ] ProductList (15-20 min)
- [ ] SupplierList (15-20 min)
- [ ] TransportList (15-20 min)
Total: ~1 hour

Phase 2: User Pages
- [ ] Profile (10-15 min)
- [ ] Settings (10-15 min)
- [ ] AdminHome (15-20 min)
Total: ~45 min

Phase 3: Advanced
- [ ] AuditLog (10-15 min)
- [ ] Tasks (10-15 min)
- [ ] LiveTracking (20-30 min)
Total: ~45 min

GRAND TOTAL: ~2.5-3 hours for all pages
```

---

## Estimated Page Refactor Times

| Page | Complexity | Time |
|------|-----------|------|
| Profile.tsx | ⭐ Easy | 10-15 min |
| Settings.tsx | ⭐ Easy | 10-15 min |
| ProductList.tsx | ⭐⭐ Medium | 20-30 min |
| SupplierList.tsx | ⭐⭐ Medium | 20-30 min |
| TransportList.tsx | ⭐⭐ Medium | 20-30 min |
| Dashboard.tsx | ⭐⭐⭐ Hard | 30-45 min |
| AuditLog.tsx | ⭐⭐ Medium | 15-20 min |
| Login.tsx | ⭐ Easy | 10-15 min |
| Tasks.tsx | ⭐⭐⭐ Hard | 30-45 min |

**Total Estimated Time: 3-4 hours for all main pages**

---

## Success Criteria

After refactoring each page, verify:
- ✅ No Tailwind `bg-slate-*`, `border-amber-*`, etc. classes
- ✅ Using component library (Button, Input, Card, Badge, Alert)
- ✅ CSS variables for custom styling needs
- ✅ Light and dark mode both work
- ✅ Responsive design intact
- ✅ All functionality preserved
- ✅ No console errors

---

**Ready to start? Pick a page and begin! 🚀**
