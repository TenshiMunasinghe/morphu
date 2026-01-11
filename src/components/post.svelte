<script lang="ts">
	import type { TextAlignment } from './textAlignmentSelector.svelte';
	import type { TextOrientation } from './textOrientationSelector.svelte';
	import type { BorderStyle } from './borderStyleSelector.svelte';

	interface Props {
		borderRadius?: string;
		borderColor?: string;
		borderWidth?: string;
		borderStyle?: BorderStyle;
		borderTopLeftRadius?: string;
		borderTopRightRadius?: string;
		borderBottomLeftRadius?: string;
		borderBottomRightRadius?: string;
		paddingTop?: string;
		paddingRight?: string;
		paddingBottom?: string;
		paddingLeft?: string;
		textSize?: string;
		textOrientation?: TextOrientation;
		textAlign?: TextAlignment;
		fontFamily?: string;
		fontWeight?: string;
		fontStyle?: 'normal' | 'italic' | 'oblique';
		content?: string;
		backgroundColor?: string;
		textColor?: string;
		editable?: boolean;
		onContentChange?: (value: string) => void;
	}

	let {
		borderColor = '#000000',
		borderWidth = '2px',
		borderStyle = 'solid',
		borderRadius = '8px',
		paddingTop = '16px',
		paddingRight = '16px',
		paddingBottom = '16px',
		paddingLeft = '16px',
		textSize = '16px',
		textOrientation = 'horizontal-tb',
		textAlign = 'left',
		fontFamily = 'system-ui, sans-serif',
		fontWeight = '400',
		fontStyle = 'normal',
		content = 'This is a sample social media post. You can customize its appearance using the form controls!',
		backgroundColor = '#ffffff',
		textColor = '#000000',
		editable = false,
		onContentChange
	}: Props = $props();

	let containerEl: HTMLDivElement | undefined = $state();

	// Sync content to element using innerText (preserves newlines, XSS-safe)
	$effect(() => {
		if (containerEl && !editable) {
			containerEl.innerText = content;
		}
	});

	// For editable mode, only set initial content
	$effect(() => {
		if (containerEl && editable && containerEl.innerText !== content) {
			// Only set if element is empty (initial mount)
			if (containerEl.innerText === '') {
				containerEl.innerText = content;
			}
		}
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLElement;
		onContentChange?.(target.innerText);
	}
</script>

<div
	bind:this={containerEl}
	class="post-container"
	style:border-radius={borderRadius}
	style:border-width={borderWidth}
	style:border-color={borderColor}
	style:border-style={borderStyle}
	style:padding-top={paddingTop}
	style:padding-right={paddingRight}
	style:padding-bottom={paddingBottom}
	style:padding-left={paddingLeft}
	style:font-size={textSize}
	style:writing-mode={textOrientation}
	style:text-align={textAlign}
	style:font-family={fontFamily}
	style:font-weight={fontWeight}
	style:font-style={fontStyle}
	style:background-color={backgroundColor}
	style:color={textColor}
	style:white-space="pre"
	oninput={handleInput}
	contenteditable={editable}
></div>

<style>
	.post-container {
		max-height: 50ch;
		box-sizing: border-box;
	}
</style>
