import { generate, type TileBox } from "./generate";

const meta = {
  app: "gatherchat",
  version: "1.0",
  image: "llamaFED.png",
  format: "RGBA8888",
  size: { w: 176, h: 160 },
  scale: "1",
  // "smartupdate": "$TexturePacker:SmartUpdate:cd0d17d3f8965456a92be15158a0ed9e:d14942d54a3d3385fdb15258e1ae1a8f:cbce6b53f0f49e0bf15173c25c41f876$"
};

const tileSize = {
  w: 16,
  h: 16,
};

const segmentedTileBoxes: TileBox[] = [
  {
    name: "room_default",
    rect: { x: 0, y: 0, w: 5, h: 4 },
  },
  {
    name: "room_dark",
    rect: { x: 5, y: 0, w: 5, h: 4 },
  },
  {
    name: "room_red",
    rect: { x: 10, y: 0, w: 5, h: 4 },
  },
];

export const generateLlamaFED = () => generate("./public/assets/tiles/llamaFED.json", meta, tileSize, segmentedTileBoxes);
