import { randomSeed } from "../sprite/edit";
import { Game } from "./Game";

function generateOtherToon(i: number) {
	return {
		id: "otherToon" + i,
		avatarSeed: randomSeed(),
		displayName: "Toon #" + i,
		savedPosition: {
			x: i,
			y: i,
		},
	};
}

const demoState = {
	user: {
		id: "me",
		avatarSeed: randomSeed(),
		displayName: "ME!!",
		savedPosition: {
			x: 0,
			y: 0,
		},
	},
	otherToons: Array.from(Array(10).keys()).map(generateOtherToon),
};

export const GameDemo = () => {
	return (
		<Game
			aoStateProp={demoState}
			onSelectToon={function (toonId: string): void {
				console.log({ toonId });
			}}
			onViewFeed={function (): void {
				console.log("onViewFeed");
			}}
		/>
	);
};
