# Future Plans

This document outlines upcoming features and design considerations for Morphu.

---

## 1. Responsive Preview Grid

### Description

Add a device preview feature that allows users to see how their profile will appear on different screen sizes before publishing. This helps users optimize their content layout for various devices.

### Key Features

- **Phone Preview**: Show a mobile-sized frame (e.g., 375×812px for iPhone) displaying the profile as it would appear on a smartphone
- **Tablet Preview**: Mid-sized frame for tablet displays
- **Desktop Preview**: Full-width preview for desktop browsers
- **Side-by-Side Comparison**: Option to view multiple device previews simultaneously
- **Interactive Preview**: Users should be able to scroll within each preview frame to see the full content

### Considerations

- Use realistic device frames/bezels for visual clarity
- Consider popular device breakpoints (iPhone, Android, iPad, etc.)
- Allow users to toggle between preview modes easily
- Preview should update in real-time as users make changes

---

## 2. Customizable Borders & Shapes with Vector Points

### Description

Expand the border styling system to support custom vector-based shapes. Instead of predefined border styles, users can manipulate control points to create unique, organic shapes for their posts and profile elements.

### Key Features

- **Vector Point Editing**: Draggable control points on post borders
- **Bezier Curve Handles**: Fine-tune curves between points for smooth or sharp edges
- **Preset Shape Library**: Collection of starter shapes (blob, wave, polygon, etc.) that users can further customize
- **Corner Radius Per Point**: Independent corner rounding for each vertex
- **SVG Export**: Allow users to save their custom shapes as SVG files

### Considerations

- Keep the UI intuitive—don't overwhelm users with too many controls at once
- Provide "snap to" functionality for alignment
- Consider performance implications of complex shapes on rendering
- Implement undo/redo for shape editing

---

## 3. Timeline / Feed Design

### Description

Design the content feed experience. The term "timeline" may need reconsideration since content might not be strictly chronological—Morphu could prioritize aesthetic curation over recency.

### Questions to Resolve

- **Is chronological order appropriate?** Or should the feed be curated by other factors?
- **What is the primary browsing experience?** Discovery vs. following specific users?
- **How does the feed integrate with the infinite canvas concept?**

### Potential Filter/Sort Options

- **By Style**: Filter posts by visual style, color palette, typography, etc.
- **By Content Type**: Text-heavy, image-focused, mixed media
- **By User**: Follow specific creators, view their complete works
- **By Tags/Categories**: User-applied or auto-detected categorization
- **By Engagement**: Popular, trending, or highly-rated content
- **By Recency**: Traditional chronological sorting (as an option)
- **By Color**: Browse content by dominant color or palette

### Layout Considerations

- Masonry grid vs. uniform grid vs. free-form arrangement
- Infinite scroll vs. paginated vs. canvas-based exploration
- How to handle posts of varying aspect ratios and sizes
- Preview vs. full-view states

---

## 4. Infinite Canvas Navigation

### Description

Implement an infinite canvas system where users can freely explore content in a 2D space rather than a traditional scrolling feed. This provides a more spatial, exploratory experience.

### Reference Applications

- **Miro**: Collaborative whiteboard with zoom, pan, and mini-map navigation
- **Excalidraw**: Lightweight canvas with intuitive controls
- **Figma**: Professional-grade infinite canvas with smooth performance
- **Apple Freeform**: Consumer-friendly canvas with gestures

### Key Features to Implement

- **Pan & Zoom**: Smooth, performant navigation across the canvas
  - Mouse drag to pan
  - Scroll wheel / pinch to zoom
  - Keyboard shortcuts (arrow keys, +/- for zoom)
- **Mini-Map**: Overview panel showing current viewport position on the canvas
- **Zoom Controls**: UI buttons for zoom in/out/reset
- **Spatial Organization**: Content clusters, zones, or neighborhoods
- **Navigation Landmarks**: Jump to specific areas or saved viewpoints
- **Search & Jump**: Find content and navigate directly to it

### Technical Considerations

- **Virtualization**: Only render content within or near the viewport
- **Level of Detail (LOD)**: Show simplified previews when zoomed out, full detail when zoomed in
- **Performance**: Canvas should remain smooth with thousands of posts
- **State Persistence**: Remember user's last position and zoom level
- **Touch Support**: Gesture controls for mobile/tablet (pinch zoom, two-finger pan)

### UX Questions

- How do users "place" new content on the canvas?
- Is there a default arrangement algorithm, or is placement manual?
- How do multiple users' content coexist on the same canvas?
- Should there be different canvas "spaces" or one global canvas?
- How does navigation differ between viewing your own profile vs. exploring others' content?

