import { Stage, Container, Sprite } from "@pixi/react";
import { Avatar } from "./Avatar";

export const PixiTest = () => {
	return (
		<Stage options={{ background: 0xffffff, width: 800, height: 600 }}>
			<Sprite
				image="/api/sprite/generate?seed=a011b080d050300"
				x={400}
				y={270}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={2}
			/>
			<Container x={200} y={500}>
				<Avatar seed={"a071f0108000801"} />
			</Container>

			<Container x={400} y={500}>
				<Avatar seed={"a12290909050404"} />
			</Container>

			<Container x={600} y={500}>
				<Avatar seed={"a0101040c040903"} />
			</Container>
		</Stage>
	);
};
