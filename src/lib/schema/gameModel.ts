import type { ContractPost } from "../ao-gather";

export type Position = {
	x: number;
	y: number;
};

export type Dimension = {
	w: number;
	h: number;
};

export type Rect = {
	pos: Position;
	dim: Dimension;
}

export type AoToonBase = {
	id: string;
	avatarSeed: string;
	displayName: string;
	lastSeen: number;
};

export type AoToonSaved = AoToonBase & {
	savedPosition: Position;
	isFollowing: boolean;
};

export type AoToonMaybeSaved = AoToonBase & {
	savedPosition?: Position;
};

export type AoUsersState = {
	user: AoToonSaved;
	otherToons: AoToonSaved[];
};

export type AoPostsState = (ContractPost & { id: string })[];
