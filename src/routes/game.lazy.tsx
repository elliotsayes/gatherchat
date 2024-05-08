import { GatherChat } from "@/components/layout/GatherChat";
import { GatherContractLoader } from "@/features/ao/components/GatherContractLoader";
import WalletLoader from "@/features/ao/components/WalletLoader";
import { Register } from "@/features/profile/components/Register";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createLazyFileRoute("/game")({
  component: Game,
});

function Game() {
  return (
    <Suspense
      fallback={(
        <div className="h-screen w-screen text-center flex flex-col justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      )}
    >
      <WalletLoader>
        {(arweaveAddress) => (
          <GatherContractLoader>
            {(state, events, onWorldChange) => {
              if (state.users[arweaveAddress] === undefined) {
                return <Register events={events} />;
              }
              return (
                <GatherChat
                  key={state.worldId}
                  playerAddress={arweaveAddress}
                  state={state}
                  events={events}
                  onWorldChange={onWorldChange}
                />
              );
            }}
          </GatherContractLoader>
        )}
      </WalletLoader>
    </Suspense>
  );
}
