<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/lib/utils.js';

	type Props = WithElementRef<HTMLTextareaAttributes>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		'data-slot': dataSlot = 'textarea',
		...restProps
	}: Props = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		'flex min-h-20 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground shadow-shadow transition-all outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-foreground/50 disabled:cursor-not-allowed disabled:opacity-50',
		'focus-visible:translate-x-boxShadowX focus-visible:translate-y-boxShadowY focus-visible:shadow-none',
		'aria-invalid:border-destructive',
		className
	)}
	bind:value
	{...restProps}
></textarea>
