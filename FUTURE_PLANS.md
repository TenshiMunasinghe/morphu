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

---

## Notes

- Timeline and Infinite Canvas features may need to be designed together as they both address the core content browsing experience
- Consider user testing for the canvas navigation—spatial interfaces can have a learning curve
- Mobile-first approach may influence which features are prioritized
