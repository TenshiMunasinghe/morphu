<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Minus, Ellipsis, Circle, Equal, X } from 'lucide-svelte';

	export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

	const {
		borderStyle,
		onBorderStyleChange
	}: {
		borderStyle: BorderStyle;
		onBorderStyleChange: (style: BorderStyle) => void;
	} = $props();

	const options: { value: BorderStyle; icon: typeof Minus; label: string }[] = [
		{ value: 'solid', icon: Minus, label: 'Solid' },
		{ value: 'dashed', icon: Ellipsis, label: 'Dashed' },
		{ value: 'dotted', icon: Circle, label: 'Dotted' },
		{ value: 'double', icon: Equal, label: 'Double' },
		{ value: 'none', icon: X, label: 'None' }
	];
</script>

<div class="grid grid-cols-5 gap-2">
	{#each options as option (option)}
		<Button
			onclick={() => onBorderStyleChange(option.value)}
			variant={borderStyle === option.value ? 'default' : 'outline'}
			title={option.label}
		>
			<option.icon class="h-4 w-4" />
		</Button>
	{/each}
</div>
