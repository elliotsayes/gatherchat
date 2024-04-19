import { Avatar } from "./Avatar";
import { Stage } from "@pixi/react";

interface AvatarStandaloneProps extends React.ComponentProps<typeof Avatar> {
	scale: number;
	background?: number;
}

const spriteWidth = 16;
const spriteHeight = 24;

export const AvatarStandalone = ({
	background,
	...rest
}: AvatarStandaloneProps) => {
  const { scale, seed } = rest;

	const renderWidth = spriteWidth * scale;
	const renderHeight = spriteHeight * scale;

	return (
		<>
			<Stage
        key={seed}
				options={{
					background: background ?? 0xffffff,
				}}
				width={renderWidth}
				height={renderHeight}
			>
				<Avatar anchor={{ x: 0, y: 0 }} {...rest} />
			</Stage>
		</>
	);
};
