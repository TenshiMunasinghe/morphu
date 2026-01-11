<script lang="ts">
	import Post from './post.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Slider } from '$lib/components/ui/slider/index';
	import PaddingSelector from './paddingSelector.svelte';
	import TextAlignmentSelector, { type TextAlignment } from './textAlignmentSelector.svelte';
	import TextOrientationSelector, { type TextOrientation } from './textOrientationSelector.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

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

<div
	class="relative flex min-h-screen flex-col bg-linear-to-br from-[#f5f7fa] to-[#c3cfe2] lg:mx-auto lg:grid lg:max-w-[1400px] lg:grid-cols-2 lg:gap-8 lg:p-8"
>
	<!-- Preview Section - Fixed at top on mobile -->
	<div
		class="sticky top-0 z-10 flex w-full flex-col rounded-b-xl bg-white p-2 shadow-md lg:relative lg:rounded-xl lg:p-8"
	>
		<h2
			class="absolute right-2 bottom-2 z-10 rounded-lg bg-[#363636] p-1 text-center text-xs font-light text-white lg:text-left lg:text-2xl"
		>
			Preview
		</h2>
		<div
			class="relative flex max-h-[300px] min-h-[200px] items-center justify-center overflow-auto rounded-lg bg-gray-50 p-2 lg:max-h-none lg:min-h-[400px] lg:p-8"
		>
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
		</div>
	</div>

	<!-- Form Section - At bottom on mobile -->
	<div
		class="mt-auto flex-1 overflow-y-auto rounded-t-xl bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:mt-0 lg:max-h-[calc(100vh-4rem)] lg:rounded-xl lg:p-8 lg:shadow-md"
	>
		<form class="flex flex-col gap-5 pb-8">
			<div class="flex flex-col gap-2">
				<textarea
					class="resize-none overflow-y-scroll border-none outline-none"
					id="content"
					bind:value={content}
					rows="4"
					placeholder="Enter your post content..."
				></textarea>
			</div>

			<Separator class="my-2" />

			<h2 class="mb-2 text-center text-lg font-bold">Style your Post!</h2>

			<div class="grid grid-cols-2 gap-8 text-sm">
				<div class="flex items-center justify-between gap-2">
					<label for="textColor">Text</label>
					<input
						type="color"
						id="textColor"
						bind:value={textColor}
						class="h-9 w-9 rounded-full outline-2 outline-neutral-700"
					/>
				</div>

				<div class="flex items-center justify-between gap-2">
					<label for="backgroundColor">Background</label>
					<input
						type="color"
						id="backgroundColor"
						bind:value={backgroundColor}
						class="h-9 w-9 rounded-full outline-2 outline-neutral-700"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<div class="text-sm font-semibold text-gray-700">Padding</div>
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

			<div class="grid grid-cols-2 gap-4">
				<label for="borderRadius" class="text-sm font-semibold text-gray-700">Border Radius</label>
				<Slider
					id="borderRadius"
					type="single"
					bind:value={borderRadiusValue}
					min={0}
					max={50}
					step={2}
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<label for="textSize" class="text-sm font-semibold text-gray-700">Text Size</label>
				<Slider id="textSize" type="single" bind:value={textSizeValue} min={8} max={48} step={2} />

				<div class="flex flex-col gap-2">
					<label for="fontWeight" class="text-sm font-semibold text-gray-700">Font Weight</label>
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
			</div>

			<div class="relative flex flex-col gap-2">
				<label for="fontFamily" class="text-sm font-semibold text-gray-700">Font Family</label>
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
					<svg
						class="ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 {isFontSelectOpen
							? 'rotate-180'
							: ''}"
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
				</Button>
				{#if isFontSelectOpen}
					<div
						class="absolute top-[calc(100%+4px)] right-0 left-0 z-50 flex max-h-[300px] flex-col overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
					>
						{#each fontFamilies as font (font.value)}
							<button
								type="button"
								class="cursor-pointer border-none bg-white p-3 text-left text-sm transition-colors first:rounded-t-md last:rounded-b-md hover:bg-gray-100 {font.value ===
								fontFamily
									? 'bg-blue-50 text-blue-800'
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

			<div class="grid grid-cols-2 gap-2">
				<div class="flex flex-col gap-2">
					<label for="textOrientation" class="text-sm font-semibold text-gray-700"
						>Text Orientation</label
					>
					<TextOrientationSelector
						{textOrientation}
						setTextOrientation={(newValue: TextOrientation) => (textOrientation = newValue)}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="textAlign" class="text-sm font-semibold text-gray-700">Text Alignment</label>
					<TextAlignmentSelector
						{textAlign}
						onTextAlignmentChange={(newValue: TextAlignment) => (textAlign = newValue)}
					/>
				</div>
			</div>
		</form>
	</div>
</div>
