import { Assets } from "pixi.js";
import { applyDefaultProps, PixiComponent } from "@pixi/react";
import { CompositeTilemap } from "@pixi/tilemap";

type Props = {
	// path: string;
	// xOffset: number;
	// yOffset: number;
};

export const Tilemap3 = PixiComponent("TileMap3", {
	create: () => {
		return new CompositeTilemap();
	},
	didMount: async (instance) => {
		Assets.add({ alias: "atlas", src: "src/assets/tiles/atlas.json" });
		await Assets.load(["atlas"]);

		instance.clear();
		instance.scale.set(2);

		const size = 32;
		const xDim = 11;
		const yDim = 9;

		// if you are too lazy, just specify filename and pixi will find it in cache
		for (let x = 0; x < xDim; x++) {
			for (let y = 0; y < yDim; y++) {
				instance.tile("grass.png", x * size, y * size);

				if (x % 2 === 0 && y % 2 === 0) {
					instance.tile("tough.png", x * size, y * size);
				}

				if (y === yDim - 1) {
					instance.tile("brick_wall.png", x * size, y * size);
				} else if (x === 0 || x === xDim - 1) {
					instance.tile("brick.png", x * size, y * size);
				} else if (y === 0) {
					instance.tile("brick_wall.png", x * size, y * size);
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
