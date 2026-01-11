export interface PostPlacement {
	postId: string;
	x: number;
	y: number;
	zIndex?: number;
}

export interface WhiteboardState {
	placements: PostPlacement[];
}