---

## Priority & Dependencies

| Feature | Priority | Dependencies |
|---------|----------|--------------|
| Responsive Preview Grid | Medium | None |
| Vector Border Shapes | Low | Border system refactor |
| Timeline/Feed Design | High | Requires UX decisions |
| Infinite Canvas | High | Performance infrastructure |
| Custom Icon System | Medium | Visual identity finalization |
| Normalized View Mode | High | Timeline/Feed Design |

---

## 5. Custom Icon System

### Description

Replace generic Lucide icons with custom-designed icons that better represent Morphu's unique concepts and visual identity. Custom icons will improve brand recognition and provide clearer visual communication for app-specific actions.

### Current Lucide Icons in Use

| Icon | Location | Purpose |
|------|----------|---------|
| `PenSquare` | Bottom Nav | Create post |
| `User` | Bottom Nav | Profile |
| `ChevronDown` | Font selector | Dropdown indicator |
| `GripHorizontal` | Preview resize | Drag handle |
| `MoveHorizontal/Vertical` | Padding selector | Axis indicators |
| `MoveUp/Down/Left/Right` | Padding selector | Direction indicators |
| `SquareDashed`, `PanelTopBottomDashed`, `PanelLeftDashed` | Padding selector | Mode toggles |
| `AlertTriangle` | Accessibility banner | Warning indicator |
| `CheckCircle` | Accessibility banner | Success indicator |
| `X` | Draggable post | Delete action |

### Icons to Design

#### Navigation & Core Actions
- **Post/Create**: Custom icon representing creative expression (brush stroke, shape, or abstract mark)
- **Profile/Canvas**: Icon suggesting a personal space or whiteboard
- **Home/Feed**: Icon for the timeline/discovery area (if implemented)

#### Post Styling Controls
- **Padding Modes**: Unified visual language for uniform/axes/individual padding
- **Text Orientation**: Clearer icons for horizontal vs. vertical text flow
- **Text Alignment**: Custom left/center/right alignment indicators
- **Border Style**: Icons for solid, dashed, dotted, double borders

#### Feedback & Status
- **Accessibility Warning**: Custom warning icon that fits the neo-brutalist style
- **Accessibility Pass**: Success indicator matching the brand
- **Delete**: Styled delete/remove action icon

#### Canvas Controls (Future)
- **Zoom In/Out**: Custom magnification icons
- **Pan/Move**: Hand or arrow-based pan indicator
- **Reset View**: Return to default position icon
- **Mini-map Toggle**: Icon for showing/hiding overview

### Design Guidelines

- **Style Consistency**: Match the neo-brutalist aesthetic with bold strokes and geometric shapes
- **Stroke Weight**: Use consistent 2-3px strokes to match border styling throughout the app
- **Grid System**: Design on a 24×24 or 20×20 pixel grid for crisp rendering
- **Monochrome First**: Icons should work in single color before adding fills
- **Scalability**: Ensure icons remain clear at small sizes (16px) and larger sizes (32px+)

### Implementation Approach

1. **SVG Components**: Create Svelte components for each icon
2. **Icon Library**: Organize in `$lib/components/icons/` directory
3. **Props Interface**: Support `size`, `class`, and `strokeWidth` props for flexibility
4. **Gradual Migration**: Replace Lucide icons incrementally, starting with navigation

### Example Component Structure

```svelte
<!-- $lib/components/icons/PostIcon.svelte -->
<script lang="ts">
  interface Props {
    size?: number;
    class?: string;
  }
  let { size = 24, class: className = '' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <!-- Custom path data -->
</svg>
```

### Considerations

- Maintain accessibility with proper `aria-label` or `title` elements
- Consider animated states for interactive icons (hover, active)
- Export icons as standalone SVG files for use outside the app
- Document icon meanings in a visual icon reference sheet

---

## 6. Normalized View Mode (Reader-Friendly Feed)

### Description

Modern UI/UX relies heavily on visually structured, predictable data. When users have full creative freedom over their post appearance, it creates challenges for viewers browsing a feed of diverse content. A **Normalized View** provides guardrails that ensure comfortable reading while preserving the creator's full expression on their profile page.

### The Problem

| Creator Freedom | Viewer Challenges |
|-----------------|-------------------|
| Custom colors | Low contrast, eye strain |
| Varied text sizes | Inconsistent scanning, hierarchy confusion |
| Unique fonts | Readability issues, slow parsing |
| Creative layouts | Unpredictable content flow |
| Wild border shapes | Visual chaos in aggregate |

When every post looks radically different, the cognitive load on viewers increases significantly. Users may skip content not because it's uninteresting, but because it's visually exhausting to parse.

