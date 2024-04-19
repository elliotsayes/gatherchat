import { Avatar } from "./Avatar";
import { Stage } from "@pixi/react";

interface AvatarStandaloneProps extends React.ComponentProps<typeof Avatar> {
	scale: number;
	background?: number;
}

const spriteWidth = 16;
const spriteHeight = 24;

export const AvatarStandalone = ({
	scale,
	background,
	...rest
}: AvatarStandaloneProps) => {
	const renderWidth = spriteWidth * scale;
	const renderHeight = spriteHeight * scale;

	return (
		<>
			<Stage
				options={{
					background: background ?? 0xffffff,
					width: renderWidth,
					height: renderHeight,
				}}
			>
				<Avatar scale={scale} {...rest} anchor={{x: 0, y: 0}} />
			</Stage>
		</>
	);
};
