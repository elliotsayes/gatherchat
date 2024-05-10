import { generate, type FrameSet } from "./generate";

const meta = {
  app: "gatherchat",
  version: "1.0",
  image: "room3.png",
  format: "RGBA8888",
  size: { w: 176, h: 160 },
  scale: "1",
  // "smartupdate": "$TexturePacker:SmartUpdate:cd0d17d3f8965456a92be15158a0ed9e:d14942d54a3d3385fdb15258e1ae1a8f:cbce6b53f0f49e0bf15173c25c41f876$"
};

const tileSize = {
  w: 16,
  h: 16,
};

const allFrameSets: FrameSet[] = [
  {
    name: "room_default",
    tiles: { x: 0, y: 0, w: 5, h: 4 },
  },
  {
    name: "room_dark",
    tiles: { x: 5, y: 0, w: 5, h: 4 },
  },
  {
    name: "room_red",
    tiles: { x: 10, y: 0, w: 5, h: 4 },
  },
];

export const generateRoom3 = () => generate("./public/assets/tiles/room3.json", meta, tileSize, allFrameSets);
