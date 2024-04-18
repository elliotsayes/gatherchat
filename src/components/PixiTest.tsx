import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import { useMemo } from "react";
import { Avatar } from "./Avatar";

export const PixiTest = () => {
	const blurFilter = useMemo(() => new BlurFilter(4), []);

	return (
		<Stage options={{ background: 0xffffff, width: 800, height: 600 }}>
			<Sprite
				image="/api/sprite/generate?seed=a011b080d050300"
				x={400}
				y={270}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={4}
			/>

			<Container x={400} y={550}>
				<Avatar seed={"a12290909050404"} />
			</Container>
		</Stage>
	);
};
