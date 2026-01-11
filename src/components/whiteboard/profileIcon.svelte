<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import type { UserProfile } from '$lib/types/whiteboard';
	import { User } from 'lucide-svelte';

	interface Props {
		profile: UserProfile;
		x?: number;
		y?: number;
		onPositionChange?: (x: number, y: number) => void;
	}

	let { profile, x = 20, y = 20, onPositionChange }: Props = $props();

	let position = $derived({ x, y });
	let isPopoverOpen = $state(false);

	function handleDragEnd(e: { offsetX: number; offsetY: number }) {
		position = { x: e.offsetX, y: e.offsetY };
		onPositionChange?.(e.offsetX, e.offsetY);
	}

	function togglePopover() {
		isPopoverOpen = !isPopoverOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.profile-icon-container')) {
			isPopoverOpen = false;
		}
	}

	$effect(() => {
		if (isPopoverOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div
	class="profile-icon-container absolute z-9999 cursor-grab active:cursor-grabbing"
	use:draggable={{
		position,
		bounds: 'parent',
		onDragEnd: handleDragEnd
	}}
>
	<button
		type="button"
		class="z-9999 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-3 border-border bg-primary transition-all"
		onclick={togglePopover}
		aria-label="View profile"
	>
		{#if profile.avatarUrl}
			<img src={profile.avatarUrl} alt={profile.username} class="h-full w-full object-cover" />
		{:else}
			<User class="size-8 text-primary-foreground" />
		{/if}
	</button>

	{#if isPopoverOpen}
		<div
			class="absolute top-full left-0 z-9999 mt-2 w-64 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow"
		>
			<div class="flex flex-col gap-2">
				<h3 class="text-lg font-heading text-foreground">@{profile.username}</h3>
				{#if profile.bio}
					<p class="text-sm font-base text-foreground/80">{profile.bio}</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.profile-icon-container {
		touch-action: none;
		user-select: none;
	}
</style>
