import { RenderEngine } from "@/features/render/components/RenderEngine";
import {
	createWorld,
} from "@/features/rooms/components/ObstacleLayout";
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

	const [widthSlider, setWidthSlider] = useState(21);
	const [heightSlider, setHeightSlider] = useState(12);
	const [windowGapSlider, setWindowGapSlider] = useState(3);

	const world = useMemo(() => createWorld({
		w: widthSlider,
		h: heightSlider,
	}, "room", windowGapSlider), [widthSlider, heightSlider, windowGapSlider]);

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
