<script lang="ts">
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
		padding?: string;
		textSize?: string;
		width?: string;
		height?: string;
		textOrientation?: string;
		fontFamily?: string;
		fontWeight?: string;
		content?: string;
		backgroundColor?: string;
	}

	let {
		borderRadius = '8px',
		padding = '16px',
		textSize = '16px',
		width = '400px',
		height = 'auto',
		textOrientation = 'horizontal-tb',
		fontFamily = 'system-ui, sans-serif',
		fontWeight = '400',
		content = 'This is a sample social media post. You can customize its appearance using the form controls!',
		backgroundColor = '#ffffff'
	}: Props = $props();
</script>

<div
	class="post-container"
	style:border-radius={borderRadius}
	style:padding
	style:font-size={textSize}
	style:width
	style:height
	style:writing-mode={textOrientation}
	style:font-family={fontFamily}
	style:font-weight={fontWeight}
	style:background-color={backgroundColor}
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
