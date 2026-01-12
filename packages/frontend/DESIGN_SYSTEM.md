# Store Detail Booking App - Design System & Rules

## Color System

### Theme Variables (OKLch Color Space)
**3-Color Palette**: Deep Navy primary + Neutral grays + Functional status colors.

#### Light Mode
- **Background**: Off-white cream `oklch(0.985 0.002 247.839)`
- **Foreground**: Deep charcoal `oklch(0.141 0.005 285.823)`
- **Primary**: Navy/Indigo `oklch(0.21 0.034 264.665)` - Buttons, links, interactive elements
- **Secondary**: Light gray `oklch(0.968 0.007 247.896)` - Subtle backgrounds
- **Destructive**: Red `oklch(0.577 0.245 27.325)` - Dangerous actions
- **Success**: Green `oklch(0.627 0.194 149.214)` - Confirmations
- **Warning**: Amber `oklch(0.795 0.184 86.047)` - Alerts

#### Dark Mode
- **Background**: Deep charcoal `oklch(0.141 0.005 285.823)`
- **Foreground**: Off-white `oklch(0.985 0 0)`
- **Primary**: White `oklch(0.985 0 0)`
- All status colors adapt for dark mode

### Color Usage Rules - MUST FOLLOW
1. ✅ **DO**: Use semantic color tokens (`bg-primary`, `text-destructive`, `border-border`)
2. ❌ **DON'T**: Use direct colors like `bg-white`, `text-black`, `border-zinc-400`
3. ✅ **DO**: Use status colors for meaningful feedback (success green, warning amber, destructive red)
4. ❌ **DON'T**: Use more than 5 colors total
5. ✅ **DO**: Ensure contrast ratios ≥ 4.5:1 for accessibility

---

## Typography

### Fonts
- **Sans Serif**: Geist (Google Font) - All body text and regular content
- **Monospace**: Geist Mono (Google Font) - Code, IDs, technical content
- **Maximum 2 fonts total** - No additional decorative fonts

### Text Size Hierarchy
- **Text-2xl (24px)**: Page titles ("Discover", "Profile")
- **Text-xl (20px)**: Card headers, important content
- **Text-lg (18px)**: Section titles, subheadings
- **Text-base (16px)**: Primary body text
- **Text-sm (14px)**: Secondary text, descriptions
- **Text-xs (12px)**: Labels, captions, metadata (minimum size)

### Line Height & Spacing
- **Body text**: `leading-relaxed` (1.625) - For readability
- **Headings**: `leading-tight` - For compact, impactful headers
- **Use `text-balance`** on titles for optimal line breaks

---

## Layout & Spacing

### Layout Method Priority
1. **Flexbox** (90% of layouts): `flex items-center justify-between`, `flex flex-col gap-4`
2. **CSS Grid**: Only for complex 2D layouts (minimal use)
3. **NEVER**: Use floats or absolute positioning for layouts

### Spacing Scale (Tailwind)
Use default Tailwind spacing (4px increments):
- `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px)
- `gap-2` (8px), `gap-3` (12px), `gap-4` (16px)
- `mt-4` (16px), `mb-6` (24px), etc.

### Spacing Rules - MUST FOLLOW
1. ✅ **DO**: Use Tailwind spacing scale (`p-4`, `gap-3`, `mt-6`)
2. ❌ **DON'T**: Use arbitrary values like `p-[16px]`, `gap-[12px]`
3. ✅ **DO**: Use `gap` for spacing between flex/grid children
4. ❌ **DON'T**: Mix `gap` and margin utilities on the same element
5. ✅ **DO**: Use responsive prefixes: `md:p-6`, `lg:gap-4`, `sm:flex-col`

### Mobile-First Responsive Design
- **Base styles**: Mobile (max-width 640px)
- **`sm:`**: 640px and up
- **`md:`**: 768px and up (desktop enhancements)
- **`lg:`**: 1024px and up
- **Max width**: `max-w-md` (28rem) container for mobile, expand for desktop with `lg:max-w-4xl`

### Container Structure (All Pages)
```
<div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
  {/* Sticky header */}
  <header className="sticky top-0 z-10 ...">
  
  {/* Main content with padding */}
  <main className="px-4 md:px-6 lg:px-8 space-y-6">
  
  {/* Bottom nav or spacer */}
  <BottomNav />
