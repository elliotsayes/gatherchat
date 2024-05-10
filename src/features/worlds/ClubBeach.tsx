import InteractableSprite from "@/features/render/components/InteractableSprite";
import type { RenderEngineWorld } from "@/features/render/components/RenderEngine";
import { TileLoader } from "@/features/render/components/TileLoader";
import type { Bounds, Dimension, Position } from "@/features/render/lib/schema";
import { GenericLayout, type GenericTileSet, tileSize } from "./components/GenericLayout";

const getCollisionFunction = (
  roomSizeTiles: Dimension,
) => {
  const movementBounds: Bounds = {
    tl: {
      x: 1,
      y: 1,
    },
    br: {
      x: roomSizeTiles.w - 2,
      y: roomSizeTiles.h - 2,
    },
  };

  return (position: Position) => {
    const { x, y } = position;

    const insideBounds =
      x >= movementBounds.tl.x &&
      x <= movementBounds.br.x &&
      y >= movementBounds.tl.y &&
      y <= movementBounds.br.y;

    return !insideBounds // || clipsObstacle;
  };
};

export const ObstacleTypes = ["tree", "scream"] as const;
export type ObstacleType = (typeof ObstacleTypes)[number];

export const createClubBeach = (
  tileSet: GenericTileSet,
  roomDimensions: Dimension,
  // windowSpacing = 4,
  // obstacleSpacing?: Dimension,
  // obstacleType: ObstacleType = "tree",
  onViewFeed: () => void,
): RenderEngineWorld => {
  return {
    collision: getCollisionFunction(roomDimensions, /*obstacleLocations*/),
    tileSet: (
      <TileLoader alias="clubbeach" src="assets/tiles/clubbeach.json">
        <GenericLayout
          tileSet={tileSet}
          roomSizeTiles={roomDimensions}
          // windowSpacing={windowSpacing}
        />
      </TileLoader>
    ),
    spritesBg: (
      <>
        <InteractableSprite
          image="assets/sprite/object/board.png"
          scale={4}
          anchor={{ x: 0.5, y: 0.45 }}
          onclick={() => onViewFeed()}
          x={tileSize.w * 5.5}
          y={tileSize.h * 1.25}
        />
      </>
    ),
    spritesFg: (
      <>
      </>
    ),
  };
};
