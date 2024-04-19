import { AlphaFilter } from "pixi.js";
import { Stage } from "@pixi/react";
import { Container } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { Tilemap3 } from "./TileMap3";
import type { AoState } from "../lib/schema/gameModel";
import { gameMachine } from "../lib/machines/game";
import { useMachine } from "@xstate/react";
import InteractableToon from "./InteractableToon";
import NamedAvatar from "./NamedAvatar";
import { useMemo } from "react";
import InteractableSprite from "./InteractableSprite";

const tileSizeX = 64;
const tileSizeY = 64;

const stageTilesX = 12;
const stageTilesY = 9;

const stageWidth = tileSizeX * stageTilesX;
const stageHeight = tileSizeY * stageTilesY;

type Props = {
	aoStateProp: AoState;
	onSelectToon: (toonId: string) => void;
	onViewFeed: () => void;
	onSavePosition: (position: { x: number; y: number }) => Promise<boolean>;
};

export const Game = ({
	aoStateProp: aoState,
	onSelectToon,
	onViewFeed,
	onSavePosition,
}: Props) => {
	const [current, send] = useMachine(gameMachine, {
		input: {
			position: aoState.user.savedPosition,
		},
	});

	const veryTransparent = useMemo(() => new AlphaFilter(0.3), []);
	const slightlyTransparent = useMemo(() => new AlphaFilter(0.6), []);

	return (
		<>
			<Stage
				options={{
					background: 0xaaaaaa,
				}}
				width={stageWidth}
				height={stageHeight}
				style={{ outline: "none" }}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key !== "Tab") {
						e.preventDefault();
						send({ type: "KEY_PRESSED", key: e.key });
					}
				}}
			>
				{current.hasTag("SHOW_WORLD") && (
					<Spring
						to={{
							x:
								stageWidth / 2 -
								(current.context.currentPosition.x + 1) * tileSizeX +
								tileSizeX / 2,
							y:
								stageHeight / 2 -
								(current.context.currentPosition.y + 1) * tileSizeY +
								tileSizeY / 2,
						}}
					>
						{(props) => (
							<Container
								anchor={{ x: 0.5, y: 0.5 }}
								filters={current.matches("saving") ? [slightlyTransparent] : []}
								{...props}
							>
								<Tilemap3 />
								{current.hasTag("SHOW_OBJECTS") && (
									<InteractableSprite
										image="assets/sprite/board.png"
										scale={2}
										anchor={{ x: 0.5, y: 0.5 }}
										onclick={() => onViewFeed()}
										x={tileSizeX * 4.5}
										y={tileSizeY * 0.5}
									/>
								)}
								{current.hasTag("SHOW_OTHER_TOONS") &&
									aoState.otherToons.map((toon) => {
										// check if within two tiles
										const { x: selfX, y: selfY } =
											current.context.currentPosition;
										const { x: otherX, y: otherY } = toon.savedPosition;

										const distance =
											Math.abs(selfX - otherX) + Math.abs(selfY - otherY);

										const withinThreeTiles = distance <= 3;

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
													onclick={() => {
														send({ type: "TOON_SELECTED", toonId: toon.id });
														onSelectToon(toon.id);
													}}
												/>
											);
										// biome-ignore lint/style/noUselessElse: Readability
										} else {
											const veryFar = distance < 6;
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
													filters={
														veryFar ? [slightlyTransparent] : [veryTransparent]
													}
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
						{current.matches({
							roaming: {
								save: "idle",
							},
						}) && (
							<InteractableSprite
								image="assets/sprite/save.png"
								scale={1.5}
								onclick={async () => {
									send({ type: "SAVE_START" });
									await onSavePosition(current.context.currentPosition);
									send({ type: "SAVE_END" });
								}}
								anchor={{ x: 0.5, y: 0.5 }}
								filters={[slightlyTransparent]}
								y={20}
							/>
						)}
					</Container>
				)}
			</Stage>
		</>
	);
};
