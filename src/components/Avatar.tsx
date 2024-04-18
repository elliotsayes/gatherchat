import { Texture, Spritesheet } from "pixi.js";
import { AnimatedSprite } from "@pixi/react";
import { useQuery } from "@tanstack/react-query";
import { generateSpriteData } from "../sprite/render";

type Props = {
	seed: string;
};

export const Avatar = ({ seed }: Props) => {
	const { data } = useQuery({
		queryKey: ["sprite", seed],
		queryFn: async () => {
			// Define sprite layout
			const spriteData = generateSpriteData(`/api/sprite/generate?seed=${seed}`);

			// Create the SpriteSheet from data and image
			const spritesheet = new Spritesheet(
				Texture.from(spriteData.meta.image),
				spriteData,
			);

			// Generate all the Textures asynchronously
			await spritesheet.parse();

			return spritesheet;
		},
	});

	if (!data) {
		return (
			<AnimatedSprite
				images={[]}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={1}
				isPlaying={false}
			/>
		);
	}

	const ani = data.animations.enemy;

	return (
		<AnimatedSprite
			textures={ani}
			anchor={{ x: 0.5, y: 0.5 }}
			scale={1}
			isPlaying={false}
		/>
	);
};
