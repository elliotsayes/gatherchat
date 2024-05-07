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
};

export type Bounds = {
	tl: Position;
	br: Position;
};
