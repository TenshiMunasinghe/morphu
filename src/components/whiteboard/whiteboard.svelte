<script lang="ts">
	import DraggablePost from './draggablePost.svelte';
	import ProfileIcon from './profileIcon.svelte';
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

	// Sync with initialState when it changes
	$effect(() => {
		if (initialState?.placements) {
			localPlacements = [...initialState.placements];
			localMaxZIndex = Math.max(1, ...initialState.placements.map((p) => p.zIndex || 1));
		}
	});

	// Calculate canvas bounds based on post positions
	let canvasBounds = $derived.by(() => {
		const POST_SIZE = 400; // Approximate max post size
		const PADDING = 200; // Extra space around posts
		const MIN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1200;
		const MIN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800;

		let minX = 0;
		let minY = 0;
		let maxX = MIN_WIDTH;
		let maxY = MIN_HEIGHT;

		for (const placement of localPlacements) {
			minX = Math.min(minX, placement.x - PADDING);
			minY = Math.min(minY, placement.y - PADDING);
			maxX = Math.max(maxX, placement.x + POST_SIZE + PADDING);
			maxY = Math.max(maxY, placement.y + POST_SIZE + PADDING);
		}

		// Offset to shift everything into positive space
		const offsetX = minX < 0 ? -minX : 0;
		const offsetY = minY < 0 ? -minY : 0;

		return {
			width: maxX + offsetX,
			height: maxY + offsetY,
			offsetX,
			offsetY
		};
	});

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

<div
	class="whiteboard relative overflow-auto bg-background"
	style:min-width="{canvasBounds.width}px"
	style:min-height="{canvasBounds.height}px"
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
				handlePositionChange(postId, x - canvasBounds.offsetX, y - canvasBounds.offsetY)}
			onDragStart={handleDragStart}
			onDelete={handleDelete}
		/>
	{/each}
</div>

<style>
	.whiteboard {
		background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
		background-size: 24px 24px;
	}
</style>
