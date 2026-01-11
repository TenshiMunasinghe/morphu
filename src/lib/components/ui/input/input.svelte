<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/lib/utils.js";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		"data-slot": dataSlot = "input",
		...restProps
	}: Props = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-base border-2 border-border bg-secondary-background px-3 pt-1.5 text-sm font-base shadow-shadow transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
			"focus-visible:translate-x-boxShadowX focus-visible:translate-y-boxShadowY focus-visible:shadow-none",
			"aria-invalid:border-destructive",
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-base font-base shadow-shadow transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			"focus-visible:translate-x-boxShadowX focus-visible:translate-y-boxShadowY focus-visible:shadow-none",
			"aria-invalid:border-destructive",
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
