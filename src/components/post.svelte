<script lang="ts">
	import type { TextAlignment } from './textAlignmentSelector.svelte';
	import type { TextOrientation } from './textOrientationSelector.svelte';

	interface Props {
		borderRadius?: string;
		border?: string;
		borderColor?: string;
		borderWidth?: string;
		borderStyle?: string;
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
	}

	let {
		border,
		borderColor,
		borderWidth,
		borderStyle,
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
		textColor = '#000000'
	}: Props = $props();
</script>

<div
	class="post-container"
	style:border-radius={borderRadius}
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
>
	{content}
</div>

<style>
	.post-container {
		word-wrap: break-word;
		overflow-wrap: break-word;
		max-width: 100%;
		box-sizing: border-box;
	}

	@media (max-width: 1023px) {
		.post-container {
			max-width: 100%;
		}
	}
</style>
