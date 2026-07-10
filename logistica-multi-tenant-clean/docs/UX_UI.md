# UX/UI Guide

This document describes the design patterns, usability, and accessibility of the platform.

## Design Principles

### 1. **Clarity**
- Clean and direct interfaces
- Descriptive labels in forms
- Useful error messages (not technical)

### 2. **Efficiency**
- Fewer clicks for common actions
- Keyboard shortcuts for critical operations
- Quick search in large lists

### 3. **Consistency**
- Unified visual standard across all pages
- Consistent naming (ex. always "Transports", never "Shipments")
- Similar behaviors for similar actions

### 4. **Accessibility**
- WCAG 2.1 AA minimum
- Screen reader support
- Color contrast ≥ 4.5:1
- Complete keyboard navigation

## Color Palette

```javascript
// tailwind.config.js (example)
{
  theme: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#0066cc',
        900: '#003d99',
      },
      secondary: {
        50: '#f5f3ff',
        500: '#7c3aed',
        900: '#4c1d95',
      },
      success: {
        500: '#22c55e',
      },
      warning: {
        500: '#eab308',
      },
      danger: {
        500: '#ef4444',
      },
      neutral: {
        50: '#f9fafb',
        500: '#6b7280',
        900: '#111827',
      },
    }
  }
}
```

## Typography

- **Headlines (H1-H3)**: Inter Bold, 24-32px
- **Body**: Inter Regular, 14-16px
- **Meta/Helper**: Inter Regular 12px, color `neutral-500`

## Base Components

### Forms

```typescript
// Example: Validated input with error message
<Input
  label="E-mail"
  type="email"
  required
  error={errors.email?.message}
  placeholder="user@company.com"
/>
```

**Rules:**
- Required field = red asterisk
- Error = red message below input
- Success = green icon/border (optional)

### Notifications/Toasts

```typescript
<Toast
  type="success"  // success | warning | error | info
  title="Product created"
  message="The product was successfully added to the library."
  action={{
    label: "View",
    onClick: () => navigate('/products/123')
  }}
/>
```

### Modals/Dialogs

- Keyboard: `Escape` to close
- Focus: trapped within modal
- Override: clickable backdrop to close (confirmation if changes exist)

### Loading

```typescript
// Skeleton in lists
<SkeletonLoader count={5} height={48} />

// Spinner in actions
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Save'}
</Button>
```

## Page Patterns

### Data Listing

```
┌─────────────────────────────────────────┐
│  Título + Descrição                     │
│  [Search...] | [Filters] | [+ New]    │
├─────────────────────────────────────────┤
│                                         │
│  Table with columns (sortable)         │
│  - Row highlighted on hover             │
│  - Checkbox for batch actions           │
│  - Main action: click on row            │
│                                         │
├─────────────────────────────────────────┤
│ Page 1 of 5 | [< | >] | 50 per page│
└─────────────────────────────────────────┘
```

### Create/Edit Form

```
┌─────────────────────────────────────────┐
│  Title (create vs. edit)              │
│  Form description                    │
├─────────────────────────────────────────┤
│                                         │
│  [Section 1]          [Section 2]           │
│  ├─ Field 1         ├─ Field A          │
│  ├─ Field 2         ├─ Field B          │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Expandable section (table, list)  │   │
│  └──────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel] ... [Save] | [Save+New]│
└─────────────────────────────────────────┘
```

## Page States

### Empty
- Large icon (illustration)
- Short title ("No products yet")
- Light description
- Primary CTA ("Create first product")

### Error
- Error icon (❌ or ⚠️)
- Friendly message
- Reason (ex. "Connection lost")
- CTA ("Try again")

### Loading
- Appropriate skeleton/spinner
- Do not change layout
- Placeholder similar to final content

## Form Validation

```typescript
// Integration with React Hook Form + Zod
<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    {...register("email", {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email"
      }
    })}
    error={errors.email?.message}
  />
  
  <Button type="submit" loading={isSubmitting}>
    Save
  </Button>
</form>
```

## Theming (Dark Mode)

```typescript
// Theme context
<ThemeProvider>
  <App />
</ThemeProvider>

// in components
const { theme, toggleTheme } = useTheme();

// Tailwind dark mode
// class="dark:bg-gray-900 dark:text-white"
```

## Responsiveness

| Device | Breakpoint | Cols | Behavior |
|--------|-----------|------|---|
| Mobile | < 640px | 1 | Stack vertical, full-width buttons |
| Tablet | 640-1024px | 2 | Collapsible sidebar |
| Desktop | > 1024px | 3-4 | Complete layout |

## Accessibility Testing

```bash
# Install jest-axe
npm install jest-axe

# in tests
import { axe } from 'jest-axe';

test('renders accessibly', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Critical Flows (Wireframes)

### Login
1. Email + password
2. "Forgot password?" link
3. Inline validation
4. Error: clear message
5. Success: redirect to dashboard

### Product CRUD
1. **List**: table with search + filters
2. **Create**: modal or dedicated page
3. **Edit**: in-place or modal
4. **Delete**: confirmation with warning

## Captura de Tela / Maquetes

```
docs/
├─ screenshots/
│  ├─ login.png
│  ├─ dashboard.png
│  ├─ product-list.png
│  ├─ product-detail.png
│  └─ transport-map.png
└─ wireframes/
   ├─ dashboard.pdf
   └─ mobile-flow.pdf
```

## Recursos

- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com/
- Headless UI: https://headlessui.com/
- Accessibility WCAG: https://www.w3.org/WAI/WCAG21/quickref/

---

**Design Coordinator:** [Your team]
**Last update:** December 2025
