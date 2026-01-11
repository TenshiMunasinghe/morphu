<script lang="ts">
	import { goto } from '$app/navigation';
	import Post from './post.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Slider } from '$lib/components/ui/slider/index';
	import PaddingSelector from './paddingSelector.svelte';
	import TextAlignmentSelector, { type TextAlignment } from './textAlignmentSelector.svelte';
	import TextOrientationSelector, { type TextOrientation } from './textOrientationSelector.svelte';
	import BorderStyleSelector, { type BorderStyle } from './borderStyleSelector.svelte';
	import AccessibilityBanner from './accessibilityBanner.svelte';
	import { ChevronDown, GripHorizontal } from 'lucide-svelte';
	import { generatePostId, type PostData, type PostStyle } from '$lib/types/post';
	import { savePost, addPostPlacement } from '$lib/stores/posts';
	import { checkAccessibility } from '$lib/lib/accessibility';
	import { resolve } from '$app/paths';

	function handleSubmit() {
		// Check for accessibility warnings
		const warnings = checkAccessibility({
			textColor,
			backgroundColor,
			textSize: textSizeValue,
			fontWeight
		});

		if (warnings.length > 0) {
			const warningMessages = warnings.map((w) => `• ${w.message}`).join('\n');
			const proceed = confirm(
				`Your post has accessibility warnings:\n\n${warningMessages}\n\nDo you want to submit anyway?`
			);
			if (!proceed) {
				return;
			}
		}

		// Validate content
		if (!content.trim()) {
			alert('Please enter some content for your post.');
			return;
		}

		// Create post style object
		const style: PostStyle = {
			borderRadius,
			borderColor,
			borderWidth,
			borderStyle,
			paddingTop,
			paddingRight,
			paddingBottom,
			paddingLeft,
			textSize,
			textOrientation,
			textAlign,
			fontFamily,
			fontWeight,
			fontStyle,
			backgroundColor,
			textColor
		};

		// Create post data
		const post: PostData = {
			id: generatePostId(),
			content,
			style,
			createdAt: new Date().toISOString(),
			isProfile
		};

		// Save post to localStorage
		savePost(post);

		// Add placement for the new post (random position near center)
		const x = 150 + Math.random() * 200;
		const y = 150 + Math.random() * 200;
		addPostPlacement(post.id, x, y);

		// Navigate to profile page
		goto(resolve('/profile/'));
	}

	// Preview resize state (vertical only)
	let previewHeight = $state(200);

	function startResize(e: MouseEvent | TouchEvent) {
		e.preventDefault();

		const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		const startHeight = previewHeight;

		function onMove(e: MouseEvent | TouchEvent) {
			const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
			previewHeight = Math.max(100, Math.min(700, startHeight + (currentY - startY)));
		}

		function onEnd() {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onEnd);
			document.removeEventListener('touchmove', onMove);
			document.removeEventListener('touchend', onEnd);
		}

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onEnd);
		document.addEventListener('touchmove', onMove);
		document.addEventListener('touchend', onEnd);
	}

	// Numerical values as numbers for sliders
	let paddingTopValue = $state(16);
	let paddingRightValue = $state(16);
	let paddingBottomValue = $state(16);
	let paddingLeftValue = $state(16);
	let borderRadiusValue = $state(0);
	let borderWidthValue = $state(2);
	let textSizeValue = $state(16);

	// Border styling
	let borderColor = $state('#000000');
	let borderStyle: BorderStyle = $state('solid');

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
	let borderRadius = $derived(`${borderRadiusValue}%`);
	let borderWidth = $derived(`${borderWidthValue}px`);
	let textSize = $derived(`${textSizeValue}px`);

	let textOrientation: TextOrientation = $state('horizontal-tb');
	let textAlign: TextAlignment = $state('left');
	let fontFamily = $state('system-ui, sans-serif');
	let fontWeight = $state('400');
	let fontStyle: 'normal' | 'italic' | 'oblique' = $state('normal');
	let content = $state('I want my border nice and rounded');
	let backgroundColor = $state('#ffffff');
	let textColor = $state('#000000');
	let isProfile = $state(false);
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

