import InteractableSprite from "@/features/render/components/InteractableSprite";
import type { RenderEngineWorld } from "@/features/render/components/RenderEngine";
import { TileLoader } from "@/features/render/components/TileLoader";
import type { Bounds, Dimension, Position } from "@/features/render/lib/schema";
import {
  RoomLayout,
  type RoomTileSet,
  tileSize,
} from "./components/RoomLayout";

const getObstacleLocations = (
  roomSizeTiles: Dimension,
  blockSpacing?: Dimension,
) => {
  const locations: Position[] = [];
  if (!blockSpacing) return locations;

  // Iterate over internal area area
  for (let x = 1; x < roomSizeTiles.w - 1; x++) {
    for (let y = 1; y < roomSizeTiles.h - 2; y++) {
      if (x % blockSpacing.w === 0 && (y + 1) % blockSpacing.h === 0) {
        locations.push({ x, y });
      }
    }
  }
  return locations;
};

const getCollisionFunction = (
  roomSizeTiles: Dimension,
  obstacleLocations: Position[],
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
  };

  return (position: Position) => {
    const { x, y } = position;

    const insideBounds =
      x >= movementBounds.tl.x &&
      x <= movementBounds.br.x &&
      y >= movementBounds.tl.y &&
      y <= movementBounds.br.y;

    const clipsObstacle = obstacleLocations.some(
      (bl) => bl.x === x && bl.y === y - 1,
    );

    return !insideBounds || clipsObstacle;
  };
};

export const ObstacleTypes = ["tree", "scream"] as const;
export type ObstacleType = (typeof ObstacleTypes)[number];

export const createDecoratedRoom = (
  tileSet: RoomTileSet,
  roomDimensions: Dimension,
  windowSpacing = 4,
  obstacleSpacing?: Dimension,
  obstacleType: ObstacleType = "tree",
): RenderEngineWorld => {
  const obstacleLocations = getObstacleLocations(
    roomDimensions,
    obstacleSpacing,
  );

  return {
    collision: getCollisionFunction(roomDimensions, obstacleLocations),
    tileSet: (
      <TileLoader alias="drum" src="assets/tiles/drum.json">
        <RoomLayout
          tileSet={tileSet}
          roomSizeTiles={roomDimensions}
          windowSpacing={windowSpacing}
        />
      </TileLoader>
    ),
    spritesBg: (
      <>
        {roomDimensions.w >= 7 && (
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
        )}
        {roomDimensions.w >= 16 && (
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
        )}
        {roomDimensions.w >= 21 && (
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
        )}
      </>
    ),
    spritesFg: (
      <>
        {obstacleLocations.map((blockLocation, i) => (
          <InteractableSprite
            active={false}
            key={i.toString()}
            image={`assets/sprite/${obstacleType}.png`}
            scale={4}
            anchor={{ x: 0.5, y: 0.5 }}
            // onclick={() => onViewFeed()}
            x={tileSize.w * (blockLocation.x + 0.5)}
            y={tileSize.h * (blockLocation.y + 1)}
          />
        ))}
      </>
    ),
  };
};
