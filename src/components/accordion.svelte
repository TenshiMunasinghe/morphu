<script lang="ts">
	interface Props {
		title: string;
		children: import('svelte').Snippet;
	}

	let { title, children }: Props = $props();

	let isOpen = $state(false);
</script>

<div class="accordion">
	<button
		type="button"
		class="accordion-trigger"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
	>
		<span class="accordion-title">{title}</span>
		<svg
			class="accordion-icon"
			class:open={isOpen}
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
				fill="currentColor"
				fill-rule="evenodd"
				clip-rule="evenodd"
			></path>
		</svg>
	</button>
	{#if isOpen}
		<div class="accordion-content">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.accordion {
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		overflow: hidden;
		background: white;
	}

	.accordion-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.75rem 1rem;
		background: white;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
		transition: background-color 0.15s;
	}

	.accordion-trigger:hover {
		background: #f9fafb;
	}

	.accordion-title {
		flex: 1;
		text-align: left;
	}

	.accordion-icon {
		width: 15px;
		height: 15px;
		color: #6b7280;
		transition: transform 0.2s;
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	.accordion-icon.open {
		transform: rotate(180deg);
	}

	.accordion-content {
		padding: 1rem;
		border-top: 1px solid #e5e7eb;
		background: #fafafa;
	}
</style>