<!-- Mobile Layout -->
<div class="min-h-screen bg-background lg:hidden">
	<!-- Preview Section - Sticky at top, full width, vertically resizable -->
	<div
		class="sticky top-0 z-50 w-full border-b-4 border-border bg-secondary-background"
		style:height="{previewHeight}px"
	>
		<div class="h-full overflow-auto p-4">
			<div class="flex min-h-full items-center justify-center overflow-scroll">
				<Post
					{borderRadius}
					{borderColor}
					{borderWidth}
					{borderStyle}
					{paddingTop}
					{paddingRight}
					{paddingBottom}
					{paddingLeft}
					{textSize}
					{textOrientation}
					{textAlign}
					{fontFamily}
					{fontWeight}
					{fontStyle}
					{content}
					{backgroundColor}
					{textColor}
					editable={true}
					onContentChange={(value) => (content = value)}
				/>
			</div>
			<div class="absolute top-2 left-2 z-10">
				<AccessibilityBanner {textColor} {backgroundColor} textSize={textSizeValue} {fontWeight} />
			</div>
		</div>
		<!-- Resize handle (bottom edge) -->
		<button
			type="button"
			class="absolute bottom-0 left-1/2 z-10 flex h-4 w-8 -translate-x-1/2 translate-y-1/2 cursor-ns-resize items-center justify-center rounded-sm border-2 border-border bg-primary"
			onmousedown={startResize}
			ontouchstart={startResize}
			aria-label="Resize preview vertically"
		>
			<GripHorizontal class="size-3 text-primary-foreground" />
		</button>
	</div>

	<!-- Form Section - Below preview, scrollable -->
	<div class="mx-auto max-w-2xl bg-secondary-background p-6">
		<form class="flex flex-col gap-12 pb-8">
			<h2 class="text-center text-lg font-heading">Style your Post!</h2>

			<div class="grid grid-cols-2 gap-8 text-sm">
				<div class="flex items-center justify-between gap-2">
					<label for="textColor" class="font-bold">Text</label>
					<input
						type="color"
						id="textColor"
						bind:value={textColor}
						class="h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
					/>
				</div>

				<div class="flex items-center justify-between gap-2">
					<label for="backgroundColor" class="font-bold">Background</label>
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

			<h3 class="text-center text-base font-heading">Typography</h3>

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
						class="flex-1 font-light"
						onclick={() => (fontWeight = '300')}
					>
						Light
					</Button>
					<Button
						type="button"
						variant={fontWeight === '400' ? 'default' : 'outline'}
						class="flex-1 font-normal"
						onclick={() => (fontWeight = '400')}
					>
						Normal
					</Button>
					<Button
						type="button"
						variant={fontWeight === '700' ? 'default' : 'outline'}
						class="flex-1 font-bold"
						onclick={() => (fontWeight = '700')}
					>
						Bold
					</Button>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<label for="fontStyle" class="text-sm font-heading text-foreground">Font Style</label>
				<div class="flex gap-2">
					<Button
						type="button"
						variant={fontStyle === 'normal' ? 'default' : 'outline'}
						class="flex-1"
						onclick={() => (fontStyle = 'normal')}
					>
						Normal
					</Button>
					<Button
						type="button"
						variant={fontStyle === 'italic' ? 'default' : 'outline'}
						class="flex-1 italic"
						onclick={() => (fontStyle = 'italic')}
					>
						Italic
					</Button>
					<Button
						type="button"
						variant={fontStyle === 'oblique' ? 'default' : 'outline'}
						class="flex-1"
						style="font-style: oblique;"
						onclick={() => (fontStyle = 'oblique')}
					>
						Oblique
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
						class="absolute top-[calc(100%+4px)] right-0 left-0 z-50 flex max-h-75 flex-col overflow-y-auto rounded-base border-3 border-border bg-secondary-background shadow-shadow"
					>
						{#each fontFamilies as font (font.value)}
							<button
								type="button"
								class="cursor-pointer border-b-3 border-border bg-secondary-background p-3 text-left text-sm font-base transition-colors last:border-b-0 hover:bg-primary hover:text-primary-foreground {font.value ===
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
						>Orientation</label
					>
					<TextOrientationSelector
						{textOrientation}
						setTextOrientation={(newValue: TextOrientation) => (textOrientation = newValue)}
					/>
				</div>

				<div class="flex flex-col gap-3">
					<label for="textAlign" class="text-sm font-heading text-foreground">Alignment</label>
					<TextAlignmentSelector
						{textAlign}
						onTextAlignmentChange={(newValue: TextAlignment) => (textAlign = newValue)}
					/>
				</div>
			</div>

			<h3 class="text-center text-base font-heading">Border</h3>

			<div class="flex flex-col gap-3">
				<BorderStyleSelector
					{borderStyle}
					onBorderStyleChange={(newValue: BorderStyle) => (borderStyle = newValue)}
				/>
			</div>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="borderRadius" class="text-sm font-heading text-foreground">Radius</label>

				<Slider
					id="borderRadius"
					type="single"
					bind:value={borderRadiusValue}
					min={0}
					max={100}
					step={2}
				/>
			</div>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="borderWidth" class="text-sm font-heading text-foreground">Width</label>
				<Slider
					id="borderWidth"
					type="single"
					bind:value={borderWidthValue}
					min={0}
					max={10}
					step={1}
				/>
			</div>

			<div class="flex items-center justify-between gap-2">
				<label for="borderColor" class="text-sm font-heading text-foreground">Color</label>
				<input
					type="color"
					id="borderColor"
					bind:value={borderColor}
					class="h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
				/>
			</div>

			<label class="mt-4 flex cursor-pointer items-center gap-3">
				<button
					type="button"
					role="checkbox"
					aria-checked={isProfile}
					class="flex h-5 w-5 items-center justify-center rounded-base border-2 border-border bg-background transition-colors"
					class:bg-primary={isProfile}
					onclick={() => (isProfile = !isProfile)}
				>
					{#if isProfile}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3 w-3 text-primary-foreground"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					{/if}
				</button>
				<span class="text-sm font-heading text-foreground">Set as Profile Post</span>
			</label>

			<Button type="button" class="mt-4 w-full" onclick={handleSubmit}>Submit Post</Button>
		</form>
	</div>
</div>

<!-- Desktop Layout - Split Screen -->
<div class="hidden h-screen bg-background lg:flex">
	<!-- Left Side - Preview -->
	<div class="flex w-1/2 flex-col border-r-4 border-border bg-secondary-background">
		<div class="relative flex flex-1 items-center justify-center overflow-auto p-8">
			<Post
				{borderRadius}
				{borderColor}
				{borderWidth}
				{borderStyle}
				{paddingTop}
				{paddingRight}
				{paddingBottom}
				{paddingLeft}
				{textSize}
				{textOrientation}
				{textAlign}
				{fontFamily}
				{fontWeight}
				{fontStyle}
				{content}
				{backgroundColor}
				{textColor}
				editable={true}
				onContentChange={(value) => (content = value)}
			/>
			<div class="absolute top-4 left-4">
				<AccessibilityBanner {textColor} {backgroundColor} textSize={textSizeValue} {fontWeight} />
			</div>
		</div>
	</div>

	<!-- Right Side - Form -->
	<div class="w-1/2 overflow-y-auto bg-secondary-background p-8">
		<form class="mx-auto flex max-w-md flex-col gap-8 pb-8">
			<h2 class="text-center text-lg font-heading">Style your Post!</h2>

			<div class="grid grid-cols-2 gap-8 text-sm">
				<div class="flex items-center justify-between gap-2">
					<label for="textColor-desktop" class="font-bold">Text</label>
					<input
						type="color"
						id="textColor-desktop"
						bind:value={textColor}
						class="h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
					/>
				</div>

				<div class="flex items-center justify-between gap-2">
					<label for="backgroundColor-desktop" class="font-bold">Background</label>
					<input
						type="color"
						id="backgroundColor-desktop"
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

			<h3 class="text-center text-base font-heading">Typography</h3>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="textSize-desktop" class="text-sm font-heading text-foreground">Text Size</label>
				<Slider
					id="textSize-desktop"
					type="single"
					bind:value={textSizeValue}
					min={8}
					max={48}
					step={2}
				/>
			</div>

			<div class="flex flex-col gap-3">
				<label for="fontWeight-desktop" class="text-sm font-heading text-foreground"
					>Font Weight</label
				>
				<div class="flex gap-2">
					<Button
						type="button"
						variant={fontWeight === '300' ? 'default' : 'outline'}
						class="flex-1 font-light"
						onclick={() => (fontWeight = '300')}
					>
						Light
					</Button>
					<Button
						type="button"
						variant={fontWeight === '400' ? 'default' : 'outline'}
						class="flex-1 font-normal"
						onclick={() => (fontWeight = '400')}
					>
						Normal
					</Button>
					<Button
						type="button"
						variant={fontWeight === '700' ? 'default' : 'outline'}
						class="flex-1 font-bold"
						onclick={() => (fontWeight = '700')}
					>
						Bold
					</Button>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<label for="fontStyle-desktop" class="text-sm font-heading text-foreground"
					>Font Style</label
				>
				<div class="flex gap-2">
					<Button
						type="button"
						variant={fontStyle === 'normal' ? 'default' : 'outline'}
						class="flex-1"
						onclick={() => (fontStyle = 'normal')}
					>
						Normal
					</Button>
					<Button
						type="button"
						variant={fontStyle === 'italic' ? 'default' : 'outline'}
						class="flex-1 italic"
						onclick={() => (fontStyle = 'italic')}
					>
						Italic
					</Button>
					<Button
						type="button"
						variant={fontStyle === 'oblique' ? 'default' : 'outline'}
						class="flex-1"
						style="font-style: oblique;"
						onclick={() => (fontStyle = 'oblique')}
					>
						Oblique
					</Button>
				</div>
			</div>

			<div class="font-select-container relative flex flex-col gap-3">
				<label for="fontFamily-desktop" class="text-sm font-heading text-foreground"
					>Font Family</label
				>
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
						class="absolute top-[calc(100%+4px)] right-0 left-0 z-50 flex max-h-75 flex-col overflow-y-auto rounded-base border-3 border-border bg-secondary-background shadow-shadow"
					>
						{#each fontFamilies as font (font.value)}
							<button
								type="button"
								class="cursor-pointer border-b-3 border-border bg-secondary-background p-3 text-left text-sm font-base transition-colors last:border-b-0 hover:bg-primary hover:text-primary-foreground {font.value ===
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
					<label for="textOrientation-desktop" class="text-sm font-heading text-foreground"
						>Orientation</label
					>
					<TextOrientationSelector
						{textOrientation}
						setTextOrientation={(newValue: TextOrientation) => (textOrientation = newValue)}
					/>
				</div>

				<div class="flex flex-col gap-3">
					<label for="textAlign-desktop" class="text-sm font-heading text-foreground"
						>Alignment</label
					>
					<TextAlignmentSelector
						{textAlign}
						onTextAlignmentChange={(newValue: TextAlignment) => (textAlign = newValue)}
					/>
				</div>
			</div>

			<h3 class="text-center text-base font-heading">Border</h3>

			<div class="flex flex-col gap-3">
				<BorderStyleSelector
					{borderStyle}
					onBorderStyleChange={(newValue: BorderStyle) => (borderStyle = newValue)}
				/>
			</div>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="borderRadius-desktop" class="text-sm font-heading text-foreground">Radius</label
				>

				<Slider
					id="borderRadius-desktop"
					type="single"
					bind:value={borderRadiusValue}
					min={0}
					max={100}
					step={2}
				/>
			</div>

			<div class="grid grid-cols-2 items-center gap-4">
				<label for="borderWidth-desktop" class="text-sm font-heading text-foreground">Width</label>
				<Slider
					id="borderWidth-desktop"
					type="single"
					bind:value={borderWidthValue}
					min={0}
					max={10}
					step={1}
				/>
			</div>

			<div class="flex items-center justify-between gap-2">
				<label for="borderColor-desktop" class="text-sm font-heading text-foreground">Color</label>
				<input
					type="color"
					id="borderColor-desktop"
					bind:value={borderColor}
					class="h-10 w-10 cursor-pointer rounded-base border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
				/>
			</div>

			<label class="mt-4 flex cursor-pointer items-center gap-3">
				<button
					type="button"
					role="checkbox"
					aria-checked={isProfile}
					class="flex h-5 w-5 items-center justify-center rounded-base border-2 border-border bg-background transition-colors"
					class:bg-primary={isProfile}
					onclick={() => (isProfile = !isProfile)}
				>
					{#if isProfile}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3 w-3 text-primary-foreground"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					{/if}
				</button>
				<span class="text-sm font-heading text-foreground">Set as Profile Post</span>
			</label>

			<Button type="button" class="mt-4 w-full" onclick={handleSubmit}>Submit Post</Button>
		</form>
	</div>
</div>
