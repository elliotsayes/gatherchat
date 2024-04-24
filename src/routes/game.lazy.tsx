import { GameLoader } from "@/components/GameLoader";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/game")({
	component: Game,
});

function Game() {
	return <GameLoader />;
}
