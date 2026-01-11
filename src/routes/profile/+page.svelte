<script lang="ts">
	import { onMount } from 'svelte';
	import Whiteboard from '../../components/whiteboard/whiteboard.svelte';
	import type { PostData } from '$lib/types/post';
	import type { WhiteboardState } from '$lib/types/whiteboard';
	import { getPosts, getWhiteboardState, saveWhiteboardState, deletePost } from '$lib/stores/posts';
	import dummyData from '$lib/data/dummyPosts.json';

	// Initialize with dummy data (available at SSR time)
	let allPosts = $state<PostData[]>(dummyData.posts as PostData[]);
	let whiteboardState = $state<WhiteboardState>(dummyData.whiteboard as WhiteboardState);
	let isReady = $state(false);

	// Track which posts are demo posts (cannot be deleted)
	const demoPostIds = new Set((dummyData.posts as PostData[]).map((p) => p.id));

	onMount(() => {
		// Load user posts from localStorage
		const userPosts = getPosts();

		// Combine with dummy posts (dummy posts first, then user posts)
		allPosts = [...(dummyData.posts as PostData[]), ...userPosts];

		// Load whiteboard state: merge localStorage state with dummy state
		const savedState = getWhiteboardState();
		const dummyState = dummyData.whiteboard as WhiteboardState;

		if (savedState) {
			// Merge: use saved placements, add any missing from dummy
			const savedPostIds = new Set(savedState.placements.map((p) => p.postId));
			const missingDummyPlacements = dummyState.placements.filter(
				(p) => !savedPostIds.has(p.postId)
			);
			whiteboardState = {
				placements: [...savedState.placements, ...missingDummyPlacements]
			};
		}
		// If no saved state, keep the dummy state (already initialized)

		isReady = true;
	});

	function handleStateChange(state: WhiteboardState) {
		whiteboardState = state;
		saveWhiteboardState(state);
	}

	function handleDeletePost(postId: string) {
		// Remove from localStorage
		deletePost(postId);
		// Remove from local state
		allPosts = allPosts.filter((p) => p.id !== postId);
	}
</script>

<svelte:head>
	<title>Profile | Morphu</title>
</svelte:head>

{#if isReady}
	<div class="h-screen w-screen overflow-auto">
		<Whiteboard
			posts={allPosts}
			{demoPostIds}
			initialState={whiteboardState}
			onStateChange={handleStateChange}
			onDeletePost={handleDeletePost}
		/>
	</div>
{:else}
	<div class="flex h-screen w-screen items-center justify-center bg-background">
		<p class="text-foreground">Loading...</p>
	</div>
{/if}
