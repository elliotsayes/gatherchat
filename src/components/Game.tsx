import { AlphaFilter } from "pixi.js";
import { Stage } from "@pixi/react";
import { Container } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { Tilemap3 } from "./TileMap3";
import { AoState } from "../lib/schema/gameModel";
import { gameMachine } from "../lib/machines/game";
import { useMachine } from "@xstate/react";
import InteractableToon from "./InteractableToon";
import NamedAvatar from "./NamedAvatar";
import { useMemo } from "react";

const tileSizeX = 64;
const tileSizeY = 64;

const stageWidth = tileSizeX * 12;
const stageHeight = tileSizeY * 10;

type Props = {
	aoStateProp: AoState;
	onSelectToon: (toonId: string) => void;
	onViewFeed: () => void;
};

export const Game = ({ aoStateProp: aoState }: Props) => {
	const [current, send] = useMachine(gameMachine, {
		id: "game",
	});

  const veryTransparent = useMemo(() => new AlphaFilter(0.3), []);
  const slightlyTransparent = useMemo(() => new AlphaFilter(0.6), []);

	return (
		<>
			<Stage
				options={{
					background: 0xffffff,
					width: stageWidth,
					height: stageHeight,
				}}
				style={{ outline: "none" }}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key != "Tab") {
						e.preventDefault();
						send({ type: "KEY_PRESSED", key: e.key });
					}
				}}
			>
				{current.hasTag("SHOW_WORLD") && (
					<Spring
						to={{
							x: -((current.context.currentPosition.x + 1) * tileSizeX - stageWidth / 2) + tileSizeX / 2,
							y: -((current.context.currentPosition.y + 1) * tileSizeY - stageHeight / 2) + tileSizeY / 2,
						}}
					>
						{(props) => (
							<Container anchor={{ x: 0.5, y: 0.5 }} {...props}>
								<Tilemap3 />
								{current.hasTag("SHOW_OTHER_TOONS") &&
									aoState.otherToons.map((toon) => {
										// check if within two tiles
										const { x: selfX, y: selfY } =
											current.context.currentPosition;
										const { x: otherX, y: otherY } = toon.savedPosition;

										const withinThreeTiles =
											Math.abs(selfX - otherX) <= 3 &&
											Math.abs(selfY - otherY) <= 3;

										if (withinThreeTiles) {
											return (
												<InteractableToon
													key={toon.id}
													name={toon.displayName}
													seed={toon.avatarSeed}
													scale={3}
													x={toon.savedPosition.x * tileSizeX + tileSizeX / 2}
													y={toon.savedPosition.y * tileSizeY + tileSizeY / 2}
													isPlaying={true}
													animationName={"idle"}
													animationSpeed={
														current.context.selectedToonId === toon.id
															? 0.3
															: 0.1
													}
													onclick={() =>
														send({ type: "TOON_SELECTED", toonId: toon.id })
													}
												/>
											);
										} else {
                      const withinFiveTiles =
                        Math.abs(selfX - otherX) <= 5 &&
                        Math.abs(selfY - otherY) <= 5;
                      return (
												<NamedAvatar
													key={toon.id}
													name={toon.displayName}
													seed={toon.avatarSeed}
													scale={3}
													x={toon.savedPosition.x * tileSizeX + tileSizeX / 2}
													y={toon.savedPosition.y * tileSizeY + tileSizeY / 2}
													isPlaying={true}
													animationName={"idle"}
													animationSpeed={0.05}
                          filters={withinFiveTiles ? [slightlyTransparent] : [veryTransparent]}
												/>
											);
										}
									})}
							</Container>
						)}
					</Spring>
				)}

				{current.hasTag("SHOW_TOON") && (
					<Container x={stageWidth / 2} y={stageHeight / 2}>
						<NamedAvatar
							name={aoState.user.displayName}
							seed={aoState.user.avatarSeed}
							animationName={
								current.matches({
									roaming: {
										movement: "moving",
									},
								})
									? "run"
									: "idle"
							}
							flipX={current.context.currentDirection === "left"}
							scale={3}
							isPlaying={true}
						/>
					</Container>
				)}
			</Stage>
		</>
	);
};
