# 🎨 UI/UX DESIGN SYSTEM

Tutor Be Betea (በቤቴ) shared visual language. Live tokens are implemented in:

- `frontend/app/globals.css`
- `frontend/tailwind.config.js`
- `frontend/components/ui/`

---

## Colors

### Primary Colors

| Token | Value |
|-------|-------|
| `--primary-solid` | `#22c55e` |
| `--primary-dark` | `#16a34a` |
| `--primary-light` | `#86efac` |

### Secondary Colors

| Token | Value |
|-------|-------|
| `--secondary-solid` | `#3b82f6` |
| `--secondary-dark` | `#2563eb` |
| `--secondary-light` | `#93c5fd` |

### Accent Colors

| Token | Value |
|-------|-------|
| `--accent-solid` | `#f97316` |
| `--accent-dark` | `#ea580c` |
| `--accent-light` | `#fdba74` |

### Neutral Colors

| Token | Value |
|-------|-------|
| `--gray-50` … `--gray-900` | `#f9fafb` … `#111827` |

### Semantic Colors

| Token | Value |
|-------|-------|
| `--success` | `#22c55e` |
| `--warning` | `#f59e0b` |
| `--error` | `#ef4444` |
| `--info` | `#3b82f6` |

Tailwind aliases: `tutor-green-*`, `tutor-blue-*`, `tutor-orange-*`.

---

## Typography

### Font Families

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'Poppins', system-ui, sans-serif;
```

### Font Sizes

`--text-xs` (0.75rem) through `--text-5xl` (3rem)

### Font Weights

`--font-light` (300) through `--font-extrabold` (800)

---

## Spacing

`--space-1` (0.25rem) through `--space-32` (8rem)

---

## Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.25rem` |
| `--radius-md` | `0.5rem` |
| `--radius-lg` | `0.75rem` |
| `--radius-xl` | `1rem` |
| `--radius-2xl` | `1.5rem` |
| `--radius-full` | `9999px` |

---

## Shadows

`--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`

Utility classes: `.shadow-soft`, `.shadow-card`, `.glass-effect`, `.text-gradient`, `.card-hover`

---

## Components

Reusable primitives live in `frontend/components/ui/` (button, input, card, dialog, tabs, etc.). Prefer those over one-off styles when building new screens.
