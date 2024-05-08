export const animationNames = ["no_anim", "idle", "run", "jump"] as const;

const ANIMATIONS: Record<
  (typeof animationNames)[number],
  { len: number; y: number }
> = {
  no_anim: { len: 1, y: 0 },
  idle: { len: 4, y: 1 },
  run: { len: 4, y: 2 },
  jump: { len: 7, y: 3 },
};

type Pos = {
  x: number;
  y: number;
};

type Size = {
  w: number;
  h: number;
};

type Rect = Pos & Size;

type Meta = {
  image: string;
  format: string;
  size: Size;
  scale: number;
};

type Frame = {
  frame: Rect;
  sourceSize: Size;
  spriteSourceSize: Rect;
};

type FrameName = string;

type Frames = Record<FrameName, Frame>;

type Animations = Record<string, string[]>;

export type SpriteData = {
  meta: Meta;
  frames: Frames;
  animations: Animations;
};

const spriteSize: Size = { w: 16, h: 24 };

function generateFrameNames(prefix: string, count: number): FrameName[] {
  return Array.from(Array(count).keys()).map((i) => prefix + i.toString());
}

function generateFrames(frameNames: string[], yOffset: number): Frames {
  return Object.assign(
    {},
    ...frameNames.map((e, i) => ({
      [e]: {
        frame: {
          x: i * spriteSize.w,
          y: yOffset * spriteSize.h,
          w: spriteSize.w,
          h: spriteSize.h,
        },
        sourceSize: spriteSize,
        spriteSourceSize: {
          x: 0,
          y: 0,
          w: spriteSize.w,
          h: spriteSize.h,
        },
      },
    })),
  );
}

const animations = Object.assign(
  {},
  ...animationNames.map((e) => {
    const anim = ANIMATIONS[e];
    const frameNames = generateFrameNames(e, anim.len);
    return {
      [e]: frameNames,
    };
  }),
);

const frames = Object.assign(
  {},
  ...animationNames.map((e, i) => generateFrames(animations[e], i)),
);

export function generateSpriteData(spriteSheetUrl: string): SpriteData {
  return {
    meta: {
      image: spriteSheetUrl,
      format: "RGBA8888",
      size: spriteSize,
      scale: 1,
    },
    frames,
    animations,
  };
}
