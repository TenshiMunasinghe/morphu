export interface PostPlacement {
	postId: string;
	x: number;
	y: number;
	zIndex?: number;
}

export interface WhiteboardState {
	placements: PostPlacement[];
	profilePlacement?: ProfilePlacement;
}

export interface UserProfile {
	id: string;
	username: string;
	avatarUrl?: string;
	bio?: string;
}

export interface ProfilePlacement {
	userProfileId: string;
	x: number;
	y: number;
	zIndex?: number;
}
