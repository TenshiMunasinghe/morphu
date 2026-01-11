<script lang="ts">
	import { page } from '$app/stores';
	import { PenSquare, User } from 'lucide-svelte';
	import { cn } from '$lib/lib/utils';

	let currentPath = $derived($page.url.pathname);
</script>

<nav
	class="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t-3 border-border bg-secondary-background"
>
	<a
		href="/"
		class={cn(
			'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
			currentPath === '/' ? 'text-primary' : 'text-foreground/60'
		)}
	>
		<PenSquare class="size-6" />
		<span class="text-xs font-heading">Post</span>
	</a>
	<a
		href="/profile"
		class={cn(
			'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
			currentPath === '/profile' ? 'text-primary' : 'text-foreground/60'
		)}
	>
		<User class="size-6" />
		<span class="text-xs font-heading">Profile</span>
	</a>
</nav>
