import { GatherChat } from "@/components/layout/GatherChat";
import { GatherContractLoader } from "@/features/ao/components/GatherContractLoader";
import WalletLoader from "@/features/ao/components/WalletLoader";
import { Register } from "@/features/profile/components/Register";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/game")({
    component: Game,
});

function Game() {
    return (
        <WalletLoader>
            {(arweaveAddress) => (
                <GatherContractLoader>
                    {(state, events) => {
                        if (state.users[arweaveAddress] === undefined) {
                            return <Register events={events} />;
                        }
                        return (
                            <GatherChat
                                playerAddress={arweaveAddress}
                                state={state}
                                events={events}
                            />
                        );
                    }}
                </GatherContractLoader>
            )}
        </WalletLoader>
    );
}
