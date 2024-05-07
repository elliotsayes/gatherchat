import { Stage } from "@pixi/react";
import { Container, Sprite } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { AlphaFilter } from "pixi.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import InteractableSprite from "./InteractableSprite";
import InteractableToon from "./InteractableToon";
import NamedAvatar from "./NamedAvatar";
import { Tilemap3, blockLocations } from "./TileMap3";
import type {
	ArweaveID,
	ContractPosition,
	ContractRoom,
	ContractUser,
} from "@/lib/ao-gather";

const tileSizeX = 64;
const tileSizeY = 64;

const fallbackStageSize = {
	width: 800,
	height: 600,
};

export type RenderEngineState = {
	room: ContractRoom;
	player: {
		id: ArweaveID;
		profile: ContractUser;
		savedPosition: ContractPosition;

		// Transient
		localPosition: ContractPosition;
		localDirection: "left" | "right";
		isRunning: boolean;
	};
	otherPlayers: Array<{
		id: ArweaveID;
		profile: ContractUser;
		savedPosition: ContractPosition;

		// Derived
		isFollowedByUser: boolean;
		isFollowingUser: boolean;
		isInRoom: boolean;

		// Transient
		isActivated: boolean;
		isTalking: boolean;
	}>;
};

export type RenderEngineEvents = {
	onViewFeed: () => void;
	onMovementKey: (key: string) => void;
	onPlayerClick: (playerId: ArweaveID) => void;
};

export type RenderEngineFlags = {
	showWorld: boolean;
	showPlayer: boolean;
	showOtherPlayers: boolean;
	showObjects: boolean;
};

type Props = {
	parentRef: React.RefObject<HTMLDivElement>;
	lastResized: number;

	state: RenderEngineState;
	events: RenderEngineEvents;
	flags: RenderEngineFlags;
};

export const RenderEngine = ({
	parentRef,
	lastResized,

	state,
	events,
	flags,
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
						events.onMovementKey(e.key);
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
							{flags.showWorld && (
								<Spring
									to={{
										x:
											stageSize.width / 2 -
											(state.player.localPosition.x + 1) * tileSizeX +
											tileSizeX / 2,
										y:
											stageSize.height / 2 -
											(state.player.localPosition.y + 1) * tileSizeY +
											tileSizeY / 2,
									}}
								>
									{(props) => (
										<Container
											anchor={{ x: 0.5, y: 0.5 }}
											// filters={
											// 	current.matches("saving") ? [slightlyTransparent] : []
											// }
											{...props}
										>
											<Tilemap3 />
											{state.player.savedPosition !== undefined && (
												<Sprite
													image={"assets/sprite/purple.png"}
													width={tileSizeX}
													height={tileSizeY}
													x={tileSizeX * state.player.savedPosition.x}
													y={tileSizeY * state.player.savedPosition.y}
													filters={[veryTransparent]}
												/>
											)}
											{flags.showObjects && (
												<InteractableSprite
													image="assets/sprite/board.png"
													scale={4}
													anchor={{ x: 0.5, y: 0.45 }}
													onclick={() => events.onViewFeed()}
													x={tileSizeX * 5}
													y={tileSizeY * 1.25}
												/>
											)}
											{flags.showOtherPlayers &&
												state.otherPlayers.map((otherPlayer) => {
													// check if within two tiles
													const selfPos = state.player.localPosition;
													const otherPos = otherPlayer.savedPosition;

													const distance =
														Math.abs(selfPos.x - otherPos.x) +
														Math.abs(selfPos.y - otherPos.y);

													const withinThreeTiles = distance <= 3;

													if (withinThreeTiles) {
														return (
															<InteractableToon
																key={otherPlayer.id}
																name={otherPlayer.profile.name}
																seed={otherPlayer.profile.name}
																scale={3}
																x={
																	otherPlayer.savedPosition.x * tileSizeX +
																	tileSizeX / 2
																}
																y={
																	otherPlayer.savedPosition.y * tileSizeY +
																	tileSizeY / 2
																}
																isPlaying={true}
																animationName={"idle"}
																animationSpeed={
																	otherPlayer.isActivated ? 0.3 : 0.1
																}
																onclick={() => {
																	events.onPlayerClick(otherPlayer.id);
																}}
															/>
														);
														// biome-ignore lint/style/noUselessElse: Readability
													} else {
														const veryFar = distance < 6;
														return (
															<NamedAvatar
																key={otherPlayer.id}
																name={otherPlayer.profile.name}
																seed={otherPlayer.profile.avatar}
																scale={3}
																x={
																	otherPlayer.savedPosition.x * tileSizeX +
																	tileSizeX / 2
																}
																y={
																	otherPlayer.savedPosition.y * tileSizeY +
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
												active={false}
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
												active={false}
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
							{flags.showPlayer && (
								<Container x={stageSize.width / 2} y={stageSize.height / 2}>
									<NamedAvatar
										name={state.player.profile.name}
										seed={state.player.profile.avatar}
										animationName={state.player.isRunning ? "run" : "idle"}
										flipX={state.player.localDirection === "left"}
										scale={3}
										isPlaying={true}
									/>
								</Container>
							)}
						</Container>
					)}
				</Spring>
			</Stage>
		</>
	);
};
