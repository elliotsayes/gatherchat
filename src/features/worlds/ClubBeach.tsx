import InteractableSprite from "@/features/render/components/InteractableSprite";
import type { RenderEngineWorld } from "@/features/render/components/RenderEngine";
import { TileLoader } from "@/features/render/components/TileLoader";
import type { Bounds, Dimension, Position } from "@/features/render/lib/schema";
import { GenericLayout, type GenericTileSet, tileSize } from "./components/GenericLayout";

// const getObstacleLocations = (
//   roomSizeTiles: Dimension,
//   blockSpacing?: Dimension,
// ) => {
//   const locations: Position[] = [];
//   if (!blockSpacing) return locations;

//   // Iterate over internal area area
//   for (let x = 1; x < roomSizeTiles.w - 1; x++) {
//     for (let y = 1; y < roomSizeTiles.h - 2; y++) {
//       if (x % blockSpacing.w === 0 && (y + 1) % blockSpacing.h === 0) {
//         locations.push({ x, y });
//       }
//     }
//   }
//   return locations;
// };

const getCollisionFunction = (
  roomSizeTiles: Dimension,
  // obstacleLocations: Position[],
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

    // const clipsObstacle = obstacleLocations.some(
    //   (bl) => bl.x === x && bl.y === y - 1,
    // );

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
  // const obstacleLocations = getObstacleLocations(
  //   roomDimensions,
  //   obstacleSpacing,
  // );

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
          image="assets/sprite/board.png"
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