</div>
```

### Desktop Mode Requirements
- ✅ **Expand max-width**: Add `lg:max-w-4xl` to containers
- ✅ **Increase padding**: `md:px-6 lg:px-8`
- ✅ **Grid layouts**: Switch from single column to `md:grid-cols-2 lg:grid-cols-3`
- ✅ **Responsive fonts**: `md:text-lg lg:text-xl`
- ✅ **Spacing**: `md:gap-6 lg:gap-8`
- ❌ **DON'T**: Ignore desktop breakpoints - always include `md:` and `lg:` variants

---

## Component Patterns

### Cards
```
Standard card:
bg-white dark:bg-zinc-900
rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800

Elevated card (dashboard content):
bg-white dark:bg-zinc-900
rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800

Dark card (premium/featured):
bg-zinc-900 dark:bg-zinc-100
text-white dark:text-zinc-900
rounded-2xl shadow-xl
```

### Buttons
```
Primary button:
bg-zinc-900 dark:bg-white text-white dark:text-zinc-900

Secondary button:
variant="outline" border-border bg-transparent

Destructive button:
text-red-500 border-red-200 dark:border-red-900/30
hover:bg-red-50 dark:hover:bg-red-950/30 bg-transparent
```

### Interactive Elements
- **Border Radius**: `rounded-2xl` (16px) - Standard for cards, buttons, inputs
- **Shadows**: `shadow-sm` (subtle), `shadow-xl` (elevated)
- **Hover States**: `hover:scale-105`, `group-hover:opacity-100`
- **Transitions**: Always use `transition-all duration-300` for smooth interactions

### Header (Sticky Pattern)
```
bg-background sticky top-0 z-10
px-6 py-4 border-b border-border/50
backdrop-blur-xl bg-background/80
```

### Form Inputs
- Style: `bg-secondary/50 border-transparent focus-visible:bg-background transition-all`
- Always include placeholder text
- Use `Label` component for accessibility
- Consistent sizing with buttons

---

## Images & Media

### Image Guidelines
- Always include descriptive `alt` text
- Use `object-cover` for hero/card images
- Add `priority` for above-fold images
- Hover effect: `group-hover:scale-105 transition-transform duration-500`
- Use placeholder URLs: `/placeholder.svg?height=200&width=200&query=description`

### Responsive Images
- Mobile: Full width images with padding
- Desktop: Grid layouts with `md:grid-cols-2 lg:grid-cols-3`
- Never exceed container max-width

---

## Animations & Micro-interactions

### Available Effects
- **Live indicator**: `animate-ping` for pulsing red dots
- **Loading**: `animate-spin` for spinners
- **Entrance**: `animate-in slide-in-from-bottom-10 duration-500 fade-in`
- **Hover**: `hover:scale-105 transition-transform duration-500`

### Animation Rules
- ✅ **DO**: Use animations for status changes and interactions
- ❌ **DON'T**: Overuse animations - keep it subtle
- ✅ **DO**: Always include `transition-all duration-300` for smooth changes
- ❌ **DON'T**: Create animations that distract from content

---

## Accessibility

### Required Implementations
1. **Semantic HTML**: Use `<header>`, `<main>`, `<nav>`, `<footer>`
2. **ARIA Labels**: `aria-label` for icon buttons, `sr-only` for screen readers
3. **Color Contrast**: 4.5:1 minimum ratio (enforced via design tokens)
4. **Keyboard Navigation**: All interactive elements accessible via Tab key
5. **Alt Text**: All images except decorative ones need descriptive `alt` attributes

### Common Patterns
```
Icon button with sr-only text:
<button className="...">
  <Icon className="w-5 h-5" />
  <span className="sr-only">Close</span>
</button>

