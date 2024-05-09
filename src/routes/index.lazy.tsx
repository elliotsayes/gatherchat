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
      <div className="z-10 absolute w-[100%] h-[100%] text-white bg-gray-800/80 flex flex-col justify-center items-center pb-10">
        <img src="./assets/logo.png" width={400} alt="Gather Chat logo" />
        <div>
          <ol>
            <li className="h-10 pl-2">
              <span className="font-mono">1. </span>
              <span className="pl-3">
                Install{" "}
                <a
                  href="https://www.arconnect.io/download"
                  target="_blank"
                  rel="noreferrer"
                  className="unterline text-blue-200"
                >
                  ArConnect
                </a>
              </span>
            </li>
            <li className="h-10 pl-2">
              <span className="font-mono">2. </span>
              <span className="pl-3">Set up a wallet</span>
            </li>
            <li className="h-10 pl-2">
              <span className="font-mono">3. </span>
              <Link
                to="/game"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Play Gather Chat!
              </Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="z-20 absolute w-[100%] bottom-0 text-white flex flex-col justify-end items-center py-4">
        <p>
          Created by Elliot Sayes. Source on{" "}
          <a
            href="https://github.com/elliotsayes/gatherchat"
            target="_black"
            className="underline text-blue-200"
          >
            Github
          </a>
          .
        </p>
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
