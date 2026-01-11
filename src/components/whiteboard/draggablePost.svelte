<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import Post from '../post.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { X } from 'lucide-svelte';
	import type { PostData } from '$lib/types/post';

	interface Props {
		post: PostData;
		x: number;
		y: number;
		zIndex?: number;
		isDemoPost?: boolean;
		onPositionChange?: (postId: string, x: number, y: number) => void;
		onDragStart?: (postId: string) => void;
		onDelete?: (postId: string) => void;
	}

	let {
		post,
		x,
		y,
		zIndex = 1,
		isDemoPost = false,
		onPositionChange,
		onDragStart,
		onDelete
	}: Props = $props();

	let position = $derived({ x, y });
	let isHovered = $state(false);
	let isPopoverOpen = $state(false);

	function handleDragStart() {
		onDragStart?.(post.id);
	}

	function handleDragEnd(e: { offsetX: number; offsetY: number }) {
		onPositionChange?.(post.id, e.offsetX, e.offsetY);
	}

	function handleDelete(e: MouseEvent) {
		e.stopPropagation();
		if (confirm('Are you sure you want to delete this post?')) {
			onDelete?.(post.id);
		}
	}

	function handleClick() {
		if (post.isProfile) {
			isPopoverOpen = !isPopoverOpen;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (post.isProfile && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			isPopoverOpen = !isPopoverOpen;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.profile-popover-container')) {
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

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="draggable-post absolute cursor-grab active:cursor-grabbing"
	class:profile-popover-container={post.isProfile}
	style:z-index={zIndex}
	role={post.isProfile ? 'button' : 'article'}
	tabindex={post.isProfile ? 0 : undefined}
	use:draggable={{
		position,
		bounds: 'parent',
		onDragStart: handleDragStart,
		onDragEnd: handleDragEnd
	}}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	{#if !isDemoPost && isHovered}
		<Button
			type="button"
			variant="default"
			size="icon-sm"
			class="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-red-500 p-0 hover:bg-red-600"
			onclick={handleDelete}
			aria-label="Delete post"
		>
			<X class="size-4" />
		</Button>
	{/if}
	<Post
		content={post.content}
		borderRadius={post.style.borderRadius}
		borderColor={post.style.borderColor}
		borderWidth={post.style.borderWidth}
		borderStyle={post.style.borderStyle}
		paddingTop={post.style.paddingTop}
		paddingRight={post.style.paddingRight}
		paddingBottom={post.style.paddingBottom}
		paddingLeft={post.style.paddingLeft}
		textSize={post.style.textSize}
		textOrientation={post.style.textOrientation}
		textAlign={post.style.textAlign}
		fontFamily={post.style.fontFamily}
		fontWeight={post.style.fontWeight}
		fontStyle={post.style.fontStyle}
		backgroundColor={post.style.backgroundColor}
		textColor={post.style.textColor}
	/>

	{#if post.isProfile && isPopoverOpen}
		<div
			class="absolute top-full left-0 z-50 mt-2 w-64 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow"
		>
			<div class="flex flex-col gap-2">
				<p class="text-sm font-base text-foreground/80">
					This is your profile post. You can style it however you like!
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.draggable-post {
		touch-action: none;
		user-select: none;
	}
</style>
