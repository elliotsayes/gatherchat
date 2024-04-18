import { Stage, Container } from "@pixi/react";
import { Avatar } from "./Avatar";
import { TileMap } from "./TileMap";

type Props = {
	seed: string;
}

export const PixiTest = ({ seed }: Props) => {
	return (
		<Stage options={{ background: 0xffffff, width: 800, height: 600 }}>
			<TileMap xOffset={0} yOffset={0} />

			<Container x={200} y={300}>
				<Avatar seed={"a100d050c080204"} animationName="idle" />
			</Container>

			<Container x={400} y={270}>
				<Avatar seed={seed} animationName="run" scale={8} />
			</Container>

			<Container x={600} y={300}>
				<Avatar seed={"a0820050c020602"} animationName="jump" flipX={true} />
			</Container>
		</Stage>
	);
};
