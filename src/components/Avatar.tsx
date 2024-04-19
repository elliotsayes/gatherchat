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

	const textures = useMemo(() => {
		if (!spritesheet) return;
		return spritesheet.animations[animationName];
	}, [spritesheet, animationName]);

	if (!textures) return null;

	return (
		<AnimatedSprite
			key={`${seed}-${animationName}-${lastUpdated.current}`}
			textures={textures}
			autoUpdate={true}
			animationSpeed={0.2}
			anchor={{ x: 0.5, y: 0.7 }}
			{...(transform === undefined ? {} : { transform })}
			{...animatedSpriteProps}
		/>
	);
};
