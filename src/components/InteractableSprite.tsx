import React, { useEffect, useState } from "react";
import { Sprite } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { SCALE_MODES, Texture } from "pixi.js";

interface InteractableSpriteProps
	extends Omit<React.ComponentProps<typeof Sprite>, "scale"> {
	scale: number;
	active?: boolean;
}

const InteractableSprite: React.FC<InteractableSpriteProps> = (
	props: InteractableSpriteProps,
) => {
	const { scale, active = true, image, ...namedAvatarProps } = props;

	const [emphasis, setEmphasis] = useState(false);

	const [texture, setTexture] = useState<Texture | null>(null);
	useEffect(() => {
		if (image) {
			setTexture(Texture.from(image as string, { scaleMode: SCALE_MODES.NEAREST }));
		}
	}, [image]);

	if (!texture) {
		return null 
	}

	return (
		<Spring to={{ scale: emphasis ? scale * 1.2 : scale }}>
			{(springProps) => (
				<Sprite
					texture={texture}
					onmouseenter={() => active && setEmphasis(true)}
					onmouseleave={() => setEmphasis(false)}
					eventMode={"dynamic"}
					{...namedAvatarProps}
					{...springProps}
				/>
			)}
		</Spring>
	);
};

export default InteractableSprite;
