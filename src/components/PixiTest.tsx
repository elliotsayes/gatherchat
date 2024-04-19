import { Stage, Container } from "@pixi/react";
import { Avatar } from "./Avatar";
import { useState } from "react";
import { Tilemap3 } from "./TileMap3";
import NamedAvatar from "./NamedAvatar";

type Props = {
	seed: string;
};

export const PixiTest = ({ seed }: Props) => {
	const [xOffset, setXOffset] = useState(50);

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
			<Stage
				options={{ background: 0xffffff, width: 800, height: 600 }}
				style={{ outline: "none" }}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key != "Tab") {
						e.preventDefault();
						// e.stopPropagation();
						console.log("Key pressed: " + e.key);
					}
				}}
			>
				<Container x={xOffset} y={10}>
					<Tilemap3 />
					<Container x={100} y={80}>
						<NamedAvatar
							name="Joooooooohn Cena"
							seed={"a100d050c080204"}
							animationName="idle"
							isPlaying={true}
						/>
					</Container>
				</Container>

				<Container x={xOffset} y={300}></Container>

				<Container x={400} y={270}>
					<Avatar seed={seed} animationName="run" scale={6} isPlaying={true} />
				</Container>

				<Container x={600} y={300}>
					<Avatar
						seed={"a0820050c020602"}
						animationName="jump"
						flipX={true}
						isPlaying={true}
					/>
				</Container>
			</Stage>
		</>
	);
};
