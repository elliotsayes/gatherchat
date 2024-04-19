import { Stage, Container } from "@pixi/react";
import { Avatar } from "./Avatar";
import { useState } from "react";
import { Tilemap3 } from "./TileMap3";

type Props = {
	seed: string;
};

export const PixiTest = ({ seed }: Props) => {
	const [xOffset, setXOffset] = useState(100);

	return (
		<>
			<div>
				<input
					type="range"
					min={0}
					max={200}
					value={xOffset}
					onChange={(e) => setXOffset(parseInt(e.target.value))}
				/>
				<p>X Offset: {xOffset}</p>
			</div>
			<Stage options={{ background: 0xffffff, width: 800, height: 600 }}>
				{/* <TileMap xOffset={xOffset} yOffset={100} /> */}

				{/* <Container x={100} y={270}>
					<TileMap2 />
				</Container> */}

				<Container x={xOffset} y={270}>
					<Tilemap3 />
					<Avatar seed={"a100d050c080204"} animationName="idle" />
				</Container>

				<Container x={xOffset} y={300}></Container>

				<Container x={400} y={270}>
					<Avatar seed={seed} animationName="run" scale={6} />
				</Container>

				<Container x={600} y={300}>
					<Avatar seed={"a0820050c020602"} animationName="jump" flipX={true} />
				</Container>
			</Stage>
		</>
	);
};
