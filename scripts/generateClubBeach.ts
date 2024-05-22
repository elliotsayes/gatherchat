import { generate, type TileBox } from "./generate";

const meta = {
  app: "gatherchat",
  version: "1.0",
  image: "clubbeach.png",
  format: "RGBA8888",
  size: { w: 1334, h: 1248 },
  scale: "1",
  // "smartupdate": "$TexturePacker:SmartUpdate:cd0d17d3f8965456a92be15158a0ed9e:d14942d54a3d3385fdb15258e1ae1a8f:cbce6b53f0f49e0bf15173c25c41f876$"
};

const tileSize = {
  w: 32,
  h: 32,
};

const sectionSize = {
  x: 21,
  y: 19,
}

const sectionNames = ["clubhouse1", "beach1"];

const floorSize = {
  x: 5,
  y: 4,
};

const floorName = (xyStr: string) => ({
  '0_0': 'default',
  '0_1': 'wall',
  '1_0': 'deepwater',
  '1_1': 'walkable',
})[xyStr];

const floors: TileBox[] = sectionNames.flatMap((sectionName, s) => 
  Array.from(Array(2).keys()).flatMap((x) => 
    Array.from(Array(2).keys()).flatMap((y) => {
      const name = `${sectionName}_floor_${floorName(`${x}_${y}`)}`;
      const rect = {
        x: s * sectionSize.x + x * floorSize.x,
        y: y * floorSize.y,
        w: floorSize.x,
        h: floorSize.y,
      };
      return { name, rect };
    })
  )
);

const couchesOffset = {
  x: 1,
  y: 8,
};
export const couchSize = {
  x: 2,
  y: 2,
};

const couches: TileBox[] = sectionNames.flatMap((sectionName, s) => 
  Array.from(Array(3).keys()).flatMap((y) => {
    const name = `${sectionName}_couch_${y}`;
    const rect = {
      x: s * sectionSize.x + couchesOffset.x,
      y: couchesOffset.y + couchSize.y * y,
      w: couchSize.x,
      h: couchSize.y,
    };
    return { name, rect };
  })
);

const rugsOffset = {
  x: 0,
  y: 15,
};
export const rugSize = {
  x: 3,
  y: 3,
};
const rugs: TileBox[] = sectionNames.flatMap((sectionName, s) => 
  Array.from(Array(3).keys()).flatMap((x) => {
    const name = `${sectionName}_rug_${x}`;
    const rect = {
      x: s * sectionSize.x + rugsOffset.x + rugSize.x * x,
      y: rugsOffset.y,
      w: rugSize.x,
      h: rugSize.y,
    };
    return { name, rect };
  })
);

const robotOffset = {
  x: 9,
  y: 15,
};
const robotSize = {
  x: 3,
  y: 4,
};
const robot: TileBox[] = sectionNames.flatMap((sectionName, s) => {
    const name = `${sectionName}_robot`;
    const rect = {
      x: s * sectionSize.x + robotOffset.x,
      y: robotOffset.y,
      w: robotSize.x,
      h: robotSize.y,
    };
    return { name, rect };
  }
);

const specialObjOffset = {
  x: 12,
  y: 15,
};
const specialObjSize = {
  x: 2,
  y: 2,
};
const specialObj: TileBox[] = sectionNames.flatMap((sectionName, s) => {
    const name = `${sectionName}_specialObj`;
    const rect = {
      x: s * sectionSize.x + specialObjOffset.x,
      y: specialObjOffset.y,
      w: specialObjSize.x,
      h: specialObjSize.y,
    };
    return { name, rect };
  }
);


const segmentTileBoxes: TileBox[] = [
  ...floors,
  // TODO: Walls, etc
];

const blockFrameSets: TileBox[] = [
  ...couches,
  ...rugs,
  ...robot,
  ...specialObj,
  // TODO: Plants, etc
];

export const generateClubBeach = () => generate("./public/assets/tiles/clubbeach.json", meta, tileSize, segmentTileBoxes, blockFrameSets);
