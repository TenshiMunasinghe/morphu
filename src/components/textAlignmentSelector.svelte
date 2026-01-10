<script lang="ts">
	import { TextAlignCenter, TextAlignStart, TextAlignEnd, TextAlignJustify } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

	const {
		textAlign,
		onTextAlignmentChange
	}: {
		textAlign: TextAlignment;
		onTextAlignmentChange: (textAlignment: TextAlignment) => void;
	} = $props();

	function handleTextAlignmentChange(textAlignment: TextAlignment) {
		onTextAlignmentChange(textAlignment);
	}
</script>

<div class="grid grid-cols-2 gap-2">
	{#each [{ value: 'left', icon: TextAlignStart }, { value: 'center', icon: TextAlignCenter }, { value: 'right', icon: TextAlignEnd }, { value: 'justify', icon: TextAlignJustify }] as option}
		<Button
			onclick={() => handleTextAlignmentChange(option.value as TextAlignment)}
			variant={textAlign === option.value ? 'default' : 'outline'}
		>
			<option.icon />
		</Button>
	{/each}
</div>
