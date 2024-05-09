import * as fs from "node:fs";

export type FrameSet = {
  name: string;
  tiles: { x: number; y: number; w: number; h: number };
};

type Frame = {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  pivot: { x: number; y: number };
};

function frameSetToFrames(tileSize: { w: number, h: number }, frameSet: FrameSet): Record<string, Frame> {
  const frameIndicies = {
    x: Array(frameSet.tiles.w)
      .fill(0)
      .map((_, i) => i),
    y: Array(frameSet.tiles.h)
      .fill(0)
      .map((_, i) => i),
  };

  const frames = frameIndicies.y.flatMap((y) => {
    return frameIndicies.x.map((x) => {
      const name = `${frameSet.name}_${x}_${y}`;
      const globalOffset = {
        x: x + frameSet.tiles.x,
        y: y + frameSet.tiles.y,
      };
      return {
        [name]: {
          frame: {
            x: globalOffset.x * tileSize.w,
            y: globalOffset.y * tileSize.h,
            w: tileSize.w,
            h: tileSize.h,
          },
          rotate: false,
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

export const generate = (
  fname: string,
  meta,
  tileSize: { w: number, h: number },
  frameSets: FrameSet[],
) => fs.writeFileSync(
  fname,
  JSON.stringify(
    {
      meta,
      frames: Object.assign({}, ...frameSets.map((f) => frameSetToFrames(tileSize, f))),
    },
    null,
    2,
  ),
);
