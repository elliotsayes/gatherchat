import InteractableSprite from "@/features/render/components/InteractableSprite";
import { TileLoader } from "@/features/render/components/TileLoader";
import type { Bounds, Dimension, Position } from "@/features/render/lib/schema";
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

export const blockSpacing: Dimension = {
	w: 4,
	h: 4,
};

export const getBlockLocations = (
	roomSizeTiles: Dimension,
	blockSpacing: Dimension,
) => {
	const locations: Position[] = [];
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

export const getCollision = (
	roomSizeTiles: Dimension,
	blockLocations: Position[],
) => {
	const movementBounds: Bounds = {
		tl: {
			x: 1,
			y: 2,
		},
		br: {
			x: roomSizeTiles.w - 2,
			y: roomSizeTiles.h - 2,
		},
	}

	return (
		position: Position,
	) => {
		const { x, y } = position;
		
		const insideBounds =
			x >= movementBounds.tl.x &&
			x <= movementBounds.br.x &&
			y >= movementBounds.tl.y &&
			y <= movementBounds.br.y;
		
		const	onBlock =
			blockLocations.some(
				(bl) =>
					bl.x === x && (bl.y === y || bl.y === y - 1),
			);

		console.log({ insideBounds, onBlock })
		
		return !insideBounds || onBlock;
	}
}

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
					instance.tile(`${tileSet}_0_0`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_0_3`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else {
					instance.tile(`${tileSet}_0_2`, x * tileSizeBase.w, y * tileSizeBase.h);
				}
			} else if (x === 1) {
				if (y === 0) {
					instance.tile(`${tileSet}_1_0`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === 1) {
					instance.tile(`${tileSet}_1_1`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_1_3`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else {
					instance.tile(`${tileSet}_1_2`, x * tileSizeBase.w, y * tileSizeBase.h);
				}
			} else if (x === roomSizeTiles.w - 1) {
				if (y === 0) {
					instance.tile(`${tileSet}_4_0`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_4_3`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else {
					instance.tile(`${tileSet}_4_2`, x * tileSizeBase.w, y * tileSizeBase.h);
				}
			} else if (x % windowSpacing === 0) {
				if (y === 0) {
					instance.tile(`${tileSet}_2_0`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === 1) {
					instance.tile(`${tileSet}_2_1`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === 2) {
					instance.tile(`${tileSet}_2_2`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_2_3`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else {
					instance.tile(`${tileSet}_3_2`, x * tileSizeBase.w, y * tileSizeBase.h);
				}
			} else {
				if (y === 0) {
					instance.tile(`${tileSet}_3_0`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === 1) {
					instance.tile(`${tileSet}_3_1`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else if (y === roomSizeTiles.h - 1) {
					instance.tile(`${tileSet}_3_3`, x * tileSizeBase.w, y * tileSizeBase.h);
				} else {
					instance.tile(`${tileSet}_3_2`, x * tileSizeBase.w, y * tileSizeBase.h);
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

export const createWorld = (
	roomDimensions: Dimension,
	windowGapSlider = 4,
) => {
	const blockLocations = getBlockLocations(
		roomDimensions,
		{
			w: 4,
			h: 4,
		}
	);

	return {
		collision: getCollision(roomDimensions, blockLocations),
		tileSet: (
			<TileLoader alias="drum" src="assets/tiles/drum.json">
				<ObstacleLayout
					tileSet={"room"}
					roomSizeTiles={roomDimensions}
					windowSpacing={windowGapSlider}
				/>
			</TileLoader>
		),
		sprites: (
			<>
				{
					roomDimensions.w >= 8 && (
						<>
							<InteractableSprite
								image="assets/sprite/board.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.45 }}
								// onclick={() => events.onViewFeed()}
								x={tileSize.w * 5}
								y={tileSize.h * 1.25}
							/>
							<InteractableSprite
								active={false}
								image="assets/sprite/cal.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.5 }}
								// onclick={() => onViewFeed()}
								x={tileSize.w * 2}
								y={tileSize.h * 1}
							/>
						</>
					)
				}
				{
					roomDimensions.w >= 16 && (
						<>
							<InteractableSprite
								active={false}
								image="assets/sprite/mona.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.5 }}
								// onclick={() => onViewFeed()}
								x={tileSize.w * 8}
								y={tileSize.h * 1.25}
							/>
							<InteractableSprite
								active={false}
								image="assets/sprite/stary.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.5 }}
								// onclick={() => onViewFeed()}
								x={tileSize.w * 11}
								y={tileSize.h * 1.25}
							/>
							<InteractableSprite
								active={false}
								image="assets/sprite/tv.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.5 }}
								// onclick={() => onViewFeed()}
								x={tileSize.w * 14}
								y={tileSize.h * 1}
							/>
							</>
						)
					}
					{
						roomDimensions.w >= 21 && (
							<>
							<InteractableSprite
								active={false}
								image="assets/sprite/scream.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.5 }}
								// onclick={() => onViewFeed()}
								x={tileSize.w * 17}
								y={tileSize.h * 1.25}
							/>
							<InteractableSprite
								active={false}
								image="assets/sprite/couch.png"
								scale={4}
								anchor={{ x: 0.5, y: 0.5 }}
								// onclick={() => onViewFeed()}
								x={tileSize.w * 19}
								y={tileSize.h * 2}
							/>
						</>
					)
				}
				{blockLocations.map((blockLocation, i) => (
					<InteractableSprite
						active={false}
						key={i.toString()}
						zIndex={100}
						image="assets/sprite/tree.png"
						scale={4}
						anchor={{ x: 0.5, y: 0.5 }}
						// onclick={() => onViewFeed()}
						x={tileSize.w * (blockLocation.x + 0.5)}
						y={tileSize.h * (blockLocation.y + 1)}
					/>
				))}
			</>
		),
	}
}
