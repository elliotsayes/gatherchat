import * as fs from "node:fs";

type FrameSet = {
	name: string;
	tiles: { x: number; y: number; w: number; h: number };
};

type Frame = {
	frame: { x: number; y: number; w: number; h: number };
	rotated: boolean;
	trimmed: boolean;
	spriteSourceSize: { x: number; y: number; w: number; h: number };
	sourceSize: { w: number; h: number };
	pivot: { x: number; y: number };
};

const meta = {
	app: "gatherchat",
	version: "1.0",
	image: "drum.png",
	format: "RGBA8888",
	size: { w: 176, h: 160 },
	scale: "1",
	// "smartupdate": "$TexturePacker:SmartUpdate:cd0d17d3f8965456a92be15158a0ed9e:d14942d54a3d3385fdb15258e1ae1a8f:cbce6b53f0f49e0bf15173c25c41f876$"
};

const allFrameSets: FrameSet[] = [
	{
		name: "room",
		tiles: { x: 1, y: 3, w: 5, h: 4 },
	},
	{
		name: "couch",
		tiles: { x: 1, y: 0, w: 2, h: 2 },
	},
	{
		name: "tv",
		tiles: { x: 3, y: 0, w: 2, h: 2 },
	},
	{
		name: "tree",
		tiles: { x: 2, y: 7, w: 1, h: 2 },
	},
];

const tileSize = {
	w: 16,
	h: 16,
};

function frameSetToFrames(frameSet: FrameSet): Record<string, Frame> {
	const frameIndicies = {
		x: Array(frameSet.tiles.w)
			.fill(0)
			.map((_, i) => i),
		y: Array(frameSet.tiles.h)
			.fill(0)
			.map((_, i) => i),
	};

	const frames = frameIndicies.y.flatMap((y) => {
		return frameIndicies.x.map((x) => {
			const name = `${frameSet.name}_${x}_${y}`;
			const globalOffset = {
				x: x + frameSet.tiles.x,
				y: y + frameSet.tiles.y,
			};
			return {
				[name]: {
					frame: {
						x: globalOffset.x * tileSize.w,
						y: globalOffset.y * tileSize.h,
						w: tileSize.w,
						h: tileSize.h,
					},
					rotate: false,
					trimmed: false,
					spriteSourceSize: {
						x: 0,
						y: 0,
						w: tileSize.w,
						h: tileSize.h,
					},
					sourceSize: {
						w: tileSize.w,
						h: tileSize.h,
					},
					pivot: {
						x: 0.5,
						y: 0.5,
					},
				},
			};
		});
	});

	return Object.assign({}, ...frames);
}

fs.writeFileSync(
	"./public/assets/tiles/drum.json",
	JSON.stringify(
		{
			meta,
			frames: Object.assign({}, ...allFrameSets.map(frameSetToFrames)),
		},
		null,
		2,
	),
);
