import { GatherChat2 } from "@/components/layout/GatherChat2";
import { GatherContractLoader } from "@/features/ao/components/GatherContractLoader";
import WalletLoader from "@/features/ao/components/WalletLoader";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/game2")({
	component: Game2,
});

function Game2() {
	return (
		<WalletLoader>
			{(arweaveAddress) => (
				<GatherContractLoader>
					{(state, events) => (
						<GatherChat2
							playerAddress={arweaveAddress}
							state={state}
							events={events}
						/>
					)}
				</GatherContractLoader>
			)}
		</WalletLoader>
	);
}
