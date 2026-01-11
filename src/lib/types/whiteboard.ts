export interface PostPlacement {
	postId: string;
	x: number;
	y: number;
	zIndex?: number;
}

export interface WhiteboardState {
	placements: PostPlacement[];
}

export interface UserProfile {
	username: string;
	userId: string;
	birthday?: string;
	bio?: string;
}
