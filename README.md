# Morphu

A creative social media platform that empowers users to design highly customizable posts with extensive styling options. Create, arrange, and share content on an infinite whiteboard canvas with real-time accessibility checking.

## Features

### 🎨 Creative Post Design
- **Typography Control**: Custom fonts, sizes, weights, styles, and text orientation
- **Color Customization**: Full control over text and background colors with live preview
- **Border Styling**: Adjustable border width, color, style, and corner radius
- **Spacing Control**: Flexible padding system (uniform, axes-based, or per-side)
- **Text Alignment**: Left, center, right, and justify options
- **Live Preview**: See your changes in real-time as you design

### ♿ Accessibility First
- **Real-time Accessibility Checking**: WCAG 2.1 contrast ratio validation
- **Text Size Warnings**: Alerts for potentially unreadable text sizes
- **Font Weight Validation**: Warnings for light fonts on small text
- **Submission Warnings**: Confirmation dialogs prevent publishing inaccessible content

### 🖼️ Whiteboard Canvas
- **Drag & Drop**: Freely position posts on an infinite canvas
- **Profile View**: Arrange your posts in a personalized whiteboard layout
- **Touch Support**: Full mobile gesture support for dragging
- **Persistent Layout**: Your post arrangements are saved automatically

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layouts**: Form and preview adapt to screen size
- **Touch-Friendly**: All controls work seamlessly on mobile devices

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) (runes mode)
- **Language**: TypeScript (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom theme
- **UI Components**: [shadcn-svelte](https://www.shadcn-svelte.com/) (bits-ui primitives)
- **Icons**: [Lucide Svelte](https://lucide.dev/guide/packages/lucide-svelte)
- **Drag & Drop**: [@neodrag/svelte](https://www.neodrag.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.5 or later)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd morphu
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run check` - Run Svelte type checking
- `bun run check:watch` - Run type checking in watch mode
- `bun run format` - Format code with Prettier
- `bun run lint` - Run ESLint and Prettier checks

### Code Style

This project follows strict code style conventions. See [AGENTS.md](./AGENTS.md) for detailed guidelines on:
- Svelte component structure
- TypeScript patterns
- Tailwind CSS usage
- Import organization
- Naming conventions

### Project Structure

```
src/
├── components/          # App-specific components
│   ├── postForm.svelte # Main post creation form
│   ├── post.svelte     # Post display component
│   └── whiteboard/     # Whiteboard canvas components
├── lib/
│   ├── components/ui/  # shadcn-svelte UI components
│   ├── lib/            # Utility functions
│   ├── stores/         # Svelte stores (posts, state)
│   └── types/          # TypeScript type definitions
└── routes/             # SvelteKit routes
    ├── +page.svelte    # Home page (post creation)
    └── profile/        # Profile page (whiteboard view)
```

## Design System

### Color Palette

The app uses a custom color system based on oklch color space:

- **Background**: Teal-tinted light gray with high contrast text
- **Primary**: Teal accent color for interactive elements
- **Neo-brutalist Shadows**: 2px offset shadows for depth and tactile feedback

### Typography

- **Headings**: Bold (700 weight) with custom font family
- **Body**: Medium (500 weight) for optimal readability
- **Labels**: Small, semibold for form controls

### Spacing

Consistent spacing scale used throughout:
- Major sections: `gap-8`
- Form controls: `gap-3` to `gap-4`
- Button groups: `gap-2`
- Container padding: `p-2` to `p-8` (responsive)

## Data Storage

Currently, posts and whiteboard state are stored in browser `localStorage`. This means:
- Data persists across sessions
- Data is browser-specific (not synced across devices)
- Data is cleared when browser data is cleared

## Future Plans

See [FUTURE_PLANS.md](./FUTURE_PLANS.md) for upcoming features including:
- Responsive preview grid
- Infinite canvas navigation
- Timeline/feed design
- Custom icon system
- Normalized view mode

## Documentation

- [AGENTS.md](./AGENTS.md) - Code style and development guidelines
- [UI_UX_REPORT.md](./UI_UX_REPORT.md) - UI/UX design patterns and accessibility features
- [FUTURE_PLANS.md](./FUTURE_PLANS.md) - Planned features and design considerations

