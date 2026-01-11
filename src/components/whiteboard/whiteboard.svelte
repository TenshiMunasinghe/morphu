<script lang="ts">
	import DraggablePost from './draggablePost.svelte';
	import ProfileIcon from './profileIcon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ZoomIn, ZoomOut, Maximize } from 'lucide-svelte';
	import type { PostData } from '$lib/types/post';
	import type { WhiteboardState, UserProfile, PostPlacement } from '$lib/types/whiteboard';

	interface Props {
		posts: PostData[];
		demoPostIds?: Set<string>;
		initialState?: WhiteboardState;
		profile: UserProfile;
		onStateChange?: (state: WhiteboardState) => void;
		onDeletePost?: (postId: string) => void;
	}

	let {
		posts,
		demoPostIds = new Set(),
		initialState,
		profile,
		onStateChange,
		onDeletePost
	}: Props = $props();

	// Internal state for placements (mutable)
	let localPlacements = $state<PostPlacement[]>([]);
	let localMaxZIndex = $state(1);

	// Zoom state
	let zoom = $state(1);
	const ZOOM_STEP = 0.1;
	const MAX_ZOOM = 2;

	// Sync with initialState when it changes
	$effect(() => {
		if (initialState?.placements) {
			localPlacements = [...initialState.placements];
			localMaxZIndex = Math.max(1, ...initialState.placements.map((p) => p.zIndex || 1));
		}
	});

	// Calculate content bounds (actual extent of posts)
	let contentBounds = $derived.by(() => {
		const POST_SIZE = 400; // Approximate max post size
		const PADDING = 100; // Extra space around posts

		if (localPlacements.length === 0) {
			return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
		}

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (const placement of localPlacements) {
			minX = Math.min(minX, placement.x);
			minY = Math.min(minY, placement.y);
			maxX = Math.max(maxX, placement.x + POST_SIZE);
			maxY = Math.max(maxY, placement.y + POST_SIZE);
		}

		// Add padding
		minX -= PADDING;
		minY -= PADDING;
		maxX += PADDING;
		maxY += PADDING;

		return {
			minX,
			minY,
			maxX,
			maxY,
			width: maxX - minX,
			height: maxY - minY
		};
	});

	// Calculate minimum zoom to fit all posts in viewport
	let minZoom = $derived.by(() => {
		const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

		const scaleX = viewportWidth / contentBounds.width;
		const scaleY = viewportHeight / contentBounds.height;

		// Use the smaller scale to fit everything, but cap at 1 (no zoom in beyond 100%)
		return Math.min(1, scaleX, scaleY);
	});

	// Calculate canvas bounds based on post positions and zoom
	let canvasBounds = $derived.by(() => {
		const MIN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const MIN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800;

		// Offset to shift everything into positive space
		const offsetX = contentBounds.minX < 0 ? -contentBounds.minX : 0;
		const offsetY = contentBounds.minY < 0 ? -contentBounds.minY : 0;

		// Scale content size by zoom
		const scaledWidth = contentBounds.width * zoom;
		const scaledHeight = contentBounds.height * zoom;

		return {
			width: Math.max(MIN_WIDTH, scaledWidth),
			height: Math.max(MIN_HEIGHT, scaledHeight),
			offsetX,
			offsetY
		};
	});

	// Zoom controls
	function zoomIn() {
		zoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP);
	}

	function zoomOut() {
		zoom = Math.max(minZoom, zoom - ZOOM_STEP);
	}

	function zoomToFit() {
		zoom = minZoom;
	}

	function resetZoom() {
		zoom = 1;
	}

	// Get position for a post, with fallback to default grid position
	function getPlacement(postId: string, index: number): PostPlacement {
		const existing = localPlacements.find((p) => p.postId === postId);
		if (existing) {
			return existing;
		}
		// Default position: grid layout for new posts
		const col = index % 3;
		const row = Math.floor(index / 3);
		return {
			postId,
			x: 100 + col * 300,
			y: 120 + row * 250,
			zIndex: index + 1
		};
	}

	function handlePositionChange(postId: string, x: number, y: number) {
		const existingIndex = localPlacements.findIndex((p) => p.postId === postId);
		const placement: PostPlacement = {
			postId,
			x,
			y,
			zIndex: localPlacements[existingIndex]?.zIndex || localMaxZIndex
		};

		if (existingIndex >= 0) {
			localPlacements[existingIndex] = placement;
		} else {
			localPlacements.push(placement);
		}

		// Trigger reactivity
		localPlacements = [...localPlacements];
		onStateChange?.({ placements: localPlacements });
	}

	function handleDragStart(postId: string) {
		// Bring post to front
		localMaxZIndex += 1;
		const index = localPlacements.findIndex((p) => p.postId === postId);
		if (index >= 0) {
			localPlacements[index] = { ...localPlacements[index], zIndex: localMaxZIndex };
			localPlacements = [...localPlacements];
		}
	}

	function handleDelete(postId: string) {
		// Remove placement
		localPlacements = localPlacements.filter((p) => p.postId !== postId);
		onStateChange?.({ placements: localPlacements });
		onDeletePost?.(postId);
	}
</script>

<!-- Zoom Controls -->
<div class="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2">
	<Button
		type="button"
		variant="outline"
		size="icon"
		onclick={zoomIn}
		disabled={zoom >= MAX_ZOOM}
		aria-label="Zoom in"
		class="bg-secondary-background"
	>
		<ZoomIn class="size-4" />
	</Button>
	<Button
		type="button"
		variant="outline"
		size="icon"
		onclick={zoomOut}
		disabled={zoom <= minZoom}
		aria-label="Zoom out"
		class="bg-secondary-background"
	>
		<ZoomOut class="size-4" />
	</Button>
	<Button
		type="button"
		variant="outline"
		size="icon"
		onclick={zoomToFit}
		aria-label="Fit all posts in view"
		class="bg-secondary-background"
	>
		<Maximize class="size-4" />
	</Button>
	<div
		class="rounded-base border-2 border-border bg-secondary-background px-2 py-1 text-center text-xs font-bold"
	>
		{Math.round(zoom * 100)}%
	</div>
</div>

<div
	class="whiteboard relative min-h-screen min-w-full bg-background"
	style:width="{canvasBounds.width}px"
	style:height="{canvasBounds.height}px"
>
	<div
		class="canvas-content origin-top-left"
		style:transform="scale({zoom})"
	>
		<ProfileIcon {profile} x={20 + canvasBounds.offsetX} y={20 + canvasBounds.offsetY} />

		{#each posts as post, index (post.id)}
			{@const placement = getPlacement(post.id, index)}
			<DraggablePost
				{post}
				x={placement.x + canvasBounds.offsetX}
				y={placement.y + canvasBounds.offsetY}
				zIndex={placement.zIndex}
				isDemoPost={demoPostIds.has(post.id)}
				onPositionChange={(postId, x, y) =>
					handlePositionChange(
						postId,
						(x - canvasBounds.offsetX) / zoom,
						(y - canvasBounds.offsetY) / zoom
					)}
				onDragStart={handleDragStart}
				onDelete={handleDelete}
			/>
		{/each}
	</div>
</div>

<style>
	.whiteboard {
		background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
		background-size: 24px 24px;
	}

	.canvas-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