Screen reader only text:
<span className="sr-only">Loading content...</span>
```

---

## Mobile Responsiveness Checklist

Before marking any feature complete, verify:

- ✅ All text readable at 320px width (iPhone SE)
- ✅ Touch targets are minimum 44x44px
- ✅ No horizontal scrolling on any viewport
- ✅ Images scale properly with `max-w-md` container
- ✅ Inputs and buttons work on mobile
- ✅ Spacing uses `md:` and `lg:` prefixes for larger screens
- ✅ Bottom nav doesn't overlap content (`pb-24`)
- ✅ Sticky headers work without layout shift
- ✅ Forms are scrollable without hiding inputs
- ✅ Modals/sheets slide in from bottom

---

## Testing Breakpoints

Always test these viewport sizes:

```
Mobile (base):  320px   → iPhone SE
Tablet (sm):    640px   → iPad
Desktop (md):   768px   → Tablet landscape / Small desktop
Large (lg):     1024px  → Desktop
```

**Desktop Support**: Must include responsive styles at `md:` and `lg:` breakpoints for full desktop experience.

---

## Dark Mode

### Implementation
- Dark mode uses `dark:` prefix on all color classes
- Automatic switching based on system preference
- No additional configuration needed
- All design tokens support light and dark modes

### Dark Mode Pattern
```
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white">

<div className="border-zinc-200 dark:border-zinc-800">
```

---

## Common Design Mistakes to AVOID

### ❌ Color System Violations
- Using `bg-white`, `text-black`, `border-zinc-400` directly
- ✅ Use semantic tokens: `bg-background`, `text-foreground`, `border-border`

### ❌ Spacing Issues
- Mixing `gap` and margin: `flex gap-4 ml-2`
- Arbitrary values: `p-[18px]`
- ✅ Use Tailwind scale only: `p-4`, `gap-3`

### ❌ Responsive Design Failures
- Ignoring desktop breakpoints
- Only mobile styles without `md:` and `lg:`
- ✅ Always include: base (mobile) → `md:` (desktop) → `lg:` (large desktop)

### ❌ Typography Abuse
- Adding fonts beyond Geist Sans + Geist Mono
- Text smaller than 12px
- ✅ Use Geist fonts only, minimum `text-xs` (12px)

### ❌ Layout Mistakes
- Using absolute positioning for layouts
- Using floats for spacing
- ✅ Always use flexbox with `gap`

### ❌ Image Problems
- Missing `alt` text
- Using blob URLs in JSX
- ✅ Always use file paths and descriptive alt text

---

## Design System Enforcement

These 10 critical violations require code rework:

1. **Direct color usage** (bg-white, text-black) → Use semantic tokens
2. **Arbitrary spacing** (p-[16px]) → Use Tailwind scale
3. **No desktop support** (missing md:/lg: prefixes) → Add responsive styles
4. **Inconsistent shadows** → Use `shadow-sm` or `shadow-xl` only
5. **Wrong border radius** (rounded-lg instead of rounded-2xl) → Use `rounded-2xl`
6. **Mixed gap + margin** → Use gap only
7. **Extra fonts** (beyond Geist) → Remove custom fonts
8. **Broken accessibility** (missing alt text, no sr-only) → Add proper labels
9. **Hover without transition** → Always add `transition-all duration-300`
10. **Container width overflow** → Enforce `max-w-md lg:max-w-4xl`

---

## Design Rules Summary

### ✅ DO THIS
- Use semantic color tokens exclusively
- Mobile-first with `md:` and `lg:` enhancements
- Tailwind spacing scale (p-4, gap-3, mt-6)
- `rounded-2xl` for all rounded elements
- Flexbox for 90% of layouts
- ARIA labels and semantic HTML
- Dark mode prefix for all color classes
- Transitions on all interactive elements

### ❌ DON'T DO THIS
- Direct colors (bg-white, text-black)
- Arbitrary Tailwind values (p-[16px], gap-[12px])
- Absolute positioning for layouts
- Custom fonts beyond Geist
- Floats or margin-based spacing
- Missing alt text on images
- Ignoring responsive breakpoints
- Mixing gap and margin utilities
