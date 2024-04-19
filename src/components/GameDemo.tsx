import { randomSeed } from "../sprite/edit";
import { Game } from "./Game";

function generateOtherToon(i: number) {
	return {
		id: "otherToon" + i,
		avatarSeed: randomSeed(),
		displayName: "Toon #" + i,
		savedPosition: {
			x: i * 2 + 1,
			y: i * 2 + 1,
		},
	};
}

const demoState = {
	user: {
		id: "me",
		avatarSeed: randomSeed(),
		displayName: "ME!!",
		savedPosition: {
			x: 7,
			y: 3,
		},
	},
	otherToons: Array.from(Array(4).keys()).map(generateOtherToon),
};

export const GameDemo = () => {
	return (
		<Game
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
	);
};
