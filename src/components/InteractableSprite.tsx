import React, { useState } from "react";
import { Sprite } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";

interface InteractableSpriteProps
	extends Omit<React.ComponentProps<typeof Sprite>, "scale"> {
	scale: number;
}

const InteractableToon: React.FC<InteractableSpriteProps> = (
	props: InteractableSpriteProps,
) => {
	const { scale, ...namedAvatarProps } = props;

	const [emphasis, setEmphasis] = useState(false);

	return (
		<Spring to={{ scale: emphasis ? scale * 1.2 : scale }}>
			{(springProps) => (
				<Sprite
					onmouseenter={() => setEmphasis(true)}
					onmouseleave={() => setEmphasis(false)}
					eventMode={"dynamic"}
					{...namedAvatarProps}
					{...springProps}
				/>
			)}
		</Spring>
	);
};

export default InteractableToon;
