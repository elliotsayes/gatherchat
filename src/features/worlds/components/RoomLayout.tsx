import type { Dimension } from "@/features/render/lib/schema";
import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { CompositeTilemap } from "@pixi/tilemap";

export const tileSizeBase: Dimension = {
	w: 16,
	h: 16,
};

export const tileScale = 4;

export const tileSize: Dimension = {
	w: tileSizeBase.w * tileScale,
	h: tileSizeBase.h * tileScale,
};

export const RoomTileSets = ["room"] as const;
export type RoomTileSet = (typeof RoomTileSets)[number];

interface Props {
	tileSet: RoomTileSet;
	roomSizeTiles: Dimension;
	windowSpacing: number;
}

const setupInstance = (instance: CompositeTilemap, props: Props) => {
	instance.clear();
	instance.scale.set(tileScale);

	const { tileSet, roomSizeTiles, windowSpacing } = props;

	// Background tiles
	for (let x = -20; x < roomSizeTiles.w + 20; x++) {
		for (let y = -20; y < roomSizeTiles.h + 20; y++) {
			instance.tile(`${tileSet}_3_2`, x * tileSizeBase.w, y * tileSizeBase.h);
		}
	}

	for (let x = 0; x < roomSizeTiles.w; x++) {
		for (let y = 0; y < roomSizeTiles.h; y++) {
			if (x === 0) {
				if (y === 0) {
					instance.tile(
						`${tileSet}_0_0`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(
						`${tileSet}_0_3`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else {
					instance.tile(
						`${tileSet}_0_2`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				}
			} else if (x === 1) {
				if (y === 0) {
					instance.tile(
						`${tileSet}_1_0`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === 1) {
					instance.tile(
						`${tileSet}_1_1`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(
						`${tileSet}_1_3`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else {
					instance.tile(
						`${tileSet}_1_2`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				}
			} else if (x === roomSizeTiles.w - 1) {
				if (y === 0) {
					instance.tile(
						`${tileSet}_4_0`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(
						`${tileSet}_4_3`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else {
					instance.tile(
						`${tileSet}_4_2`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				}
			} else if (x % windowSpacing === 0) {
				if (y === 0) {
					instance.tile(
						`${tileSet}_2_0`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === 1) {
					instance.tile(
						`${tileSet}_2_1`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === 2) {
					instance.tile(
						`${tileSet}_2_2`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(
						`${tileSet}_2_3`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else {
					instance.tile(
						`${tileSet}_3_2`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				}
			} else {
				if (y === 0) {
					instance.tile(
						`${tileSet}_3_0`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === 1) {
					instance.tile(
						`${tileSet}_3_1`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(
						`${tileSet}_3_3`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				} else {
					instance.tile(
						`${tileSet}_3_2`,
						x * tileSizeBase.w,
						y * tileSizeBase.h,
					);
				}
			}
		}
	}
};

export const RoomLayout = PixiComponent<Props, CompositeTilemap>("RoomLayout", {
	create: (props: Props) => {
		const instance = new CompositeTilemap();

		setupInstance(instance, props);

		return instance;
	},
	// didMount: async (instance) => {},
	applyProps: (instance, oldProps: Props, newProps: Props) => {
		const { ...oldP } = oldProps;
		const { ...newP } = newProps;

		setupInstance(instance, newP);

		// apply rest props to instance
		applyDefaultProps(instance, oldP, newP);
	},
});
