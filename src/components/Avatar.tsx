import { Texture, Spritesheet, SCALE_MODES, Transform, Matrix } from "pixi.js";
import { AnimatedSprite } from "@pixi/react-animated";
import { animationNames, generateSpriteData } from "../sprite/render";
import { useEffect, useMemo, useRef, useState } from "react";

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
					: 4;

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
	}, [seed, setSpritesheet, lastUpdated]);

	const [textures, setTextures] = useState<Texture[]>();
	useEffect(() => {
		if (!spritesheet) return;
		setTextures(spritesheet.animations[animationName]);
		lastUpdated.current = Date.now();
	}, [setTextures, spritesheet, animationName]);

	if (!textures) return null;

	return (
		<AnimatedSprite
			key={lastUpdated.current}
			textures={textures}
			anchor={{ x: 0.5, y: 0.5 }}
			animationSpeed={0.2}
			// isSprite={false}
			autoUpdate={true}
			{...(transform === undefined ? {} : { transform })}
			{...animatedSpriteProps}
		/>
	);
};
