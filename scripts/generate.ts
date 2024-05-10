import * as fs from "node:fs";

export type TileBox = {
  name: string;
  rect: { x: number; y: number; w: number; h: number };
};

type Frame = {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  pivot: { x: number; y: number };
};

function tileBoxToSegmentedFrames(tileSize: { w: number, h: number }, tileBox: TileBox): Record<string, Frame> {
  const frameIndicies = {
    x: Array(tileBox.rect.w)
      .fill(0)
      .map((_, i) => i),
    y: Array(tileBox.rect.h)
      .fill(0)
      .map((_, i) => i),
  };

  const frames = frameIndicies.y.flatMap((y) => {
    return frameIndicies.x.map((x) => {
      const name = `${tileBox.name}_${x}_${y}`;
      const globalOffset = {
        x: x + tileBox.rect.x,
        y: y + tileBox.rect.y,
      };
      return {
        [name]: {
          frame: {
            x: globalOffset.x * tileSize.w,
            y: globalOffset.y * tileSize.h,
            w: tileSize.w,
            h: tileSize.h,
          },
          rotated: false,
          trimmed: false,
          spriteSourceSize: {
            x: 0,
            y: 0,
            w: tileSize.w,
            h: tileSize.h,
          },
          sourceSize: {
            w: tileSize.w,
            h: tileSize.h,
          },
          pivot: {
            x: 0.5,
            y: 0.5,
          },
        },
      };
    });
  });

  return Object.assign({}, ...frames);
}

function frameGroupToBlockFrame(tileSize: { w: number, h: number }, tileBox: TileBox): Record<string, Frame> {
  const name = tileBox.name;
  const globalOffset = {
    x: tileBox.rect.x,
    y: tileBox.rect.y,
  };
  return {
    [name]: {
      frame: {
        x: globalOffset.x * tileSize.w,
        y: globalOffset.y * tileSize.h,
        w: tileSize.w * tileBox.rect.w,
        h: tileSize.h * tileBox.rect.h,
      },
      rotated: false,
      trimmed: false,
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: tileSize.w * tileBox.rect.w,
        h: tileSize.h * tileBox.rect.h,
      },
      sourceSize: {
        w: tileSize.w * tileBox.rect.w,
        h: tileSize.h * tileBox.rect.h,
      },
      pivot: {
        x: 0.5,
        y: 0.5,
      },
    },
  };
}

export const generate = (
  fname: string,
  meta,
  tileSize: { w: number, h: number },
  segmentTileBoxes: TileBox[],
  blockTileBoxes: TileBox[] = [],
) => fs.writeFileSync(
  fname,
  JSON.stringify(
    {
      meta,
      frames: Object.assign({}, 
        ...segmentTileBoxes.map((f) => tileBoxToSegmentedFrames(tileSize, f)), 
        ...blockTileBoxes.map((f) => frameGroupToBlockFrame(tileSize, f)),
      ),
    },
    null,
    2,
  ),
);
