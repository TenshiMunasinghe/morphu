<script lang="ts">
	import Post from './post.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Slider } from '$lib/components/ui/slider/index';
	import PaddingSelector from './paddingSelector.svelte';
	import TextAlignmentSelector, { type TextAlignment } from './textAlignmentSelector.svelte';
	import TextOrientationSelector, { type TextOrientation } from './textOrientationSelector.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import { PaneResizer } from 'paneforge';

	// Numerical values as numbers for sliders
	let paddingTopValue = $state(16);
	let paddingRightValue = $state(16);
	let paddingBottomValue = $state(16);
	let paddingLeftValue = $state(16);
	let borderRadiusValue = $state(8);
	let textSizeValue = $state(16);

	function updateIndividual(axis: 'top' | 'right' | 'bottom' | 'left', value: number) {
		if (axis === 'top') {
			paddingTopValue = value;
		} else if (axis === 'right') {
			paddingRightValue = value;
		} else if (axis === 'bottom') {
			paddingBottomValue = value;
		} else if (axis === 'left') {
			paddingLeftValue = value;
		}
	}

	// Functions to update padding values
	function updateAxis(axis: 'x' | 'y', value: number) {
		if (axis === 'x') {
			paddingLeftValue = value;
			paddingRightValue = value;
		} else {
			paddingTopValue = value;
			paddingBottomValue = value;
		}
	}

	function updateAll(value: number) {
		paddingTopValue = value;
		paddingRightValue = value;
		paddingBottomValue = value;
		paddingLeftValue = value;
	}

	// Computed string values for styles
	let paddingTop = $derived(`${paddingTopValue}px`);
	let paddingRight = $derived(`${paddingRightValue}px`);
	let paddingBottom = $derived(`${paddingBottomValue}px`);
	let paddingLeft = $derived(`${paddingLeftValue}px`);
	let borderRadius = $derived(`${borderRadiusValue}px`);
	let textSize = $derived(`${textSizeValue}px`);
	let textOrientation: TextOrientation = $state('horizontal-tb');
	let textAlign: TextAlignment = $state('left');
	let fontFamily = $state('system-ui, sans-serif');
	let fontWeight = $state('400');
	let content = $state(
		'This is a sample social media post. You can customize its appearance using the form controls!'
	);
	let backgroundColor = $state('#ffffff');
	let textColor = $state('#000000');
	let isFontSelectOpen = $state(false);

	const fontFamilies = [
		{ value: 'system-ui, sans-serif', label: 'System UI', font: 'system-ui, sans-serif' },
		{ value: 'Arial, sans-serif', label: 'Arial', font: 'Arial, sans-serif' },
		{ value: 'Georgia, serif', label: 'Georgia', font: 'Georgia, serif' },
		{ value: 'Times New Roman, serif', label: 'Times New Roman', font: 'Times New Roman, serif' },
		{ value: 'Courier New, monospace', label: 'Courier New', font: 'Courier New, monospace' },
		{ value: 'Verdana, sans-serif', label: 'Verdana', font: 'Verdana, sans-serif' },
		{ value: 'Helvetica, sans-serif', label: 'Helvetica', font: 'Helvetica, sans-serif' },
		{ value: 'Comic Sans MS, cursive', label: 'Comic Sans MS', font: 'Comic Sans MS, cursive' }
	];

	function toggleFontSelect() {
		isFontSelectOpen = !isFontSelectOpen;
	}

	function selectFont(font: string) {
		fontFamily = font;
		isFontSelectOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.font-select-container')) {
			isFontSelectOpen = false;
		}
	}

	$effect(() => {
		if (isFontSelectOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	const selectedFont = $derived(
		fontFamilies.find((f) => f.value === fontFamily) || fontFamilies[0]
	);
</script>

<Resizable.PaneGroup
	direction="vertical"
	class="h-screen bg-background lg:mx-auto lg:max-w-350 lg:p-8"
>
	<!-- Preview Section - Fixed at top on mobile -->
	<Resizable.Pane
		defaultSize={25}
		minSize={10}
		class="relative z-10 flex w-full flex-col overflow-y-auto rounded-base border-b-0 border-border bg-secondary-background p-8 shadow-none"
	>
		<h2
			class="absolute right-1 bottom-1 z-10 rounded-base border-2 border-border bg-foreground p-1 text-center text-xs font-base text-secondary-background lg:text-left lg:text-2xl"
		>
			Preview
		</h2>
		<Post
			{borderRadius}
			{paddingTop}
			{paddingRight}
			{paddingBottom}
			{paddingLeft}
			{textSize}
			{textOrientation}
			{textAlign}
			{fontFamily}
			{fontWeight}
			{content}
			{backgroundColor}
			{textColor}
		/>
	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<!-- Form Section - At bottom on mobile -->
	<Resizable.Pane
		defaultSize={75}
		minSize={20}
		class="overflow-y-auto bg-secondary-background p-6 shadow-shadow lg:p-8"
	>
		<form class="flex flex-col gap-8 pb-8">
			<div class="flex flex-col gap-2">
				<textarea
					class="resize-none overflow-y-scroll bg-secondary-background p-3 font-base outline-none"
					id="content"
					bind:value={content}
					rows="4"
					placeholder="Enter your post content..."
				></textarea>
			</div>

			<Separator class="my-4" />

			<h2 class="text-center text-lg font-heading">Style your Post!</h2>

			<div class="grid grid-cols-2 gap-8 text-sm">
				<div class="flex items-center justify-between gap-2">
					<label for="textColor" class="font-base">Text</label>
					<input
						type="color"
						id="textColor"
						bind:value={textColor}
						class="h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
					/>
				</div>

				<div class="flex items-center justify-between gap-2">
					<label for="backgroundColor" class="font-base">Background</label>
					<input
						type="color"
						id="backgroundColor"
						bind:value={backgroundColor}
						class="h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<div class="text-sm font-heading text-foreground">Padding</div>
				<PaddingSelector
					{updateAll}
					{updateAxis}
					{updateIndividual}
					padding={{
						top: paddingTopValue,
						right: paddingRightValue,
						bottom: paddingBottomValue,
						left: paddingLeftValue
					}}
				/>
			</div>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="borderRadius" class="text-sm font-heading text-foreground">Border Radius</label>
				<Slider
					id="borderRadius"
					type="single"
					bind:value={borderRadiusValue}
					min={0}
					max={50}
					step={2}
				/>
			</div>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="textSize" class="text-sm font-heading text-foreground">Text Size</label>
				<Slider id="textSize" type="single" bind:value={textSizeValue} min={8} max={48} step={2} />
			</div>

			<div class="flex flex-col gap-3">
				<label for="fontWeight" class="text-sm font-heading text-foreground">Font Weight</label>
				<div class="flex gap-2">
					<Button
						type="button"
						variant={fontWeight === '300' ? 'default' : 'outline'}
						class="flex-1"
						onclick={() => (fontWeight = '300')}
					>
						Light
					</Button>
					<Button
						type="button"
						variant={fontWeight === '400' ? 'default' : 'outline'}
						class="flex-1"
						onclick={() => (fontWeight = '400')}
					>
						Normal
					</Button>
					<Button
						type="button"
						variant={fontWeight === '700' ? 'default' : 'outline'}
						class="flex-1"
						onclick={() => (fontWeight = '700')}
					>
						Bold
					</Button>
				</div>
			</div>

			<div class="font-select-container relative flex flex-col gap-3">
				<label for="fontFamily" class="text-sm font-heading text-foreground">Font Family</label>
				<Button
					type="button"
					variant="outline"
					class="flex w-full items-center justify-between"
					onclick={toggleFontSelect}
					aria-expanded={isFontSelectOpen}
					aria-haspopup="listbox"
				>
					<span class="flex-1 text-left" style:font-family={selectedFont.font}>
						{selectedFont.label}
					</span>
					<ChevronDown />
				</Button>
				{#if isFontSelectOpen}
					<div
						class="absolute top-[calc(100%+4px)] right-0 left-0 z-50 flex max-h-75 flex-col overflow-y-auto rounded-base border-2 border-border bg-secondary-background shadow-shadow"
					>
						{#each fontFamilies as font (font.value)}
							<button
								type="button"
								class="cursor-pointer border-b-2 border-border bg-secondary-background p-3 text-left text-sm font-base transition-colors last:border-b-0 hover:bg-primary hover:text-primary-foreground {font.value ===
								fontFamily
									? 'bg-primary text-primary-foreground'
									: ''}"
								onclick={() => selectFont(font.value)}
								style:font-family={font.font}
							>
								{font.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="flex flex-col gap-3">
					<label for="textOrientation" class="text-sm font-heading text-foreground"
						>Text Orientation</label
					>
					<TextOrientationSelector
						{textOrientation}
						setTextOrientation={(newValue: TextOrientation) => (textOrientation = newValue)}
					/>
				</div>

				<div class="flex flex-col gap-3">
					<label for="textAlign" class="text-sm font-heading text-foreground">Text Alignment</label>
					<TextAlignmentSelector
						{textAlign}
						onTextAlignmentChange={(newValue: TextAlignment) => (textAlign = newValue)}
					/>
				</div>
			</div>
		</form>
	</Resizable.Pane>
</Resizable.PaneGroup>
