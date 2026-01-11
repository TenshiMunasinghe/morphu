# UI/UX Report: Morphu

This document outlines the UI/UX considerations implemented throughout the Morphu application, covering accessibility features, design patterns, and user experience optimizations.

---

## Table of Contents

1. [Accessibility Features](#accessibility-features)
2. [Responsive Design](#responsive-design)
3. [Interactive Feedback](#interactive-feedback)
4. [Form UX Patterns](#form-ux-patterns)
5. [Navigation & Wayfinding](#navigation--wayfinding)
6. [Visual Design System](#visual-design-system)
7. [Performance Considerations](#performance-considerations)

---

## Accessibility Features

### Real-Time Accessibility Checking

Morphu includes a built-in accessibility checker that analyzes post styling in real-time and warns users about potential readability issues before they publish.

#### WCAG Color Contrast Validation

The app implements the WCAG 2.1 contrast ratio formula to ensure text is readable against its background:

```typescript
// From accessibility.ts
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
```

**Contrast Requirements:**
| Text Type | Minimum Ratio |
|-----------|---------------|
| Large text (≥18px or ≥14px bold) | 3:1 |
| Normal text | 4.5:1 |

#### Text Size Warnings

- Warns when text size falls below 12px ("may be difficult to read")
- Warns when light font weight (300) is combined with small text (<16px)

#### Accessibility Banner Component

The `AccessibilityBanner` component displays contextual feedback:

- **Green state**: "Looks good!" with a checkmark icon when all checks pass
- **Red state**: Lists specific warnings with alert icon when issues are detected

```svelte
<div class="... {hasWarnings ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
  {#if hasWarnings}
    <AlertTriangle class="..." />
    <!-- Warning messages -->
  {:else}
    <CheckCircle class="..." />
    <span>Looks good!</span>
  {/if}
</div>
```

#### Submission Warning Flow

When users attempt to submit a post with accessibility warnings:

1. A confirmation dialog lists all warnings
2. Users must explicitly acknowledge and choose to proceed
3. This prevents accidental publication of inaccessible content

### Semantic HTML & ARIA

#### Proper Role Assignments

- Checkbox buttons use `role="checkbox"` with `aria-checked` state
- Custom dropdowns use `aria-expanded` and `aria-haspopup="listbox"`
- Delete buttons include `aria-label="Delete post"`
- Draggable posts use appropriate `role="button"` or `role="article"` based on functionality

#### Keyboard Navigation

- Profile posts support `Enter` and `Space` key activation
- Tab navigation is properly managed with `tabindex` attributes
- Interactive elements maintain focus visibility

---

## Responsive Design

### Mobile-First Approach

The application implements a mobile-first design strategy with distinct layouts for different screen sizes.

#### Mobile Layout (< 1024px)

- **Sticky Preview**: Post preview stays at the top of the viewport for constant visibility
- **Resizable Preview Area**: Users can drag to adjust preview height (100px–700px range)
- **Full-width Form**: Controls are stacked vertically for easy thumb access
- **Touch-Optimized**: Resize handle supports both mouse and touch events

```svelte
<!-- Mobile: Sticky preview with resize handle -->
<div class="sticky top-0 z-50 w-full" style:height="{previewHeight}px">
  <!-- Preview content -->
  <button
    class="... cursor-ns-resize"
    onmousedown={startResize}
    ontouchstart={startResize}
    aria-label="Resize preview vertically"
  >
    <GripHorizontal />
  </button>
</div>
```

#### Desktop Layout (≥ 1024px)

- **Split-Screen View**: 50/50 split between preview and form
- **Side-by-Side Editing**: See changes instantly without scrolling
- **Full Height Utilization**: Uses `h-screen` for immersive editing experience

```svelte
<div class="hidden h-screen lg:flex">
  <div class="w-1/2"><!-- Preview --></div>
  <div class="w-1/2"><!-- Form --></div>
</div>
```

### Adaptive Spacing

| Context | Mobile | Desktop |
|---------|--------|---------|
| Container Padding | `p-4` to `p-6` | `p-8` |
| Preview Padding | `p-4` | `p-8` |
| Form Max Width | `max-w-2xl` | `max-w-md` |

---

## Interactive Feedback

### Visual State Changes

#### Hover Effects

Interactive elements provide clear hover feedback:

- **Color Pickers**: Shadow lifts on hover (`hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`)
- **Slider Thumbs**: Same lift effect for tactile feedback
- **Buttons**: Consistent hover state transitions

#### Selection States

Toggle buttons clearly indicate active state:

```svelte
<Button variant={fontWeight === '300' ? 'default' : 'outline'}>
  Light
</Button>
```

- **Active**: Filled primary color (`variant="default"`)
- **Inactive**: Outlined style (`variant="outline"`)

### Drag & Drop Feedback

#### Draggable Posts

- **Cursor Change**: `cursor-grab` at rest, `cursor-grabbing` when active
- **Z-Index Management**: Dragged items automatically come to front
- **Bounds Clamping**: Posts cannot be dragged outside canvas area
- **Touch Support**: `touch-action: none` for smooth mobile dragging

```css
.draggable-post {
  touch-action: none;
  user-select: none;
}
```

#### Delete Confirmation

- Delete button appears only on hover (reduces visual clutter)
- Confirmation dialog prevents accidental deletions
- Clear visual indicator (red button with X icon)

---

## Form UX Patterns

### Progressive Disclosure

#### Padding Selector

The padding control uses a three-mode system to match user needs:

1. **Uniform Mode**: Single slider for all sides (simplest)
2. **Axes Mode**: Separate X/Y controls (default, balanced)
3. **Individual Mode**: Four separate controls (most control)

Users can cycle through modes via an icon button, revealing complexity only when needed.

```svelte
{#if state === 'uniform'}
  <!-- Single slider -->
{:else if state === 'axes'}
  <!-- X and Y sliders -->
{:else if state === 'individual'}
  <!-- Top, Right, Bottom, Left sliders -->
{/if}
```

### Real-Time Preview

All form controls update the post preview instantly:

- **No Save Button Required**: Changes are immediately visible
- **Editable Content**: Post text can be edited directly in the preview
- **Live Accessibility Feedback**: Banner updates as styling changes

### Intuitive Controls

#### Font Family Dropdown

- Custom dropdown shows fonts in their actual typeface
- Click-outside detection closes dropdown automatically
- Selected font is visually highlighted

#### Slider Controls

- Consistent step values (2px increments for most)
- Reasonable min/max ranges based on context
- Clear labels with associated controls via `id` attributes

---

## Navigation & Wayfinding

### Bottom Navigation Bar

Fixed bottom navigation provides constant access to core areas:

```svelte
<nav class="fixed bottom-0 left-0 right-0 z-50 h-16 ...">
  <a href="/">
    <PenSquare />
    <span>Post</span>
  </a>
  <a href="/profile">
    <User />
    <span>Profile</span>
  </a>
</nav>
```

- **Fixed Position**: Always accessible regardless of scroll position
- **Icon + Label**: Clear identification of each section
- **Active State**: Primary color highlights current page
- **Touch Targets**: Full flex-1 width for easy tapping

### Content Layout Padding

Main content includes `pb-16` to prevent bottom nav overlap:

```svelte
<div class="pb-16">
  {@render children()}
</div>
```

---

## Visual Design System

### Color Palette

The app uses oklch color space for perceptually uniform colors with light/dark mode support:

#### Light Mode
- **Background**: Teal-tinted light gray (`oklch(95.08% 0.0481 184.07)`)
- **Primary**: Teal accent (`oklch(78.57% 0.1422 180.36)`)
- **Foreground**: Pure black for maximum contrast

#### Dark Mode
- **Background**: Dark teal (`oklch(22.65% 0.0236 198.49)`)
- **Primary**: Adjusted teal for dark backgrounds
- **Foreground**: Near-white for readability

### Typography Scale

- **Headings**: `font-heading` (weight: 700) for section titles
- **Body**: `font-base` (weight: 500) for comfortable reading
- **Labels**: `text-sm font-heading` for form controls

### Consistent Shadows

Neo-brutalist shadow system creates depth:

```css
--shadow: 2px 2px 0px 0px var(--border);
```

Interactive elements lift (remove shadow) on hover/focus for tactile feedback.

### Whiteboard Background

Visual grid pattern aids spatial orientation:

```css
.whiteboard {
  background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
  background-size: 24px 24px;
}
```

---

## Performance Considerations

### Efficient Reactivity

- **Derived Values**: Computed properties update only when dependencies change
- **Local State Management**: Whiteboard uses override maps to minimize re-renders
- **Effect Cleanup**: Click-outside listeners are properly removed

### Canvas Optimization

- **Position Clamping**: Prevents posts from leaving visible bounds
- **Z-Index Tracking**: Maintains stacking order without full re-sorts
- **Bounded Dragging**: Uses parent bounds to constrain movement

### XSS Prevention

Post content uses `innerText` instead of `innerHTML`:

```svelte
$effect(() => {
  if (containerEl && !editable) {
    containerEl.innerText = content;  // XSS-safe
  }
});
```

---

## Summary

Morphu implements a comprehensive UI/UX strategy that prioritizes:

1. **Accessibility**: WCAG-compliant contrast checking, semantic HTML, keyboard navigation
2. **Responsiveness**: Mobile-first design with adaptive layouts
3. **Feedback**: Clear visual states, real-time preview, confirmation dialogs
4. **Simplicity**: Progressive disclosure, intuitive controls, minimal cognitive load
5. **Consistency**: Unified design system with predictable patterns

These considerations ensure the app is usable by a wide audience while maintaining a polished, modern aesthetic.
