import { Texture, Spritesheet, SCALE_MODES, Transform, Matrix } from "pixi.js";
import { AnimatedSprite } from "@pixi/react";
import { animationNames, generateSpriteData } from "../sprite/render";
import { useEffect, useState } from "react";

type Props = {
	seed: string;
	animationName: (typeof animationNames)[number];
	flipX?: boolean;
};

export const Avatar = ({ seed, animationName, flipX }: Props) => {
	const [spritesheet, setSpritesheet] = useState<Spritesheet | undefined>();

	useEffect(() => {
		(async () => {
			// Define sprite layout
			const spriteData = generateSpriteData(
				`/api/sprite/generate?seed=${seed}`,
			);

			// Create the SpriteSheet from data and image
			const spritesheet = new Spritesheet(
				Texture.from(spriteData.meta.image, { scaleMode: SCALE_MODES.NEAREST }),
				spriteData,
			);

			// Generate all the Textures asynchronously
			await spritesheet.parse();

			setSpritesheet(spritesheet);
		})();
	}, [seed, setSpritesheet]);

	if (!spritesheet) {
		return null;
	}

	const textures = spritesheet.animations[animationName];

	const scale = 5;
	const transform = new Transform();
	transform.setFromMatrix(new Matrix((flipX ? -1 : 1) * scale, 0, 0, scale, 0, 0));

	return (
		<AnimatedSprite
			textures={textures}
			anchor={{ x: 0.5, y: 0.5 }}
			isPlaying={true}
			animationSpeed={0.2}
			filters={null}
			isSprite={true}
			autoUpdate={true}
			transform={transform}
		/>
	);
};
