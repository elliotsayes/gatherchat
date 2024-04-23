import { Stage } from "@pixi/react";
import { Avatar } from "../game/Avatar";

interface AvatarStandaloneProps extends React.ComponentProps<typeof Avatar> {
	scale: number;
	background?: number;
}

const spriteWidth = 16;
const spriteHeight = 24;

const yClip = spriteHeight / 8;

export const AvatarStandalone = ({
	background,
	...rest
}: AvatarStandaloneProps) => {
	const { scale } = rest;

	const renderWidth = spriteWidth * scale;
	const renderHeight = (spriteHeight - yClip) * scale;

	return (
		<>
			<Stage
				options={{
					background: background ?? 0xffffff,
				}}
				width={renderWidth}
				height={renderHeight}
				className="border rounded-lg shadow-lg bg-white p-4"
			>
				<Avatar y={-yClip * scale} anchor={{ x: 0, y: 0 }} {...rest} />
			</Stage>
		</>
	);
};
