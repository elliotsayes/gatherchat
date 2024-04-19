import { Assets } from "pixi.js";
import { applyDefaultProps, PixiComponent } from '@pixi/react';
import { CompositeTilemap } from "@pixi/tilemap";

type Props = {
  // path: string;
  // xOffset: number;
  // yOffset: number;
};

export const Tilemap3 = PixiComponent('TileMap3', {
  create: () => {
    return new CompositeTilemap();
  },
  didMount: async (instance, props: Props) => {
    Assets.add({ alias: 'atlas', src: 'src/assets/tiles/atlas.json' });
    await Assets.load(['atlas']);

    instance.clear();
    instance.scale.set(2);

    const size = 32;
    // if you are too lazy, just specify filename and pixi will find it in cache
    for (let i = 0; i < 7; i++)
    {
        for (let j = 0; j < 5; j++)
        {
          instance.tile('grass.png', i * size, j * size);

            if (i % 2 === 1 && j % 2 === 1)
            {
              instance.tile('tough.png', i * size, j * size);
            }
        }
    }
  },

  applyProps: (instance, oldProps: Props, newProps: Props) => {
    const { ...oldP } = oldProps;
    const { ...newP } = newProps;

    // apply rest props to PIXI.Text
    applyDefaultProps(instance, oldP, newP);

    // set new count
    // instance.text = count.toString();
  },
});


