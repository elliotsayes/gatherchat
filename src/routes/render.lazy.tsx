import { createLazyFileRoute } from "@tanstack/react-router";
import { RenderEngine } from "@/components/game/RenderEngine";
import { useRef } from "react";
import { AoGatherProvider } from "@/lib/ao-gather";

export const Route = createLazyFileRoute("/render")({
	component: Render,
});

const aoGather = new AoGatherProvider();

function Render() {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="w-dvw h-dvh" ref={containerRef}>
			<RenderEngine
				parentRef={containerRef}
				lastResized={0}
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
							name: "",
							avatar: "a1204030b070a01",
							status: "",
							currentRoom: "",
							following: {},
						},
						savedPosition: {
							x: 0,
							y: 0,
						},
						localPosition: {
							x: 0,
							y: 0,
						},
						localDirection: "left",
						isRunning: false,
					},
					otherPlayers: [],
				}}
				events={{
					onViewFeed: (): void => {
						throw new Error("Function not implemented.");
					},
					onMovementKey: (key: string): void => {
						console.log(key);
						aoGather.register({
							name: "Test",
							avatar: "a1204030b070a01",
							status: "Test",
							currentRoom: "HolidayHangout",
							following: {},
						})
						aoGather.updatePosition({
							roomId: "HolidayHangout",
							position: {
								x: 0,
								y: 0,
							},
						})
					},
					onPlayerClick: (playerId: string): void => {
						throw new Error("Function not implemented.");
					},
				}}
				flags={{
					showWorld: true,
					showPlayer: true,
					showOtherPlayers: true,
					showObjects: true,
				}}
			/>
		</div>
	);
}
