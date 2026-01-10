<script lang="ts">
	import Post from './post.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Slider } from '$lib/components/ui/slider/index';
	import PaddingSelector from './paddingSelector.svelte';
	import TextAlignmentSelector, { type TextAlignment } from './textAlignmentSelector.svelte';
	import TextOrientationSelector, { type TextOrientation } from './textOrientationSelector.svelte';

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

	const textOrientations = [
		{ value: 'horizontal-tb', label: 'Horizontal' },
		{ value: 'vertical-rl', label: 'Vertical (Right to Left)' },
		{ value: 'vertical-lr', label: 'Vertical (Left to Right)' }
	];

	const textAlignments = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' },
		{ value: 'justify', label: 'Justify' }
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

<div class="demo-container">
	<!-- Preview Section - Fixed at top on mobile -->
	<div class="preview-section">
		<h2 class="preview-title">Preview</h2>
		<div class="preview-container">
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
	<div class="form-section">
		<form class="customization-form">
			<div class="form-group">
				<label for="content">Post Content</label>
				<textarea
					id="content"
					bind:value={content}
					rows="4"
					placeholder="Enter your post content..."
				></textarea>
			</div>

			<div class="form-group">
				<div>Padding</div>
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

			<div class="form-row">
				<label for="borderRadius">Border Radius</label>
				<Slider
					id="borderRadius"
					type="single"
					bind:value={borderRadiusValue}
					min={0}
					max={50}
					step={2}
				/>
			</div>

			<div class="form-row">
				<label for="textSize">Text Size</label>
				<Slider id="textSize" type="single" bind:value={textSizeValue} min={8} max={48} step={2} />

				<div class="form-group">
					<label for="fontWeight">Font Weight</label>
					<select id="fontWeight" bind:value={fontWeight}>
						<option value="100">100 (Thin)</option>
						<option value="200">200 (Extra Light)</option>
						<option value="300">300 (Light)</option>
						<option value="400">400 (Normal)</option>
						<option value="500">500 (Medium)</option>
						<option value="600">600 (Semi Bold)</option>
						<option value="700">700 (Bold)</option>
						<option value="800">800 (Extra Bold)</option>
						<option value="900">900 (Black)</option>
					</select>
				</div>
			</div>

			<div class="form-group font-select-container">
				<label for="fontFamily">Font Family</label>
				<Button
					type="button"
					class="font-select-trigger"
					onclick={toggleFontSelect}
					aria-expanded={isFontSelectOpen}
					aria-haspopup="listbox"
				>
					<span class="font-select-value" style:font-family={selectedFont.font}>
						{selectedFont.label}
					</span>
					<svg
						class="font-select-icon"
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
					<div class="font-select-content">
						{#each fontFamilies as font (font.value)}
							<button
								type="button"
								class="font-select-item"
								class:active={font.value === fontFamily}
								onclick={() => selectFont(font.value)}
								style:font-family={font.font}
							>
								{font.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="textOrientation">Text Orientation</label>
					<TextOrientationSelector
						{textOrientation}
						setTextOrientation={(textOrientation: TextOrientation) =>
							(textOrientation = textOrientation)}
					/>
				</div>

				<div class="form-group">
					<label for="textAlign">Text Alignment</label>
					<TextAlignmentSelector
						{textAlign}
						onTextAlignmentChange={(newValue: TextAlignment) => (textAlign = newValue)}
					/>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="textColor">Text Color</label>
					<div class="color-input-group">
						<input type="color" id="textColor" bind:value={textColor} />
						<input
							type="text"
							bind:value={textColor}
							placeholder="#000000"
							class="color-text-input"
						/>
					</div>
				</div>

				<div class="form-group">
					<label for="backgroundColor">Background Color</label>
					<div class="color-input-group">
						<input type="color" id="backgroundColor" bind:value={backgroundColor} />
						<input
							type="text"
							bind:value={backgroundColor}
							placeholder="#ffffff"
							class="color-text-input"
						/>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	.demo-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		position: relative;
	}

	/* Preview Section - Fixed at top on mobile */
	.preview-section {
		background: white;
		border-radius: 0 0 12px 12px;
		padding: 0.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
		z-index: 10;
		width: 100%;
	}

	.preview-title {
		font-size: 0.75rem;
		font-weight: 300;
		color: #ffffff;
		background: #363636;
		text-align: center;
		position: absolute;
		padding: 0.25rem;
		border-radius: 0.5rem;
		bottom: 0.5rem;
		right: 0.5rem;
		z-index: 10;
		opacity: 1;
	}

	.preview-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: #f9fafb;
		border-radius: 8px;
		min-height: 200px;
		max-height: 300px;
		overflow: auto;
	}

	/* Form Section - At bottom on mobile */
	.form-section {
		background: white;
		border-radius: 12px 12px 0 0;
		padding: 1.5rem;
		box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
		flex: 1;
		overflow-y: auto;
		margin-top: auto;
	}

	.customization-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding-bottom: 2rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-weight: 600;
		color: #374151;
		font-size: 0.875rem;
	}

	.padding-quick-controls {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
		padding: 1rem;
		background: #eff6ff;
		border-radius: 8px;
		border: 1px solid #bfdbfe;
	}

	.padding-quick-controls .form-group {
		margin: 0;
	}

	.padding-controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
		background: #f9fafb;
	}

	.padding-controls .form-group {
		margin: 0;
	}

	@media (max-width: 1023px) {
		.padding-quick-controls {
			grid-template-columns: 1fr;
		}
	}

	.section-label {
		font-weight: 600;
		color: #374151;
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.form-group input[type='text'],
	.form-group textarea,
	.form-group select {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.875rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		width: 100%;
		box-sizing: border-box;
	}

	.form-group input[type='text']:focus,
	.form-group textarea:focus,
	.form-group select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.color-input-group {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.color-input-group input[type='color'] {
		width: 60px;
		height: 40px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		cursor: pointer;
		flex-shrink: 0;
	}

	.color-text-input {
		flex: 1;
	}

	/* Shadcn-style Select */
	.font-select-container {
		position: relative;
	}

	.font-select-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		font-size: 0.875rem;
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.font-select-trigger:hover {
		border-color: #9ca3af;
	}

	.font-select-trigger[aria-expanded='true'] {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.font-select-value {
		flex: 1;
		text-align: left;
	}

	.font-select-icon {
		width: 15px;
		height: 15px;
		color: #6b7280;
		transition: transform 0.2s;
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	.font-select-trigger[aria-expanded='true'] .font-select-icon {
		transform: rotate(180deg);
	}

	.font-select-content {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		z-index: 50;
		max-height: 300px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.font-select-item {
		padding: 0.75rem;
		text-align: left;
		border: none;
		background: white;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.15s;
		border-radius: 0;
	}

	.font-select-item:first-child {
		border-radius: 6px 6px 0 0;
	}

	.font-select-item:last-child {
		border-radius: 0 0 6px 6px;
	}

	.font-select-item:hover {
		background: #f3f4f6;
	}

	.font-select-item.active {
		background: #eff6ff;
		color: #1e40af;
	}

	/* Desktop Layout */
	@media (min-width: 1024px) {
		.demo-container {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
			padding: 2rem;
			max-width: 1400px;
			margin: 0 auto;
		}

		.preview-section {
			position: relative;
			border-radius: 12px;
			padding: 2rem;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		}

		.preview-title {
			font-size: 1.5rem;
			text-align: left;
		}

		.preview-container {
			padding: 2rem;
			min-height: 400px;
			max-height: none;
		}

		.form-section {
			border-radius: 12px;
			padding: 2rem;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
			margin-top: 0;
			max-height: calc(100vh - 4rem);
		}
	}

	/* Mobile optimizations */
	@media (max-width: 1023px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.preview-container {
			min-height: 150px;
		}
	}
</style>
