import { Avatar } from "./Avatar";
import { useState } from "react";
// import { Tilemap3 } from "./TileMap3";
import NamedAvatar from "./NamedAvatar";
import { Stage } from "@pixi/react";
import { Container } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { Tilemap3 } from "./TileMap3";

type Props = {
	seed: string;
};

const step = 64;

const directions = ["up", "down", "left", "right"] as const;
type Direction = (typeof directions)[number];

export const PixiTest = ({ seed }: Props) => {
	const [isMoving, setIsMoving] = useState(false);
	const [direction, setDirection] = useState<Direction>("right");

	const [xOffset, setXOffset] = useState(50);
	const [yOffset, setYOffset] = useState(10);

	const [emphasis, setEmphasis] = useState(false);

	return (
		<>
			<Stage
				options={{ background: 0xffffff, width: 800, height: 600 }}
				style={{ outline: "none" }}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key != "Tab") {
						e.preventDefault();
						// e.stopPropagation();
						console.log("Key pressed: " + e.key);
						if (
							e.key === "ArrowLeft" ||
							e.key === "ArrowRight" ||
							e.key === "ArrowUp" ||
							e.key === "ArrowDown"
						) {
							setIsMoving(true);
							setTimeout(() => {
								setIsMoving(false);
							}, 500);
						}
						switch (e.key) {
							case "ArrowLeft":
								setDirection("left");
								setXOffset(xOffset + step);
								break;
							case "ArrowRight":
								setDirection("right");
								setXOffset(xOffset - step);
								break;
							case "ArrowUp":
								setYOffset(yOffset + step);
								break;
							case "ArrowDown":
								setYOffset(yOffset - step);
								break;
						}
					}
				}}
			>
				<Spring to={{ x: xOffset, y: yOffset }}>
					{(props) => (
						<Container {...props}>
							<Tilemap3 />
							<Container x={100} y={50}>
								<NamedAvatar
									name="Joooooooohn Cena"
									seed={"a100d050c080204"}
									animationName="idle"
									isPlaying={true}
									eventMode={"dynamic"}
									onclick={(e) => {
										alert("It's JOHN CENA!!!")
									}}
									onmouseenter={(e) => {
										setEmphasis(true);
									}}
									onmouseleave={(e) => {
										setEmphasis(false);
									}}
									scale={emphasis? 5 : 4}
								/>
							</Container>
						</Container>
					)}
				</Spring>

				<Container x={400} y={270}>
					<Avatar
						seed={seed}
						animationName={isMoving ? "run" : "idle"}
						flipX={direction === "left" || direction === "down"}
						scale={4}
						isPlaying={true}
					/>
				</Container>
			</Stage>
		</>
	);
};
