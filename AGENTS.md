# AGENTS.md

This document describes the code style conventions and UI design patterns used in the Morphu codebase.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5 (runes mode)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: shadcn-svelte (bits-ui primitives)
- **Icons**: Lucide Svelte
- **Package Manager**: Bun

## Code Style Rules

### General TypeScript/JavaScript

- Use tabs for indentation
- Use single quotes for strings
- No trailing commas
- Max line width: 100 characters
- Use ES modules (`type: "module"`)

### Svelte Components

#### Script Tag Structure

```svelte
<script lang="ts">
	// 1. Imports (external libraries first, then local)
	import Component from '$lib/components/ui/component.svelte';
	import { Icon } from 'lucide-svelte';

	// 2. Type definitions and exports
	interface Props {
		prop1: string;
		prop2?: number;
	}

	// 3. Props destructuring with defaults
	let {
		prop1,
		prop2 = 'default'
	}: Props = $props();

	// 4. State declarations
	let localState = $state('initial');

	// 5. Derived values
	let derivedValue = $derived(`${localState}px`);

	// 6. Functions
	function handleAction() {
		// ...
	}

	// 7. Effects (if needed)
	$effect(() => {
		// ...
	});
</script>
```

#### Svelte 5 Runes

- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$props()` for component props with destructuring
- Use `$effect()` for side effects
- Use `$bindable()` for two-way bound props
- Use `{@render children?.()}` for slot content

#### Component Props Pattern

```svelte
<script lang="ts">
	interface Props {
		required: string;
		optional?: number;
	}

	let { required, optional = 10 }: Props = $props();
</script>
```

For callback props:

```svelte
<script lang="ts">
	const {
		value,
		onChange
	}: {
		value: string;
		onChange: (newValue: string) => void;
	} = $props();
</script>
```

### Import Aliases

- `$lib` → `src/lib`
- `$lib/components/ui` → UI components (shadcn-svelte)
- `$lib/lib/utils` → Utility functions (`cn`, type helpers)

### File Organization

```
src/
├── components/          # App-specific components
│   └── componentName.svelte
├── lib/
│   ├── components/ui/   # shadcn-svelte UI components
│   │   └── component/
│   │       ├── component.svelte
│   │       └── index.ts
│   └── lib/
│       └── utils.ts     # cn() and type utilities
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    └── layout.css       # Global styles and Tailwind config
```

### Naming Conventions

- **Files**: camelCase for components (`postForm.svelte`, `paddingSelector.svelte`)
- **Types**: PascalCase (`TextAlignment`, `TextOrientation`)
- **Variables/Functions**: camelCase (`handleClick`, `updateAxis`)
- **CSS Classes**: Tailwind utility classes or kebab-case for custom classes (`post-container`)

## UI Style Rules

### Spacing System

Use Tailwind's spacing scale consistently:

| Context | Spacing |
|---------|---------|
| Between major form sections | `gap-8` |
| Between label and control | `gap-3` |
| Within button groups | `gap-2` |
| Grid column gaps | `gap-4` |
| Separator margins | `my-4` |
| Container padding (mobile) | `p-2` to `p-6` |
| Container padding (desktop) | `p-8` |

### Layout Patterns

#### Mobile-First Responsive Design

```svelte
<div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
	<!-- Content adapts from stacked (mobile) to side-by-side (desktop) -->
</div>
```

#### Form Control Layout

- Use `grid grid-cols-2` for label + control pairs
- Add `items-center` for vertical alignment with sliders
- Full-width controls: wrap in `flex flex-col gap-3`

```svelte
<!-- Inline label + control -->
<div class="grid grid-cols-2 items-center gap-4">
	<label class="text-sm font-semibold text-gray-700">Label</label>
	<Slider ... />
</div>

<!-- Stacked label + control -->
<div class="flex flex-col gap-3">
	<label class="text-sm font-semibold text-gray-700">Label</label>
	<div class="flex gap-2">
		<!-- buttons or controls -->
	</div>
