import { Texture, Spritesheet } from "pixi.js";
import { AnimatedSprite } from "@pixi/react";
import { generateSpriteData } from "../sprite/render";
import { useEffect, useState } from "react";

type Props = {
	seed: string;
};

export const Avatar = ({ seed }: Props) => {
	const [data, setData] = useState<Spritesheet | undefined>();

	useEffect(() => {
		(async () => {
			// Define sprite layout
			const spriteData = generateSpriteData(`/api/sprite/generate?seed=${seed}`);

			// Create the SpriteSheet from data and image
			const spritesheet = new Spritesheet(
				Texture.from(spriteData.meta.image),
				spriteData,
			);

			// Generate all the Textures asynchronously
			await spritesheet.parse();

			setData(spritesheet);
		})();
	}, [seed, setData]);

	if (!data) {
		return null;
	}

	const ani = data.animations.jump;

	return (
		<AnimatedSprite
			textures={ani}
			anchor={{ x: 0.5, y: 0.5 }}
			scale={5}
			isPlaying={true}
			animationSpeed={0.2}
			filters={null}
			isSprite={true}
			
		/>
	);
};
