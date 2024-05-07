import type { Position } from "@/features/render/lib/schema";
import type { ContractPost } from "../../ao/lib/ao-gather";

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
