import { Texture, Spritesheet, SCALE_MODES, Transform, Matrix } from "pixi.js";
import { Sprite, AnimatedSprite } from "@pixi/react";
import { animationNames, generateSpriteData } from "../sprite/render";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
	seed: string;
	animationName: (typeof animationNames)[number];
	scale?: number;
	flipX?: boolean;
};

export const Avatar = ({ seed, animationName, scale, flipX }: Props) => {
	scale = scale ?? 4;

	const transform = useMemo(() => {
		const transform = new Transform();
		transform.setFromMatrix(new Matrix((flipX ? -1 : 1) * scale, 0, 0, scale, 0, 0));
		return transform;
	}, [scale, flipX]);

	const [spritesheet, setSpritesheet] = useState<Spritesheet | undefined>();
	const lastUpdated = useRef(0);

	useEffect(() => {
		console.log("Updating spritesheet");
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
			lastUpdated.current = Date.now();
		})();
	}, [seed, setSpritesheet, lastUpdated]);

	if (!spritesheet) {
		return null;
	}

	const textures = spritesheet.animations[animationName];

	if (animationName === "no_anim") {
		return (
			<Sprite
				key={lastUpdated.current}
				texture={textures[0]}
				anchor={{ x: 0.5, y: 0.5 }}
				transform={transform}
			/>
		)
	}

	return (
		<AnimatedSprite
			key={lastUpdated.current}
			textures={textures}
			anchor={{ x: 0.5, y: 0.5 }}
			isPlaying={true}
			animationSpeed={0.2}
			// isSprite={false}
			autoUpdate={true}
			transform={transform}
		/>
	);
};
