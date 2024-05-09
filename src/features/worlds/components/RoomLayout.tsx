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

// TODO: Add more tileset variations!
export const RoomTileSets = ["room_default", "room_dark", "room_red"] as const;
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

  // Iterate over main + surrounding area
  for (let x = -20; x < roomSizeTiles.w + 20; x++) {
    for (let y = -20; y < roomSizeTiles.h + 20; y++) {
      // Draw background tiles
      // TODO: Replace with a better tile?
      instance.tile(`${tileSet}_3_2`, x * tileSizeBase.w, y * tileSizeBase.h);
    }
  }

  const tilesetOffsetX = (x: number) =>
    ({
      0: 0,
      1: 1,
      2: 3,
      [roomSizeTiles.w - 1]: 4,
    })[x] ?? 3;

  const tilesetOffsetY = (y: number) =>
    ({
      0: 0,
      1: 1,
      [roomSizeTiles.h - 1]: 3,
    })[y] ?? 2;

  // Iterate over main area
  for (let x = 0; x < roomSizeTiles.w; x++) {
    for (let y = 0; y < roomSizeTiles.h; y++) {
      // Draw regular tile
      instance.tile(
        `${tileSet}_${tilesetOffsetX(x)}_${tilesetOffsetY(y)}`,
        x * tileSizeBase.w,
        y * tileSizeBase.h,
      );
    }
  }
  
  // Draw window tiles
  for (let x = 2; x < roomSizeTiles.w - 2; x += windowSpacing) {
    for (let y = 0; y < 3; y++) {
      instance.tile(
        `${tileSet}_2_${y}`,
        x * tileSizeBase.w + tileSizeBase.w,
        y * tileSizeBase.h,
      );
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
