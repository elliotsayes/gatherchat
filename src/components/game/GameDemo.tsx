import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { AoToonMaybeSaved } from "@/lib/schema/gameModel";
import { useMemo, useRef, useState } from "react";
import { randomSeed } from "../../sprite/edit";
import { SidePanel, type SidePanelState } from "../SidePanel";
import { CharacterCreator } from "../profile/CharacterCreator";
import { ProfileView } from "../profile/ProfileView";
import { SetupForm } from "../profile/SetupForm";
import { Game } from "./Game";

function generateOtherToon(i: number) {
	return {
		id: `otherToon${i}`,
		avatarSeed: randomSeed(),
		displayName: `Toon #${i}`,
		savedPosition: {
			x: i * 2 + 1,
			y: i * 2 + 2,
		},
	};
}

const otherToons = Array.from(Array(4).keys()).map(generateOtherToon);

export const GameDemo = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	const [name, setName] = useState("ME!");
	const [seed, setSeed] = useState(randomSeed());
	const [sidePanelState, setSidePanelState] = useState<SidePanelState>("feed");

	const [selectedToon, setSelectedToon] = useState<
		AoToonMaybeSaved | undefined
	>(undefined);

	const [lastResized, setLastResized] = useState(0);

	const demoState = useMemo(
		() => ({
			user: {
				id: "me",
				avatarSeed: seed,
				displayName: name,
				savedPosition: {
					x: 7,
					y: 3,
				},
			},
			otherToons,
		}),
		[name, seed],
	);

	return (
		<ResizablePanelGroup direction="horizontal" className="h-screen">
			<ResizablePanel
				className="h-screen"
				onResize={() => {
					console.log("Resized handle!");
					setLastResized(Date.now());
				}}
			>
				<div ref={containerRef} className="h-screen">
					<Game
						parentRef={containerRef}
						lastResized={lastResized}
						aoStateProp={demoState}
						onSelectToon={(toon) => {
							console.info("onSelectToon", toon);
							setSelectedToon(toon);
							setSidePanelState("profile");
						}}
						onViewFeed={() => {
							alert("onViewFeed");
						}}
						onSavePosition={async (position) => {
							await new Promise((resolve) => setTimeout(resolve, 2000));
							return confirm(`onSavePosition: ${JSON.stringify(position)}`);
						}}
					/>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
				<SidePanel
					state={sidePanelState}
					onSelectState={setSidePanelState}
					activityFeed={<p>AF</p>}
					profile={
						selectedToon ? (
							<ProfileView
								toonInfo={selectedToon}
								onCall={() => {
									console.log("Call clicked!");
									setSidePanelState("video");
								}}
								onClose={() => setSelectedToon(undefined)}
							/>
						) : (
							<SetupForm
								onSubmit={(s) => {
									setSeed(s.avatarSeed);
									setName(s.username);
								}}
								initialUsername={demoState.user.displayName}
								initialSeed={demoState.user.avatarSeed}
							/>
						)
					}
					video={<p>Video</p>}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
