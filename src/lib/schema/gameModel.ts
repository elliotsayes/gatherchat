import { ContractPost } from "../ao-gather";

export type Position = {
	x: number;
	y: number;
};

export type AoToonBase = {
	id: string;
	avatarSeed: string;
	displayName: string;
};

export type AoToonSaved = AoToonBase & {
	savedPosition: Position;
	isFollowing: boolean;
};

export type AoToonMaybeSaved = AoToonBase & {
	savedPosition?: Position;
};

export type AoUsersState = {
	user: AoToonMaybeSaved;
	otherToons: AoToonSaved[];
};

export type AoPostsState = (ContractPost & { id: string })[];
