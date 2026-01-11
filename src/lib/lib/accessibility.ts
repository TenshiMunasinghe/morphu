/**
 * Accessibility utilities for checking post styling issues
 */

export interface AccessibilityWarning {
	message: string;
}

export interface PostStyleProps {
	textColor: string;
	backgroundColor: string;
	textSize: number;
	fontWeight: string;
}

/**
 * Parse a hex color string to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) {
		return { r: 0, g: 0, b: 0 };
	}
	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	};
}

/**
 * Calculate relative luminance of a color (WCAG formula)
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
	const [rs, gs, bs] = [r, g, b].map((c) => {
		const sRGB = c / 255;
		return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
	const rgb1 = hexToRgb(color1);
	const rgb2 = hexToRgb(color2);

	const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
	const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);

	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text qualifies as "large text" per WCAG guidelines
 * Large text: 18px+ or 14px+ bold (700 weight)
 */
function isLargeText(textSize: number, fontWeight: string): boolean {
	return textSize >= 18 || (textSize >= 14 && fontWeight === '700');
}

/**
 * Check post styling for accessibility warnings
 */
export function checkAccessibility(props: PostStyleProps): AccessibilityWarning[] {
	const warnings: AccessibilityWarning[] = [];

	const { textColor, backgroundColor, textSize, fontWeight } = props;

	// 1. Color contrast check
	const contrastRatio = getContrastRatio(textColor, backgroundColor);
	const largeText = isLargeText(textSize, fontWeight);
	const minRatio = largeText ? 3 : 4.5;

	if (contrastRatio < minRatio) {
		warnings.push({
			message: `Low contrast (${contrastRatio.toFixed(1)}:1). Recommended: ${minRatio}:1 minimum`
		});
	}

	// 2. Text size too small
	if (textSize < 12) {
		warnings.push({
			message: 'Text size below 12px may be difficult to read'
		});
	}

	// 3. Light font weight with small text
	if (fontWeight === '300' && textSize < 16) {
		warnings.push({
			message: 'Light font weight with small text may reduce readability'
		});
	}

	return warnings;
}
