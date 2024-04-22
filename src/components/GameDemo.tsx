import { useMemo, useRef, useState } from "react";
import { randomSeed } from "../sprite/edit";
import { CharacterCreator } from "./CharacterCreator";
import { Game } from "./Game";
import { SidePanel, SidePanelState } from "./SidePanel";
import { SetupForm } from "./SetupForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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
		<ResizablePanelGroup
      direction="horizontal"
      className="h-screen"
    >
      <ResizablePanel className="h-screen" onResize={() => {
				console.log('Resized handle!');
				setLastResized(Date.now())
			}}>
				<div ref={containerRef} className="h-screen">
					<Game
						parentRef={containerRef}
						lastResized={lastResized}
						aoStateProp={demoState}
						onSelectToon={(toonId) => {
							console.info("onSelectToon", toonId);
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
			<ResizableHandle withHandle/>
			<ResizablePanel defaultSize={50} minSize={25} maxSize={50}>
				<SidePanel state={sidePanelState} onSelectState={setSidePanelState}
					activityFeed={<p>AF</p>}
					profile={
					<SetupForm onSubmit={(s) => {
						setSeed(s.avatarSeed)
						setName(s.username);
					}} />}
					video={<p>Video</p>}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