### Proposed Solution: Dual View System

#### 1. Creative View (Profile Page)
- Full creative expression preserved
- User's intended styling displayed exactly as designed
- Canvas/whiteboard layout with free positioning
- This is the "gallery" experience—intentional, curated

#### 2. Normalized View (Feed/Timeline)
- Consistent, readable styling applied to all posts
- Predictable layout and spacing
- Comfortable for extended browsing sessions
- Click/tap to expand into full creative view

### Normalized View Specifications

#### Typography Normalization
| Property | Normalized Value | Reasoning |
|----------|------------------|-----------|
| Font Family | System UI or app default | Consistent readability |
| Font Size | 16px (body), 14px (metadata) | Optimal reading size |
| Font Weight | 400-500 | Balanced legibility |
| Line Height | 1.5–1.6 | Comfortable reading |
| Text Color | High contrast (4.5:1 minimum) | WCAG compliance |

#### Layout Normalization
| Property | Normalized Value | Reasoning |
|----------|------------------|-----------|
| Background | Neutral (matches feed bg or subtle tint) | Visual consistency |
| Padding | Consistent 16-24px | Predictable content bounds |
| Border | Subtle or none | Reduced visual noise |
| Max Width | Constrained (e.g., 600px) | Optimal line length |
| Spacing | Uniform gaps between posts | Scannable flow |

#### What Gets Preserved
- **Content**: The actual text/media is unchanged
- **Content Structure**: Paragraphs, line breaks maintained
- **Creator Attribution**: Username, profile link, timestamp
- **Interaction Cues**: Like, comment, share affordances
- **Creative Preview Hint**: Small indicator showing "styled post" or thumbnail of original design

### User Experience Flow

```
[Feed/Timeline - Normalized View]
        │
        ├── Scan comfortably through many posts
        │
        ├── See content clearly with consistent styling
        │
        └── Tap/click post
                │
                ▼
        [Expanded View - Creative Mode]
                │
                ├── Full creative styling revealed
                │
                ├── See post as creator intended
                │
                └── Option to visit creator's profile/canvas
```

### Toggle Behavior

Users should be able to:
- **Global Preference**: Set default view mode in settings
- **Per-Session Toggle**: Switch between normalized/creative in feed header
- **Per-Post Expansion**: Always expand individual posts to creative view

### Visual Indicator for Styled Posts

In normalized view, posts with custom styling should show a subtle indicator:
- Small icon or badge (e.g., paint palette, sparkle)
- Tooltip: "This post has custom styling—tap to view"
- Thumbnail preview of creative version on hover (desktop)

### Implementation Considerations

#### Data Architecture
Posts already store full styling data. Normalized view simply ignores it during render:

```typescript
interface PostRenderOptions {
  mode: 'creative' | 'normalized';
}

// Normalized mode applies default styles regardless of post.style
function renderPost(post: PostData, options: PostRenderOptions) {
  if (options.mode === 'normalized') {
    return renderWithDefaults(post.content);
  }
  return renderWithStyle(post.content, post.style);
}
```

#### Performance Benefits
- Normalized view can be more performant (no custom font loading, simpler CSS)
- Creative view loads on-demand when user expands
- Reduces initial paint complexity for feed

#### Accessibility Alignment
- Normalized view naturally enforces accessibility standards
- Users with visual impairments may prefer normalized as default
- Complements existing accessibility checker (checker warns during creation, normalized view protects during consumption)

### Open Questions

1. **Hybrid Approach?** Should normalized view preserve *some* styling (e.g., background color as a subtle tint)?
2. **Creator Opt-Out?** Can creators mark posts as "display in creative mode only"?
3. **Feed Algorithm Impact?** Does creative effort factor into feed ranking/visibility?
4. **Transition Animation?** How does the shift from normalized → creative feel?

### Reference Patterns

- **Twitter/X**: All tweets look the same, media is the variable
- **Tumblr**: Has some theme customization but dashboard is normalized
- **Email Clients**: "Reader View" strips formatting for readability
- **Browser Reader Mode**: Safari/Firefox strip page styling for articles
- **Are.na**: Blocks have consistent framing, content varies

---

## Notes

- Timeline and Infinite Canvas features may need to be designed together as they both address the core content browsing experience
- Consider user testing for the canvas navigation—spatial interfaces can have a learning curve
- Mobile-first approach may influence which features are prioritized
- Custom icons should be designed alongside or after the core visual identity is finalized
- **The tension between creative freedom and viewer comfort is central to Morphu's identity**—the normalized view is not about limiting creativity, but about creating appropriate contexts for different browsing intents
