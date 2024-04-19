export type AoToon = {
	id: string;
	avatarSeed: string;
	displayName: string;
	savedPosition: {
		x: number;
		y: number;
	};
};

export type AoState = {
	user: AoToon;
	otherToons: AoToon[];
};
