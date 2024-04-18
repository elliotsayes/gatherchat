import { Texture, Spritesheet, SCALE_MODES, Transform, Matrix } from "pixi.js";
import { AnimatedSprite } from "@pixi/react";
import { animationNames, generateSpriteData } from "../sprite/render";
import { useEffect, useState } from "react";

type Props = {
	seed: string;
	animationName: (typeof animationNames)[number];
	scale?: number;
	flipX?: boolean;
};

export const Avatar = ({ seed, animationName, scale, flipX }: Props) => {
	scale = scale ?? 5;

	const [spritesheet, setSpritesheet] = useState<Spritesheet | undefined>();
	const [lastUpdated, setLastUpdated] = useState(0);

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
			setLastUpdated(Date.now());
		})();
	}, [seed, setSpritesheet]);

	if (!spritesheet) {
		return null;
	}

	const textures = spritesheet.animations[animationName];

	const transform = new Transform();
	transform.setFromMatrix(new Matrix((flipX ? -1 : 1) * scale, 0, 0, scale, 0, 0));

	return (
		<AnimatedSprite
			key={lastUpdated}
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
