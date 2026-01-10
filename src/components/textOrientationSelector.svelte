<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { Ellipsis, EllipsisVertical } from 'lucide-svelte';

	export type TextOrientation = 'horizontal-tb' | 'vertical-rl';
	const {
		textOrientation,
		setTextOrientation
	}: {
		textOrientation: TextOrientation;
		setTextOrientation: (textOrientation: TextOrientation) => void;
	} = $props();
</script>

<div class="grid grid-cols-2 gap-2">
	{#each [{ value: 'horizontal-tb', icon: Ellipsis }, { value: 'vertical-rl', icon: EllipsisVertical }] as option}
		<Button
			onclick={() => setTextOrientation(option.value as TextOrientation)}
			variant={textOrientation === option.value ? 'default' : 'outline'}
		>
			<option.icon />
		</Button>
	{/each}
</div>
