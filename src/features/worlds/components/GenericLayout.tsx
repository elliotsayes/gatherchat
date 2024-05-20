import type { Dimension } from "@/features/render/lib/schema";
import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { CompositeTilemap } from "@pixi/tilemap";
import hash from 'fnv1a';

export const tileSizeBase: Dimension = {
  w: 32,
  h: 32,
};

export const tileScale = 2;

export const tileSize: Dimension = {
  w: tileSizeBase.w * tileScale,
  h: tileSizeBase.h * tileScale,
};

// TODO: Add more tileset variations!
export const GenericTileSets = ["clubhouse1", "beach1"] as const;
export type GenericTileSet = (typeof GenericTileSets)[number];

interface Props {
  tileSet: GenericTileSet;
  roomSizeTiles: Dimension;
}

const setupInstance = (instance: CompositeTilemap, props: Props) => {
  instance.clear();
  instance.scale.set(tileScale);

  const { tileSet, roomSizeTiles } = props;

  // Iterate over main + surrounding area
  for (let x = -20; x < roomSizeTiles.w + 20; x++) {
    for (let y = -20; y < roomSizeTiles.h + 20; y++) {
      // Draw background tiles
      if (tileSet.startsWith("beach")) {
        instance.tile(`${tileSet}_floor_walkable_1_1`, x * tileSizeBase.w, y * tileSizeBase.h);
      } else {
        instance.tile(`${tileSet}_floor_walkable_1_1`, x * tileSizeBase.w, y * tileSizeBase.h);
      }
    }
  }

  const floorOffset = (x: number, y: number) => {
    if (x === 0) {
      if (y === 0) {
        return { x: 4, y: 1 };
      }
      if (y === roomSizeTiles.h - 1) {
        return { x: 4, y: 0 };
      }
      return { x: 2, y: 1 };
    }
    if (x === roomSizeTiles.w - 1) {
      if (y === 0) {
        return { x: 3, y: 1 };
      }
      if (y === roomSizeTiles.h - 1) {
        return { x: 3, y: 0 };
      }
      return { x: 0, y: 1 };
    }
    if (y === 0) {
      return { x: 1, y: 2 };
    }
    if (y === roomSizeTiles.h - 1) {
      return { x: 1, y: 0 };
    }
  }

  // Iterate over main area
  for (let x = 0; x < roomSizeTiles.w; x++) {
    for (let y = 0; y < roomSizeTiles.h; y++) {
      // Draw regular tile
      const offset = floorOffset(x, y);
      if (offset === undefined) {
        if (tileSet.startsWith("beach")) {
          const weirdNumber = hash(`${x}_${y}`);
          const rareIsh = weirdNumber % 5 === 0;
          const rareMore = weirdNumber % 11 === 0;
          if (!rareIsh && !rareMore) {
            instance.tile(
              `${tileSet}_floor_default_0_0`,
              x * tileSizeBase.w,
              y * tileSizeBase.h,
            );
          } else {
            instance.tile(
              `${tileSet}_floor_default_${weirdNumber % 3}_${rareMore ? 2 : 1}`,
              x * tileSizeBase.w,
              y * tileSizeBase.h,
            );
          }
        } else {
          instance.tile(
            `${tileSet}_floor_walkable_4_3`,
            x * tileSizeBase.w,
            y * tileSizeBase.h,
          );
        }
      } else {
        instance.tile(
          `${tileSet}_floor_walkable_${offset.x}_${offset.y}`,
          x * tileSizeBase.w,
          y * tileSizeBase.h,
        );
      }
    }
  }

  // Draw couches
  const couchAbsoluteOffset = { x: 2, y: 0 };
  const couchRelativeOffset = { x: 5, y: 0 };
  for (let n = 0; n < 3; n++) {
    const totalOffset = {
      x: couchAbsoluteOffset.x + couchRelativeOffset.x * n,
      y: couchAbsoluteOffset.y + couchRelativeOffset.y * n,
    };
    if (totalOffset.x >= roomSizeTiles.w - 2) break;
      instance.tile(
        `${tileSet}_couch_${n}`,
        totalOffset.x * tileSizeBase.w,
        totalOffset.y * tileSizeBase.h,
      );
  }

  // Draw rugs
  const rugAbsoluteOffset = { x: 2, y: 5 };
  const rugRelativeOffset = { x: 6, y: 0 };
  for (let n = 0; n < 3; n++) {
    const totalOffset = {
      x: rugAbsoluteOffset.x + rugRelativeOffset.x * n,
      y: rugAbsoluteOffset.y + rugRelativeOffset.y * n,
    };
    if (totalOffset.x >= roomSizeTiles.w - 3 || totalOffset.y >= roomSizeTiles.h - 3) break;
    instance.tile(
      `${tileSet}_rug_${n}`,
      totalOffset.x * tileSizeBase.w,
      totalOffset.y * tileSizeBase.h,
    );
  }

  // Draw robot
  const robotOffset = { x: 10, y: 10 };
  if (robotOffset.x < roomSizeTiles.w - 3 && robotOffset.y < roomSizeTiles.h - 4) {
    instance.tile(
      `${tileSet}_robot`,
      robotOffset.x * tileSizeBase.w,
      robotOffset.y * tileSizeBase.h,
    );
  }

  // Draw robot
  const specialObj = { x: 9.5, y: 0 };
  if (specialObj.x < roomSizeTiles.w - 2 && specialObj.y < roomSizeTiles.h - 3) {
    instance.tile(
      `${tileSet}_specialObj`,
      specialObj.x * tileSizeBase.w,
      specialObj.y * tileSizeBase.h,
    );
  }
};

export const GenericLayout = PixiComponent<Props, CompositeTilemap>("GenericLayout", {
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