</div>
```

### Color Palette

#### CSS Custom Properties (oklch color space)

```css
/* Light mode */
--background: oklch(95.08% 0.0481 184.07);    /* Teal-tinted light gray */
--foreground: oklch(0% 0 0);                   /* Black */
--primary: oklch(78.57% 0.1422 180.36);        /* Teal */
--border: oklch(0% 0 0);                       /* Black */

/* Dark mode */
--background: oklch(22.65% 0.0236 198.49);    /* Dark teal */
--foreground: oklch(92.49% 0 0);               /* Near white */
```

#### Semantic Colors

- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-background` - Page background
- `text-gray-700` - Labels and secondary text
- `bg-gray-50` - Preview/content areas
- `bg-white` - Cards and form containers

### Typography

- **Headings**: `font-heading` (weight: 700)
- **Body**: `font-base` (weight: 500)
- **Labels**: `text-sm font-semibold text-gray-700`
- **Section headings**: `text-lg font-bold`

### Component Patterns

#### Buttons

Use shadcn-svelte Button with variants:

```svelte
<!-- Primary action -->
<Button variant="default">Action</Button>

<!-- Secondary/toggle (inactive) -->
<Button variant="outline">Option</Button>

<!-- Toggle pattern -->
<Button variant={isActive ? 'default' : 'outline'}>
	Toggle
</Button>
```

Button sizes: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`

#### Toggle Button Groups

```svelte
<div class="flex gap-2">
	{#each options as option}
		<Button
			variant={selected === option.value ? 'default' : 'outline'}
			onclick={() => (selected = option.value)}
			class="flex-1"
		>
			{option.label}
		</Button>
	{/each}
</div>
```

#### Icon-Only Buttons

```svelte
<Button onclick={handleAction}>
	<IconComponent />
</Button>
```

#### Custom Dropdowns

For custom select dropdowns (not using native select):

```svelte
<div class="font-select-container relative flex flex-col gap-3">
	<label class="text-sm font-semibold text-gray-700">Label</label>
	<Button
		variant="outline"
		class="flex w-full items-center justify-between"
		onclick={toggleOpen}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<span class="flex-1 text-left">{selectedLabel}</span>
		<ChevronDown />
	</Button>
	{#if isOpen}
		<div class="absolute top-[calc(100%+4px)] ... z-50">
			<!-- dropdown items -->
		</div>
	{/if}
</div>
```

**Important**: Add a unique container class (e.g., `font-select-container`) for click-outside detection.

#### Sliders

```svelte
<Slider
	type="single"
	bind:value={numericValue}
	min={0}
	max={100}
	step={2}
/>
```

### Shadows and Borders

- Card shadows: `shadow-md` or custom `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`
- Border radius: `rounded-md`, `rounded-lg`, `rounded-xl`
- Focus rings: Handled automatically by shadcn-svelte components

### Responsive Breakpoints

Follow Tailwind's breakpoint system:

- Default: Mobile styles
- `lg:` (1024px+): Desktop styles

```svelte
<div class="p-2 lg:p-8">
	<!-- 8px padding on mobile, 32px on desktop -->
</div>
```

### Z-Index Layers

- Sticky headers: `z-10`
- Dropdowns/popovers: `z-50`
- Overlays: Use semantic values

## Utility Functions

### `cn()` - Class Name Merger

Combines clsx and tailwind-merge for conditional class handling:

```svelte
<div class={cn(
	"base-classes",
	condition && "conditional-class",
	className
)}>
```

### Type Helpers

```typescript
// Remove child/children props (for wrapper components)
type WithoutChild<T>
type WithoutChildren<T>
type WithoutChildrenOrChild<T>

// Add ref prop for element binding
type WithElementRef<T, U extends HTMLElement>
```

## Linting & Formatting

Run before committing:

```bash
bun run format   # Prettier formatting
bun run lint     # ESLint + Prettier check
bun run check    # Svelte type checking
```
