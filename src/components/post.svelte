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
		content = 'This is a sample social media post. You can customize its appearance using the form controls!',
		backgroundColor = '#ffffff',
		textColor = '#000000',
		editable = false,
		onContentChange
	}: Props = $props();
</script>

<div
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
	style:background-color={backgroundColor}
	style:color={textColor}
	oninput={(e) => {
		onContentChange?.(e.target?.textContent!); // it exists bro
	}}
	contenteditable={editable}
>
	{content}
</div>

<style>
	.post-container {
		word-wrap: break-word;
		overflow-wrap: break-word;
		max-width: 100%;
		max-height: 50ch;
		overflow-y: auto;
		box-sizing: border-box;
	}

	@media (max-width: 1023px) {
		.post-container {
			max-width: 100%;
		}
	}
</style>
