import type { PostData } from '$lib/types/post';
import type { WhiteboardState } from '$lib/types/whiteboard';

const POSTS_STORAGE_KEY = 'morphu_posts';
const WHITEBOARD_STORAGE_KEY = 'morphu_whiteboard';

/**
 * Save a new post to localStorage
 */
export function savePost(post: PostData): void {
	const posts = getPosts();
	posts.push(post);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
	}
}

/**
 * Get all posts from localStorage
 */
export function getPosts(): PostData[] {
	if (typeof localStorage === 'undefined') {
		return [];
	}
	const stored = localStorage.getItem(POSTS_STORAGE_KEY);
	if (!stored) {
		return [];
	}
	try {
		return JSON.parse(stored) as PostData[];
	} catch {
		return [];
	}
}

/**
 * Delete a post by ID from localStorage
 */
export function deletePost(postId: string): void {
	const posts = getPosts().filter((p) => p.id !== postId);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
	}
}

/**
 * Save whiteboard state to localStorage
 */
export function saveWhiteboardState(state: WhiteboardState): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(WHITEBOARD_STORAGE_KEY, JSON.stringify(state));
	}
}

/**
 * Get whiteboard state from localStorage
 */
export function getWhiteboardState(): WhiteboardState | null {
	if (typeof localStorage === 'undefined') {
		return null;
	}
	const stored = localStorage.getItem(WHITEBOARD_STORAGE_KEY);
	if (!stored) {
		return null;
	}
	try {
		return JSON.parse(stored) as WhiteboardState;
	} catch {
		return null;
	}
}

/**
 * Update a single post placement in whiteboard state
 */
export function updatePostPlacement(postId: string, x: number, y: number, zIndex?: number): void {
	const state = getWhiteboardState() || { placements: [] };
	const existingIndex = state.placements.findIndex((p) => p.postId === postId);

	if (existingIndex >= 0) {
		state.placements[existingIndex] = { postId, x, y, zIndex };
	} else {
		state.placements.push({ postId, x, y, zIndex });
	}

	saveWhiteboardState(state);
}

/**
 * Add a new post placement to whiteboard state
 */
export function addPostPlacement(postId: string, x: number, y: number): void {
	const state = getWhiteboardState() || { placements: [] };
	const maxZIndex = Math.max(0, ...state.placements.map((p) => p.zIndex || 0));
	state.placements.push({ postId, x, y, zIndex: maxZIndex + 1 });
	saveWhiteboardState(state);
}
