import { createLazyFileRoute } from "@tanstack/react-router";
import type { Position } from "@/_old/lib/model";
import { AoGatherProvider } from "@/ao/lib/ao-gather";
import { useRef, useState } from "react";
import { ObstacleLayout, blockLocations } from "@/rooms/components/ObstacleLayout";
import InteractableSprite from "@/render/components/InteractableSprite";
import { TileLoader } from "@/render/components/TileLoader";
import { RenderEngine } from "@/render/components/RenderEngine";

export const Route = createLazyFileRoute("/render")({
	component: Render,
});

export const tileSize = {
	x: 64,
	y: 64,
};

const aoGather = new AoGatherProvider();

function Render() {
	const containerRef = useRef<HTMLDivElement>(null);

	const [widthSlider, setWidthSlider] = useState(21);
	const [heightSlider, setHeightSlider] = useState(12);
	const [windowGapSlider, setWindowGapSlider] = useState(3);

	const [position, setPosition] = useState<Position>({ x: 10, y: 5 });

	return (
		<div>
			<h1>Render</h1>
			<div>
				<label>
					Width:
					<input
						type="range"
						min={1}
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
						min={1}
						max={30}
						value={heightSlider}
						onChange={(e) => setHeightSlider(Number.parseInt(e.target.value))}
					/>
					{heightSlider}
				</label>
				<label>
					Window Gap:
					<input
						type="range"
						min={1}
						max={5}
						value={windowGapSlider}
						onChange={(e) => setWindowGapSlider(Number.parseInt(e.target.value))}
					/>
					{windowGapSlider}
				</label>
			</div>
			<div className="w-dvw h-dvh" ref={containerRef}>
				<RenderEngine
					parentRef={containerRef}
					lastResized={0}

					world={{
						collision: () => true,
						tileSet: (
							<TileLoader alias="drum" src="assets/tiles/drum.json">
								<ObstacleLayout
									tileSet={"room"}
									roomSizeTiles={{
										w: widthSlider,
										h: heightSlider,
									}}
									windowSpacing={windowGapSlider}
								/>
							</TileLoader>
						),
						sprites: (
							<>
								<InteractableSprite
									image="assets/sprite/board.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.45 }}
									// onclick={() => events.onViewFeed()}
									x={tileSize.x * 5}
									y={tileSize.y * 1.25}
								/>
								<InteractableSprite
									active={false}
									image="assets/sprite/cal.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * 2}
									y={tileSize.y * 1}
								/>
								<InteractableSprite
									active={false}
									image="assets/sprite/couch.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * 19}
									y={tileSize.y * 2}
								/>
								<InteractableSprite
									active={false}
									image="assets/sprite/mona.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * 8}
									y={tileSize.y * 1.25}
								/>
								<InteractableSprite
									active={false}
									image="assets/sprite/stary.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * 11}
									y={tileSize.y * 1.25}
								/>
								<InteractableSprite
									active={false}
									image="assets/sprite/tv.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * 14}
									y={tileSize.y * 1}
								/>
								<InteractableSprite
									active={false}
									image="assets/sprite/scream.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * 17}
									y={tileSize.y * 1.25}
								/>
							{blockLocations({
								w: widthSlider,
								h: heightSlider,
							}, {
								w: 4,
								h: 4,
							}).map((blockLocation, i) => (
								<InteractableSprite
									active={false}
									key={i.toString()}
									zIndex={100}
									image="assets/sprite/tree.png"
									scale={4}
									anchor={{ x: 0.5, y: 0.5 }}
									// onclick={() => onViewFeed()}
									x={tileSize.x * (blockLocation.x + 0.5)}
									y={tileSize.y * (blockLocation.y + 1)}
								/>
							))}
						</>
						),
					}}
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
							playerPositions: {

							},
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
								x: 0,
								y: 0,
							},
							localPosition: position,
							localDirection: "left",
							isRunning: false,
						},
						otherPlayers: [],
					}}
					events={{
						onPositionUpdate: ({newPosition, newDirection}): void => {
							if (newPosition) {
								setPosition(newPosition);
							}
						},
						onPlayerClick: (playerId: string): void => {
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
