import { Assets, Container } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { useApp } from "@pixi/react";
import { useEffect } from "react";

type Props = {
	xOffset: number;
	yOffset: number;
};

export const TileMap = ({ xOffset, yOffset }: Props) => {
	// xOffset = xOffset ?? 0;
	// yOffset = yOffset ?? 0;

	const app = useApp();
	const container = new Container();

	useEffect(() => {
		app.stage.addChild(container);

		const tilemap = new CompositeTilemap();
		tilemap.scale.set(2);
		container.addChild(tilemap);

		// Set up tilemap
		(async () => {
			Assets.add({ alias: 'atlas', src: 'src/assets/tiles/atlas.json' });
			await Assets.load(['atlas']);

			tilemap.clear();

			const size = 32;
			// if you are too lazy, just specify filename and pixi will find it in cache
			for (let i = 0; i < 7; i++)
				{
						for (let j = 0; j < 5; j++)
						{
								tilemap.tile('grass.png', i * size, j * size);

								if (i % 2 === 1 && j % 2 === 1)
								{
										tilemap.tile('tough.png', i * size, j * size);
								}
						}
				}
		})();

		return () => {
			app.stage?.removeChild(container);
			tilemap.destroy();
		};
	}, [app]);

	useEffect(() => {
		container.x = xOffset;
		container.y = yOffset;
	}, [xOffset, yOffset]);

	return null;
};
