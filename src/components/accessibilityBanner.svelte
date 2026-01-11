<script lang="ts">
	import { checkAccessibility, type AccessibilityWarning } from '$lib/lib/accessibility';
	import { AlertTriangle, CheckCircle } from 'lucide-svelte';

	interface Props {
		textColor: string;
		backgroundColor: string;
		textSize: number;
		fontWeight: string;
	}

	let { textColor, backgroundColor, textSize, fontWeight }: Props = $props();

	let warnings: AccessibilityWarning[] = $derived(
		checkAccessibility({ textColor, backgroundColor, textSize, fontWeight })
	);

	let hasWarnings = $derived(warnings.length > 0);
</script>

<div
	class="flex items-start gap-2 rounded-base border-2 border-border px-3 py-2 text-xs {hasWarnings
		? 'bg-red-100 text-red-800'
		: 'bg-green-100 text-green-800'}"
>
	{#if hasWarnings}
		<AlertTriangle class="mt-0.5 size-4 shrink-0" />
		<div class="flex flex-col gap-1">
			{#each warnings as warning (warning.message)}
				<span>{warning.message}</span>
			{/each}
		</div>
	{:else}
		<CheckCircle class="mt-0.5 size-4 shrink-0" />
		<span>Looks good!</span>
	{/if}
</div>
