import { Stage } from "@pixi/react";
import { Container, Sprite } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { useMachine } from "@xstate/react";
import { AlphaFilter } from "pixi.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { gameMachine } from "../../lib/machines/game";
import type { AoState, AoToonMaybeSaved } from "../../lib/schema/gameModel";
import InteractableSprite from "./InteractableSprite";
import InteractableToon from "./InteractableToon";
import NamedAvatar from "./NamedAvatar";
import { Tilemap3, blockLocations } from "./TileMap3";

const tileSizeX = 64;
const tileSizeY = 64;

const fallbackStageSize = {
	width: 800,
	height: 600,
};

type Props = {
	parentRef: React.RefObject<HTMLDivElement>;
	lastResized: number;
	aoStateProp: AoState;
	onSelectToon: (toon: AoToonMaybeSaved) => void;
	onViewFeed: () => void;
	onSavePosition: (position: { x: number; y: number }) => Promise<boolean>;
};

export const Game = ({
	parentRef,
	lastResized,
	aoStateProp: aoState,
	onSelectToon,
	onViewFeed,
	onSavePosition,
}: Props) => {
	const [stageSize, setStageSize] = useState(fallbackStageSize);

	const resizeStage = useCallback(() => {
		if (parentRef.current) {
			const { clientWidth, clientHeight } = parentRef.current;
			console.log("resizeStage", clientWidth, clientHeight);
			setStageSize({
				width: clientWidth,
				height: clientHeight,
			});
		}
	}, [parentRef.current]);

	useEffect(() => {
		console.log({ lastResized });
		resizeStage();
		window.addEventListener("resize", resizeStage);
		return () => {
			window.removeEventListener("resize", resizeStage);
		};
	}, [resizeStage, lastResized]);

	const [current, send] = useMachine(gameMachine, {
		input: {
			position: aoState.user.savedPosition,
		},
	});

	const [targetOffset, setTargetOffset] = useState({
		x: 0,
		y: 0,
	});

	const veryTransparent = useMemo(() => new AlphaFilter(0.3), []);
	const slightlyTransparent = useMemo(() => new AlphaFilter(0.6), []);

	return (
		<>
			<Stage
				options={{
					background: 0x111111,
				}}
				width={stageSize.width}
				height={stageSize.height}
				style={{ outline: "none" }}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key !== "Tab") {
						e.preventDefault();
						send({ type: "KEY_PRESSED", key: e.key });
					}
				}}
				onMouseMove={(e) => {
					const position = e.currentTarget.getBoundingClientRect();
					const mousePosition = {
						x: e.clientX - position.left,
						y: e.clientY - position.top,
					};
					const fromCenter = {
						x: mousePosition.x - stageSize.width / 2,
						y: mousePosition.y - stageSize.height / 2,
					};
					function calculateOffset(mouseDistance: number) {
						if (mouseDistance === 0) return 0;
						return (
							(mouseDistance > 0 ? -1 : -0) *
							Math.floor(Math.log(Math.abs(mouseDistance / 2))) *
							10
						);
					}
					const targetOffset = {
						x: calculateOffset(fromCenter.x),
						y: calculateOffset(fromCenter.y),
					};
					setTargetOffset(targetOffset);
				}}
			>
				<Spring to={{ ...targetOffset }}>
					{(props) => (
						<Container {...props}>
							{current.hasTag("SHOW_WORLD") && (
								<Spring
									to={{
										x:
											stageSize.width / 2 -
											(current.context.currentPosition.x + 1) * tileSizeX +
											tileSizeX / 2,
										y:
											stageSize.height / 2 -
											(current.context.currentPosition.y + 1) * tileSizeY +
											tileSizeY / 2,
									}}
								>
									{(props) => (
										<Container
											anchor={{ x: 0.5, y: 0.5 }}
											filters={
												current.matches("saving") ? [slightlyTransparent] : []
											}
											{...props}
										>
											<Tilemap3 />
											{current.hasTag("SHOW_OBJECTS") && (
												<InteractableSprite
													image="assets/sprite/board.png"
													scale={4}
													anchor={{ x: 0.5, y: 0.45 }}
													onclick={() => onViewFeed()}
													x={tileSizeX * 5}
													y={tileSizeY * 1.25}
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
																x={
																	toon.savedPosition.x * tileSizeX +
																	tileSizeX / 2
																}
																y={
																	toon.savedPosition.y * tileSizeY +
																	tileSizeY / 2
																}
																isPlaying={true}
																animationName={"idle"}
																animationSpeed={
																	current.context.selectedToonId === toon.id
																		? 0.3
																		: 0.1
																}
																onclick={() => {
																	send({
																		type: "TOON_SELECTED",
																		toonId: toon.id,
																	});
																	onSelectToon(toon);
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
																x={
																	toon.savedPosition.x * tileSizeX +
																	tileSizeX / 2
																}
																y={
																	toon.savedPosition.y * tileSizeY +
																	tileSizeY / 2
																}
																isPlaying={true}
																animationName={"idle"}
																animationSpeed={0.05}
																filters={
																	veryFar
																		? [slightlyTransparent]
																		: [veryTransparent]
																}
															/>
														);
													}
												})}
											<InteractableSprite
												// active={false}
												image="assets/sprite/cal.png"
												scale={4}
												anchor={{ x: 0.5, y: 0.5 }}
												// onclick={() => onViewFeed()}
												x={tileSizeX * 2}
												y={tileSizeY * 1}
											/>
											<InteractableSprite
												active={false}
												image="assets/sprite/couch.png"
												scale={4}
												anchor={{ x: 0.5, y: 0.5 }}
												// onclick={() => onViewFeed()}
												x={tileSizeX * 19}
												y={tileSizeY * 2}
											/>
											<InteractableSprite
												active={false}
												image="assets/sprite/mona.png"
												scale={4}
												anchor={{ x: 0.5, y: 0.5 }}
												// onclick={() => onViewFeed()}
												x={tileSizeX * 8}
												y={tileSizeY * 1.25}
											/>
											<InteractableSprite
												active={false}
												image="assets/sprite/stary.png"
												scale={4}
												anchor={{ x: 0.5, y: 0.5 }}
												// onclick={() => onViewFeed()}
												x={tileSizeX * 11}
												y={tileSizeY * 1.25}
											/>
											<InteractableSprite
												// active={false}
												image="assets/sprite/tv.png"
												scale={4}
												anchor={{ x: 0.5, y: 0.5 }}
												// onclick={() => onViewFeed()}
												x={tileSizeX * 14}
												y={tileSizeY * 1}
											/>
											<InteractableSprite
												active={false}
												image="assets/sprite/scream.png"
												scale={4}
												anchor={{ x: 0.5, y: 0.5 }}
												// onclick={() => onViewFeed()}
												x={tileSizeX * 17}
												y={tileSizeY * 1.25}
											/>
											{blockLocations.map((blockLocation, i) => (
												<InteractableSprite
													active={false}
													key={i.toString()}
													zIndex={100}
													image="assets/sprite/tree.png"
													scale={4}
													anchor={{ x: 0.5, y: 0.5 }}
													// onclick={() => onViewFeed()}
													x={tileSizeX * (blockLocation.x + 0.5)}
													y={tileSizeY * (blockLocation.y + 1)}
												/>
											))}
										</Container>
									)}
								</Spring>
							)}

							{current.hasTag("SHOW_TOON") && (
								<Container x={stageSize.width / 2} y={stageSize.height / 2}>
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
						</Container>
					)}
				</Spring>
			</Stage>
		</>
	);
};
