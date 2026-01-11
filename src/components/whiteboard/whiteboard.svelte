<script lang="ts">
	import DraggablePost from './draggablePost.svelte';
	import ProfileIcon from './profileIcon.svelte';
	import type { PostData } from '$lib/types/post';
	import type {
		WhiteboardState,
		UserProfile,
		PostPlacement,
		ProfilePlacement
	} from '$lib/types/whiteboard';
	import { SvelteMap } from 'svelte/reactivity';

	const CANVAS_SIZE = 2026;
	const DEFAULT_PROFILE_POSITION = { x: 20, y: 20 };

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

	// Use initialState placements directly, with local mutations tracked separately
	let localPlacementOverrides = $state<Map<string, PostPlacement>>(new Map());
	let localMaxZIndex = $state(1);

	// Profile icon position
	let localProfilePlacement = $state<ProfilePlacement | null>(null);

	// Get current profile position (local override or from initialState or default)
	let profilePosition = $derived.by(() => {
		if (localProfilePlacement) {
			return { x: localProfilePlacement.x, y: localProfilePlacement.y };
		}
		if (initialState?.profilePlacement) {
			return { x: initialState.profilePlacement.x, y: initialState.profilePlacement.y };
		}
		return DEFAULT_PROFILE_POSITION;
	});

	// Combine initial placements with local overrides
	let localPlacements = $derived.by(() => {
		const basePlacements = initialState?.placements || [];
		const result: PostPlacement[] = [];

		// Start with initial placements, applying any overrides
		for (const placement of basePlacements) {
			const override = localPlacementOverrides.get(placement.postId);
			result.push(override || placement);
		}

		// Add any new placements not in initialState
		for (const [postId, placement] of localPlacementOverrides) {
			if (!basePlacements.find((p) => p.postId === postId)) {
				result.push(placement);
			}
		}

		return result;
	});

	// Update maxZIndex when initialState changes
	$effect(() => {
		if (initialState?.placements && initialState.placements.length > 0) {
			const maxFromInitial = Math.max(...initialState.placements.map((p) => p.zIndex || 1));
			if (maxFromInitial > localMaxZIndex) {
				localMaxZIndex = maxFromInitial;
			}
		}
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
		// Clamp position to canvas bounds
		const clampedX = Math.max(0, Math.min(CANVAS_SIZE - 50, x));
		const clampedY = Math.max(0, Math.min(CANVAS_SIZE - 50, y));

		const existing = localPlacements.find((p) => p.postId === postId);
		const placement: PostPlacement = {
			postId,
			x: clampedX,
			y: clampedY,
			zIndex: existing?.zIndex || localMaxZIndex
		};

		localPlacementOverrides.set(postId, placement);
		localPlacementOverrides = new SvelteMap(localPlacementOverrides); // Trigger reactivity

		onStateChange?.({
			placements: localPlacements,
			profilePlacement: localProfilePlacement || initialState?.profilePlacement
		});
	}

	function handleDragStart(postId: string) {
		// Bring post to front
		localMaxZIndex += 1;
		const existing = localPlacements.find((p) => p.postId === postId);
		if (existing) {
			const updated = { ...existing, zIndex: localMaxZIndex };
			localPlacementOverrides.set(postId, updated);
			localPlacementOverrides = new SvelteMap(localPlacementOverrides); // Trigger reactivity
		}
	}

	function handleDelete(postId: string) {
		// Remove from overrides
		localPlacementOverrides.delete(postId);
		localPlacementOverrides = new SvelteMap(localPlacementOverrides); // Trigger reactivity

		// Notify parent to remove from state and storage
		const remainingPlacements = localPlacements.filter((p) => p.postId !== postId);
		onStateChange?.({
			placements: remainingPlacements,
			profilePlacement: localProfilePlacement || initialState?.profilePlacement
		});
		onDeletePost?.(postId);
	}

	function handleProfilePositionChange(x: number, y: number) {
		// Clamp position to canvas bounds
		const clampedX = Math.max(0, Math.min(CANVAS_SIZE - 64, x));
		const clampedY = Math.max(0, Math.min(CANVAS_SIZE - 64, y));

		localProfilePlacement = {
			userProfileId: profile.id,
			x: clampedX,
			y: clampedY
		};

		onStateChange?.({
			placements: localPlacements,
			profilePlacement: localProfilePlacement
		});
	}
</script>

<div
	class="whiteboard relative bg-background"
	style:width="{CANVAS_SIZE}px"
	style:height="{CANVAS_SIZE}px"
>
	<ProfileIcon
		{profile}
		x={profilePosition.x}
		y={profilePosition.y}
		onPositionChange={handleProfilePositionChange}
	/>

	{#each posts as post, index (post.id)}
		{@const placement = getPlacement(post.id, index)}
		<DraggablePost
			{post}
			x={placement.x}
			y={placement.y}
			zIndex={placement.zIndex}
			isDemoPost={demoPostIds.has(post.id)}
			onPositionChange={handlePositionChange}
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
