import type { Dimension } from "@/features/render/lib/schema";
import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { CompositeTilemap } from "@pixi/tilemap";

export const tileSize = 16;

export const blockSpacing: Dimension = {
	w: 4,
	h: 4,
};

export const blockLocations = (
	roomSizeTiles: Dimension,
	blockSpacing: Dimension,
) => {
	const locations: { x: number; y: number }[] = [];
	for (let x = 0; x < roomSizeTiles.w; x++) {
		for (let y = 0; y < roomSizeTiles.h; y++) {
			if (
				x > 0 &&
				x < roomSizeTiles.w - 1 &&
				y > 0 &&
				y < roomSizeTiles.h - 2 &&
				x % blockSpacing.w === 0
			) {
				if ((y + 1) % blockSpacing.h === 0) {
					locations.push({ x, y });
				}
			}
		}
	}
	return locations;
};

export const windowSpacing = 3;

interface Props {
	tileSet: string;
	roomSizeTiles: Dimension;
	windowSpacing: number;
}

const setupInstance = (instance: CompositeTilemap, props: Props) => {
	instance.clear();
	instance.scale.set(4);

	const { tileSet, roomSizeTiles, windowSpacing } = props;

	for (let x = 0; x < roomSizeTiles.w; x++) {
		for (let y = 0; y < roomSizeTiles.h; y++) {
			if (x === 0) {
				if (y === 0) {
					instance.tile(`${tileSet}_0_0`, x * tileSize, y * tileSize);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_0_3`, x * tileSize, y * tileSize);
				} else {
					instance.tile(`${tileSet}_0_2`, x * tileSize, y * tileSize);
				}
			} else if (x === 1) {
				if (y === 0) {
					instance.tile(`${tileSet}_1_0`, x * tileSize, y * tileSize);
				} else if (y === 1) {
					instance.tile(`${tileSet}_1_1`, x * tileSize, y * tileSize);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_1_3`, x * tileSize, y * tileSize);
				} else {
					instance.tile(`${tileSet}_1_2`, x * tileSize, y * tileSize);
				}
			} else if (x === roomSizeTiles.w - 1) {
				if (y === 0) {
					instance.tile(`${tileSet}_4_0`, x * tileSize, y * tileSize);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_4_3`, x * tileSize, y * tileSize);
				} else {
					instance.tile(`${tileSet}_4_2`, x * tileSize, y * tileSize);
				}
			} else if (x % windowSpacing === 0) {
				if (y === 0) {
					instance.tile(`${tileSet}_2_0`, x * tileSize, y * tileSize);
				} else if (y === 1) {
					instance.tile(`${tileSet}_2_1`, x * tileSize, y * tileSize);
				} else if (y === 2) {
					instance.tile(`${tileSet}_2_2`, x * tileSize, y * tileSize);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_2_3`, x * tileSize, y * tileSize);
				} else {
					instance.tile(`${tileSet}_3_2`, x * tileSize, y * tileSize);
				}
			} else {
				if (y === 0) {
					instance.tile(`${tileSet}_3_0`, x * tileSize, y * tileSize);
				} else if (y === 1) {
					instance.tile(`${tileSet}_3_1`, x * tileSize, y * tileSize);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_3_3`, x * tileSize, y * tileSize);
				} else {
					instance.tile(`${tileSet}_3_2`, x * tileSize, y * tileSize);
				}
			}
		}
	}
};

export const ObstacleLayout = PixiComponent<Props, CompositeTilemap>(
	"ObstacleLayout",
	{
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
	},
);
