import { Avatar } from "./Avatar";
import { Stage } from "@pixi/react";
import { Container } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { Tilemap3 } from "./TileMap3";
import { AoState } from "../lib/schema/gameModel";
import { gameMachine } from "../lib/machines/game";
import { useMachine } from "@xstate/react";
import InteractableToon from "./InteractableToon";

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
							x: -current.context.currentPosition.x * tileSizeX + tileSizeX / 2,
							y: -current.context.currentPosition.y * tileSizeY + tileSizeY / 2,
						}}
					>
						{(props) => (
							<Container anchor={{ x: 0.5, y: 0.5 }} {...props}>
								<Tilemap3 />
								{current.hasTag("SHOW_OTHER_TOONS") &&
									aoState.otherToons.map((toon) => (
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
												current.context.selectedToonId === toon.id ? 0.2 : 0.05
											}
											onclick={() =>
												send({ type: "TOON_SELECTED", toonId: toon.id })
											}
										/>
									))}
							</Container>
						)}
					</Spring>
				)}

				{current.hasTag("SHOW_TOON") && (
					<Container x={stageWidth / 2} y={stageHeight / 2}>
						<Avatar
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
