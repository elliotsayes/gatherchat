import { Assets } from "pixi.js";
import { applyDefaultProps, PixiComponent } from "@pixi/react";
import { CompositeTilemap } from "@pixi/tilemap";

type Props = {
	// path: string;
	// xOffset: number;
	// yOffset: number;
};

export const tileSize = 16;
export const roomTilesX = 21;
export const roomTilesY = 13;

export const blockSpacingX = 4	;
export const blockSpacingY = 4;

export const windowSpacing = 3;

export const Tilemap3 = PixiComponent("TileMap3", {
	create: () => {
		return new CompositeTilemap();
	},
	didMount: async (instance) => {
		Assets.add({ alias: "drum", src: "assets/tiles/drum.json" });
		await Assets.load(["drum"]);

		instance.clear();
		instance.scale.set(4);

		// if you are too lazy, just specify filename and pixi will find it in cache
		for (let x = 0; x < roomTilesX; x++) {
			for (let y = 0; y < roomTilesY; y++) {
				if (x === 0) {
					if (y === 0) {
						instance.tile("room_0_0", x * tileSize, y * tileSize);
					} else if (y === roomTilesY - 1) {
						instance.tile("room_0_3", x * tileSize, y * tileSize);
					} else {
						instance.tile("room_0_2", x * tileSize, y * tileSize);
					}
				} else if (x === 1) {
					if (y === 0) {
						instance.tile("room_1_0", x * tileSize, y * tileSize);
					} else if (y === 1) {
						instance.tile("room_1_1", x * tileSize, y * tileSize);
					} else if (y === roomTilesY - 1) {
						instance.tile("room_1_3", x * tileSize, y * tileSize);
					} else {
						instance.tile("room_1_2", x * tileSize, y * tileSize);
					}
				} else if (x === roomTilesX - 1) {
					if (y === 0) {
						instance.tile("room_4_0", x * tileSize, y * tileSize);
					} else if (y === roomTilesY - 1) {
						instance.tile("room_4_3", x * tileSize, y * tileSize);
					} else {
						instance.tile("room_4_2", x * tileSize, y * tileSize);
					}
				} else if (x % windowSpacing === 0) {
					if (y === 0) {
						instance.tile("room_2_0", x * tileSize, y * tileSize);
					} else if (y === 1) {
						instance.tile("room_2_1", x * tileSize, y * tileSize);
					}  else if (y === 2) {
						instance.tile("room_2_2", x * tileSize, y * tileSize);
					} else if (y === roomTilesY - 1) {
						instance.tile("room_2_3", x * tileSize, y * tileSize);
					} else {
						instance.tile("room_3_2", x * tileSize, y * tileSize);
					}
				} else {
					if (y === 0) {
						instance.tile("room_3_0", x * tileSize, y * tileSize);
					} else if (y === 1) {
						instance.tile("room_3_1", x * tileSize, y * tileSize);
					} else if (y === roomTilesY - 1) {
						instance.tile("room_3_3", x * tileSize, y * tileSize);
					} else {
						instance.tile("room_3_2", x * tileSize, y * tileSize);
					}
				}

				if (x > 0 && x < roomTilesX - 1 && y > 0 && y < roomTilesY - 2 && x % blockSpacingX === 0) {
					if (y % blockSpacingY === 0) {
						instance.tile("tree_0_1", x * tileSize, y * tileSize);
					}
					if (((y + 1) % blockSpacingY) === 0) {
						instance.tile("tree_0_0", x * tileSize, y * tileSize);
					}
				}
			}
		}
	},

	applyProps: (instance, oldProps: Props, newProps: Props) => {
		const { ...oldP } = oldProps;
		const { ...newP } = newProps;

		// apply rest props to instance
		applyDefaultProps(instance, oldP, newP);
	},
});
