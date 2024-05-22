import { AnimatedSprite } from "@pixi/react-animated";
import { Matrix, SCALE_MODES, Spritesheet, Texture, Transform } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { type animationNames, generateSpriteData } from "../lib/render";
import { generateLlamaSpriteData } from "../lib/renderLlama";

interface Props extends React.ComponentProps<typeof AnimatedSprite> {
  seed: string;
  animationName: (typeof animationNames)[number];
  flipX?: boolean;
}

export const Avatar = ({
  seed,
  animationName,
  flipX,
  ...animatedSpriteProps
}: Props) => {
  const transform = useMemo(() => {
    if (flipX) {
      const scale =
        typeof animatedSpriteProps?.scale === "number"
          ? animatedSpriteProps.scale
          : 1;

      const transform = new Transform();
      transform.setFromMatrix(
        new Matrix((flipX ? -1 : 1) * scale, 0, 0, scale, 0, 0),
      );
      return transform;
    }
  }, [animatedSpriteProps?.scale, flipX]);

  const lastUpdated = useRef(0);

  const [spritesheet, setSpritesheet] = useState<Spritesheet | undefined>();
  useEffect(() => {
    console.log("Updating spritesheet");
    (async () => {
      // Define sprite layout
      const spriteData = generateLlamaSpriteData(
        `/api/sprite/generate/llama?seed=${seed}`,
      );

      // Create the SpriteSheet from data and image
      const spritesheet = new Spritesheet(
        Texture.from(spriteData.meta.image, {
          scaleMode: SCALE_MODES.NEAREST,
        }),
        spriteData,
      );

      // Generate all the Textures asynchronously
      await spritesheet.parse();

      setSpritesheet(spritesheet);
      lastUpdated.current = Date.now();
    })();
  }, [seed]);

  const textures = useMemo(() => {
    if (!spritesheet) return;
    return spritesheet.animations[animationName];
  }, [spritesheet, animationName]);

  if (!textures) return null;

  return (
    <AnimatedSprite
      key={`${lastUpdated.current}-${animationName}-${flipX}`}
      textures={textures}
      autoUpdate={true}
      animationSpeed={0.2}
      anchor={{ x: 0.5, y: 0.7 }}
      {...(transform === undefined ? {} : { transform })}
      {...animatedSpriteProps}
    />
  );
};
