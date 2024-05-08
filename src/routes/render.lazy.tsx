import { RenderEngine } from "@/features/render/components/RenderEngine";
import {
	type ObstacleType,
	ObstacleTypes,
	createDecoratedRoom,
} from "@/features/worlds/DecoratedRoom";
import {
	type RoomTileSet,
	RoomTileSets,
} from "@/features/worlds/components/RoomLayout";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

export const Route = createLazyFileRoute("/render")({
	component: Render,
});

export const tileSize = {
	x: 64,
	y: 64,
};

function Render() {
	const containerRef = useRef<HTMLDivElement>(null);

	const [tileSet, setTileSet] = useState<RoomTileSet>("room");
	const [obstacleType, setObstacleType] = useState<ObstacleType>("tree");

	const [widthSlider, setWidthSlider] = useState(21);
	const [heightSlider, setHeightSlider] = useState(12);
	const [windowGapSlider, setWindowGapSlider] = useState(3);
	const [blockSpacingWidthSlider, setBlockSpacingWidthSlider] = useState(4);
	const [blockSpacingHeightSlider, setBlockSpacingHeightSlider] = useState(4);

	const world = useMemo(
		() =>
			createDecoratedRoom(
				tileSet,
				{
					w: widthSlider,
					h: heightSlider,
				},
				windowGapSlider,
				{
					w: blockSpacingWidthSlider,
					h: blockSpacingHeightSlider,
				},
				obstacleType,
			),
		[
			tileSet,
			widthSlider,
			heightSlider,
			blockSpacingWidthSlider,
			blockSpacingHeightSlider,
			windowGapSlider,
			obstacleType,
		],
	);

	return (
		<div>
			<h1>Render</h1>
			<div>
				<label>
					Tile Set:
					<select
						value={tileSet}
						onChange={(e) => setTileSet(e.target.value as RoomTileSet)}
					>
						{RoomTileSets.map((set) => (
							<option key={set} value={set}>
								{set}
							</option>
						))}
					</select>
				</label>
				<label>
					Obstacle Type:
					<select
						value={obstacleType}
						onChange={(e) => setObstacleType(e.target.value as ObstacleType)}
					>
						{ObstacleTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</label>
				<label>
					Width:
					<input
						type="range"
						min={4}
						max={30}
						value={widthSlider}
						onChange={(e) => setWidthSlider(Number.parseInt(e.target.value))}
					/>
					{widthSlider}
				</label>
				<label>
					Height:
					<input
						type="range"
						min={4}
						max={30}
						value={heightSlider}
						onChange={(e) => setHeightSlider(Number.parseInt(e.target.value))}
					/>
					{heightSlider}
				</label>
				<label>
					Block Spacing Width:
					<input
						type="range"
						min={2}
						max={10}
						value={blockSpacingWidthSlider}
						onChange={(e) =>
							setBlockSpacingWidthSlider(Number.parseInt(e.target.value))
						}
					/>
					{blockSpacingWidthSlider}
				</label>
				<label>
					Block Spacing Height:
					<input
						type="range"
						min={2}
						max={10}
						value={blockSpacingHeightSlider}
						onChange={(e) =>
							setBlockSpacingHeightSlider(Number.parseInt(e.target.value))
						}
					/>
					{blockSpacingHeightSlider}
				</label>
				<label>
					Window Gap:
					<input
						type="range"
						min={1}
						max={5}
						value={windowGapSlider}
						onChange={(e) =>
							setWindowGapSlider(Number.parseInt(e.target.value))
						}
					/>
					{windowGapSlider}
				</label>
			</div>
			<div className="w-dvw h-dvh" ref={containerRef}>
				<RenderEngine
					parentRef={containerRef}
					lastResized={0}
					world={world}
					state={{
						room: {
							created: 0,
							lastActivity: 0,
							name: "",
							description: "",
							theme: "",
							spawnPosition: {
								x: 0,
								y: 0,
							},
							playerPositions: {},
						},
						player: {
							id: "",
							profile: {
								processId: "",
								created: 0,
								lastSeen: 0,
								name: "Elliot",
								avatar: "a1204030b070a01",
								status: "",
								currentRoom: "",
								following: {},
							},
							savedPosition: {
								x: 5,
								y: 5,
							},
						},
						otherPlayers: [],
					}}
					events={{
						onPositionUpdate: ({ newPosition, newDirection }): void => {
							console.log({ newPosition, newDirection });
						},
						onPlayerClick: (): void => {
							throw new Error("Function not implemented.");
						},
					}}
					flags={{
						enableMovement: true,
						showWorld: true,
						showPlayer: true,
						showOtherPlayers: true,
						showObjects: true,
					}}
				/>
			</div>
		</div>
	);
}
