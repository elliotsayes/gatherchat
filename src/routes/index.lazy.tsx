import { GatherChatDemo } from "@/components/layout/GatherChatDemo";
import { buttonVariants } from "@/components/ui/button";
import {
  GatherContractLoader,
  type GatherContractState,
} from "@/features/ao/components/GatherContractLoader";
import { randomSeed } from "@/features/avatar/lib/edit";
import { cn } from "@/utils";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Suspense, useRef, useState } from "react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const defaultState: GatherContractState = {
  worldIndex: ["WelcomeLobby"],
  worldId: "WelcomeLobby",
  world: {
    created: 0,
    lastActivity: 0,
    name: "",
    description: "",
    theme: "",
    spawnPosition: {
      x: 5,
      y: 4,
    },
    playerPositions: {},
  },
  users: {},
  posts: {},
};

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [randomAvatar] = useState(() => randomSeed());

  return (
    <div ref={containerRef} className="w-[100%] h-[100%] relative">
      <div className="z-10 absolute w-[100%] h-[100%] bg-gather/60 flex flex-col justify-center items-center">

        <div className="text-black bg-gather/90 border-solid border-2 border-gatherstrong p-10 pb-2 rounded-3xl flex flex-col items-center">
          <img className="inline-block h-20 w-auto mb-4"
               src="./assets/newheart.png"
               alt="Gather Chat logo" />

          <ol className="silkscreen-regular">
            <li className="h-10">
              <span>
                1. Install{" "}
                <a
                  href="https://www.arconnect.io/download"
                  target="_blank"
                  rel="noreferrer"
                  className="unterline text-violet-800 "
                >
                  ArConnect
                </a>
              </span>
            </li>
            <li className="h-10">
              <span className="pl-3">2. Set up a wallet</span>
            </li>
            <li className="h-10 pl-2 mb-10">
              <Link
                to="/game"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Play Gather Chat!
              </Link>
            </li>
          </ol>

          <div className="w-[100%] bottom-0 text-gray-500 flex flex-col justify-end items-center pb-2">
            <p className="text-xs">
              Created by Elliot Sayes. Source on{" "}
              <a
                  href="https://github.com/elliotsayes/gatherchat"
                  target="_black"
                  className="underline text-gray-800"
              >
                Github
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="z-0 absolute w-[100%] h-[100%] overflow-hidden">
        <Suspense
          fallback={
            <GatherChatDemo
              containerRef={containerRef}
              state={defaultState}
              avatarSeed={randomAvatar}
            />
          }
        >
          <GatherContractLoader>
            {(state) => (
              <GatherChatDemo
                containerRef={containerRef}
                state={state}
                avatarSeed={randomAvatar}
              />
            )}
          </GatherContractLoader>
        </Suspense>
      </div>
    </div>
  );
}
