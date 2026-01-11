import type { TextAlignment } from '../../components/textAlignmentSelector.svelte';
import type { TextOrientation } from '../../components/textOrientationSelector.svelte';
import type { BorderStyle } from '../../components/borderStyleSelector.svelte';

export interface PostStyle {
	borderRadius: string;
	borderColor: string;
	borderWidth: string;
	borderStyle: BorderStyle;
	paddingTop: string;
	paddingRight: string;
	paddingBottom: string;
	paddingLeft: string;
	textSize: string;
	textOrientation: TextOrientation;
	textAlign: TextAlignment;
	fontFamily: string;
	fontWeight: string;
	fontStyle: 'normal' | 'italic' | 'oblique';
	backgroundColor: string;
	textColor: string;
}

export interface PostData {
	id: string;
	content: string;
	style: PostStyle;
	createdAt: string;
}

export function generatePostId(): string {
	return `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
