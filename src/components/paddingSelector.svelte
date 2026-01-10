<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		MoveHorizontal,
		MoveRight,
		MoveDown,
		MoveUp,
		MoveVertical,
		PanelLeftDashed,
		PanelTopBottomDashed,
		SquareDashed,
		MoveLeft
	} from 'lucide-svelte';
	import Slider from '$lib/components/ui/slider/slider.svelte';

	type PaddingMode = 'uniform' | 'axes' | 'individual';

	const {
		updateAll,
		updateAxis,
		updateIndividual,
		padding
	}: {
		updateAll: (value: number) => void;
		updateAxis: (axis: 'x' | 'y', value: number) => void;
		updateIndividual: (axis: 'top' | 'right' | 'bottom' | 'left', value: number) => void;
		padding: {
			top: number;
			right: number;
			bottom: number;
			left: number;
		};
	} = $props();
	let state: PaddingMode = $state('axes');
</script>

<div>
	{#if state === 'uniform'}
		<div class="flex items-center gap-2">
			<Slider
				type="single"
				min={0}
				max={64}
				step={2}
				value={padding.top}
				onValueChange={(value) => updateAll(value)}
			/>
			<Button onclick={() => (state = 'axes')}>
				<SquareDashed />
			</Button>
		</div>
	{:else if state === 'axes'}
		<div class="flex items-center gap-2">
			<div class="flex grow flex-col gap-2">
				<div class="flex items-center gap-2">
					<MoveVertical class="h-4 w-4" />
					<Slider
						type="single"
						min={0}
						max={64}
						step={2}
						value={padding.top}
						onValueChange={(value) => updateAxis('y', value)}
						class="w-full grow"
					/>
				</div>
				<div class="flex items-center gap-2">
					<MoveHorizontal class="h-4 w-4" />
					<Slider
						type="single"
						min={0}
						max={64}
						step={2}
						value={padding.right}
						onValueChange={(value) => updateAxis('x', value)}
						class="w-full grow"
					/>
				</div>
			</div>
			<Button onclick={() => (state = 'individual')}>
				<PanelTopBottomDashed />
			</Button>
		</div>
	{:else if state === 'individual'}
		<div class="flex items-center gap-2">
			<div class="grid grow grid-cols-2 gap-2">
				<div class="flex items-center gap-2">
					<MoveUp class="h-4 w-4" />
					<Slider
						type="single"
						min={0}
						max={64}
						step={2}
						value={padding.top}
						onValueChange={(value) => updateIndividual('top', value)}
						class="w-full grow"
					/>
				</div>
				<div class="flex items-center gap-2">
					<MoveRight class="h-4 w-4" />
					<Slider
						type="single"
						min={0}
						max={64}
						step={2}
						value={padding.right}
						onValueChange={(value) => updateIndividual('right', value)}
						class="w-full grow"
					/>
				</div>
				<div class="flex items-center gap-2">
					<MoveDown class="h-4 w-4" />
					<Slider
						type="single"
						min={0}
						max={64}
						step={2}
						value={padding.bottom}
						onValueChange={(value) => updateIndividual('bottom', value)}
						class="w-full grow"
					/>
				</div>
				<div class="flex items-center gap-2">
					<MoveLeft class="h-4 w-4" />
					<Slider
						type="single"
						min={0}
						max={64}
						step={2}
						value={padding.left}
						onValueChange={(value) => updateIndividual('left', value)}
						class="w-full grow"
					/>
				</div>
			</div>
			<Button onclick={() => (state = 'uniform')}>
				<PanelLeftDashed />
			</Button>
		</div>
	{/if}
</div>

<style>
</style>
