import { useMemo, useRef, useState } from "react";
import { randomSeed } from "../sprite/edit";
import { CharacterCreator } from "./CharacterCreator";
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

	const [seed, setSeed] = useState(randomSeed());

	const demoState = useMemo(
		() => ({
			user: {
				id: "me",
				avatarSeed: seed,
				displayName: "ME!!",
				savedPosition: {
					x: 7,
					y: 3,
				},
			},
			otherToons,
		}),
		[seed],
	);

	return (
		<div className=" flex flex-row items-center justify-center h-screen w-screen">
			<CharacterCreator initialSeed={seed} onSeedChange={setSeed} />
			<div ref={containerRef} className="w-[100%] h-[100%] bg-red-50">
				<Game
					parentRef={containerRef}
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
		</div>
	);
};
