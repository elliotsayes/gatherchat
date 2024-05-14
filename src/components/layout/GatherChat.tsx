import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type {
  GatherContactEvents,
  GatherContractState,
} from "@/features/ao/components/GatherContractLoader";
import type { ContractPost } from "@/features/ao/lib/ao-gather";
import {
  RenderEngine,
  type RenderOtherPlayer,
  type RenderState,
} from "@/features/render/components/RenderEngine";
import { createDecoratedRoom } from "@/features/worlds/DecoratedRoom";
import { timeAgo } from "@/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { throttle } from "throttle-debounce";
import { ChatBox } from "../../features/post/components/ChatBox";
import { ProfileView } from "../../features/profile/components/ProfileView";
import { SetupForm } from "../../features/profile/components/SetupForm";
import { SidePanel, type SidePanelState } from "./SidePanel";

export type UploadInfo = Pick<ContractPost, "type" | "textOrTxId">;

interface GatherChatProps {
  playerAddress: string;
  state: GatherContractState;
  events: GatherContactEvents;
  onWorldChange: (worldId: string) => void;
}

export const GatherChat = ({
  playerAddress,
  state: contractState,
  events: contractEvents,
  onWorldChange,
}: GatherChatProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastResized, setLastResized] = useState(0);

  // To force rerender of profile view
  const [profileKey, setProileKey] = useState(0);

  const [sidePanelState, setSidePanelState] = useState<SidePanelState>("feed");

  const [selectedPlayer, setSelectedPlayer] = useState<
    RenderOtherPlayer | undefined
  >(undefined);
  const [animatedPlayer, setAnimatedPlayer] = useState<
    RenderOtherPlayer | undefined
  >();

  const selectAndAnimatePlayer = useCallback((player: RenderOtherPlayer) => {
    setSelectedPlayer(player);
    setAnimatedPlayer(player);
    setTimeout(() => {
      setAnimatedPlayer(undefined);
    }, 1000);
  }, []);

  const throttledUpdatePosition = useMemo(
    () =>
      throttle(
        250,
        async (args: {
          worldId: string;
          position: { x: number; y: number };
        }) => {
          contractEvents.updatePosition(args);
        },
        {
          noTrailing: false,
          noLeading: false,
        },
      ),
    [contractEvents.updatePosition],
  );

  // Convert raw GatherContractState to RenderEngineState
  const renderEngineState: RenderState = useMemo(() => {
    const player = contractState.users[playerAddress];

    return {
      world: {
        id: contractState.worldId,
        data: contractState.world,
      },
      player: {
        id: playerAddress,
        profile: player,
        savedPosition: contractState.world.playerPositions[playerAddress],
      },
      otherPlayers: Object.entries(contractState.users)
        .filter(
          ([otherPlayerAddress, _]) => otherPlayerAddress !== playerAddress,
        )
        .map(([otherPlayerAddress, otherPlayer]) => {
          const savedPosition =
            contractState.world.playerPositions[otherPlayerAddress];
          return {
            id: otherPlayerAddress,
            profile: otherPlayer,
            savedPosition,

            // Derived
            isInWorld: otherPlayer.currentWorldId === contractState.worldId,
            hasPositionInWorld: savedPosition !== undefined,
            isFollowedByUser: Object.keys(player.following).includes(
              otherPlayerAddress,
            ),
            isFollowingUser: Object.keys(otherPlayer.following).includes(
              playerAddress,
            ),

            // Transient
            isActivated: false,
            isTalking: false,
          };
        }),
    };
  }, [playerAddress, contractState]);

  const renderEngineStateTransient = useMemo(() => {
    const stateCopy = window.structuredClone(renderEngineState);
    if (animatedPlayer !== undefined) {
      stateCopy.otherPlayers.filter(
        (p) => p.id === animatedPlayer.id,
      )[0].isActivated = true;
    }
    return stateCopy;
  }, [renderEngineState, animatedPlayer]);

  const world = useMemo(
    () =>
      createDecoratedRoom(
        "room_default",
        {
          w: 21,
          h: 12,
        },
        3,
        {
          w: 4,
          h: 4,
        },
      ),
    [],
  );

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel
        className="h-screen"
        onResize={() => {
          console.log("Resized handle!");
          setLastResized(Date.now());
        }}
      >
        <div ref={containerRef} className="h-screen relative">
          <div className="absolute top-0 left-0 bg-red-100">
            {/* World dropdown */}
            <select
              className=" text-xl px-2 py-1"
              onChange={(e) => {
                onWorldChange(e.target.value);
              }}
              defaultValue={contractState.worldId}
            >
              {contractState.worldIndex.map((worldId) => (
                <option key={worldId} value={worldId}>
                  {worldId}
                </option>
              ))}
            </select>
          </div>
          <RenderEngine
            parentRef={containerRef}
            lastResized={lastResized}
            world={world}
            state={renderEngineStateTransient}
            events={{
              onPositionUpdate: ({ newPosition /* newDirection */ }): void => {
                if (newPosition) {
                  throttledUpdatePosition({
                    worldId: contractState.worldId,
                    position: newPosition,
                  });
                }
              },
              onPlayerClick: (player): void => {
                selectAndAnimatePlayer(player);
                setSidePanelState("profile");
              },
            }}
            flags={{
              enableMovement: true,
              animateMovement: true,
              showWorld: true,
              showPlayer: true,
              showOtherPlayers: true,
              showObjects: true,
            }}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
     <ResizablePanel defaultSize={30} minSize={30} maxSize={50}>
        <SidePanel
          state={sidePanelState}
          onSelectState={setSidePanelState}
          activityFeed={
            <div className="min-h-min h-auto flex flex-col gap-1">
              <ul className="w-full min-h-0 max-h-full h-[calc(100vh-121px)] overflow-y-auto px-2 flex flex-col items-start gap-2.5">
                {Object.keys(contractState.posts).map((postId) => {
                  const post = contractState.posts[postId];
                  const selectedPlayer = [
                    renderEngineState.player,
                    ...renderEngineState.otherPlayers,
                  ].find((t) => t.id === post.author) as
                    | RenderOtherPlayer
                    | undefined;
                  const isUser = renderEngineState.player.id === post.author;
                  const isLink = !isUser && selectedPlayer;
                  return (
                    <li
                      key={postId}
                      className={`${
                        selectedPlayer?.isFollowedByUser ? " " : ""
                      } ${isUser ? "ml-auto pl-12 max-w-md" : "pr-12"} break-words flex flex-row`}
                    >
                        <div className={`${isUser ? "flex flex-col justify-items-end w-full max-w-[420px] leading-1.5 p-1 border-gray-200 bg-gather rounded-e-xl rounded-es-xl dark:bg-gray-700" : "flex flex-col w-full max-w-[420px] leading-1.5 p-1 border-gray-200 bg-gather rounded-e-xl rounded-es-xl dark:bg-gray-700"} `}>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <div className="relative">
                                    <button
                                        className={"bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300"}
                                        type="button"
                                        onClick={
                                            isLink
                                                ? () => {
                                                    selectAndAnimatePlayer(selectedPlayer);
                                                    setSidePanelState("profile");
                                                    }
                                                    : undefined
                                                    }
                                                    >
                                                    {" "}
                                                {selectedPlayer?.profile.name ?? post.author}:{" "}
                                    </button>
                                    <span
                                        className={`${
                                            selectedPlayer?.isFollowedByUser ? "my-friend -top-2 -left-2 absolute z-20  w-4 h-4 bg-purple-700  dark:border-gray-800 rounded-full" : ""
                                        } ${isUser ? " " : ""} break-words max-w-lg flex flex-row`}
                                        ></span>
                                </div>
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                    {" "}
                                    {timeAgo.format(post.created)}
                                </span>
                            </div>

                            <div className="flex flex-col leading-1.5 p-1 border-gray-200 bg-gather bg-gather rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                <p className="text-sm font-normal text-gray-900 dark:text-white">
                                    {post.type === "text" ? (
                                        <span>{post.textOrTxId}</span>
                                    ) : (
                                        <a
                                            href={`https://arweave.net/${post.textOrTxId}`}
                                            target="_blank"
                                            className="text-sm font-normal text-gray-900 dark:text-white"
                                            rel="noreferrer"
                                        >
                                            ({post.type})
                                        </a>
                                    )}
                                </p>
                            </div>
                        </div>
                    </li>
                  );
                })}
              </ul>
                <ChatBox
                  onSubmit={async (text) => {
                    await contractEvents.post({
                      type: "text",
                      worldId: contractState.worldId,
                      textOrTxId: text,
                    });
                    toast("Message sent!");
                  }}
                />
            </div>
          }
          upload={<p>TODO</p>}
          profile={
            selectedPlayer ? (
              <ProfileView
                key={profileKey}
                otherPlayer={selectedPlayer}
                onChangeFollow={async (otherPlayer) => {
                  if (otherPlayer.isFollowedByUser) {
                    await contractEvents.unfollow({
                      address: otherPlayer.id,
                    });
                    toast("Unfollowed!");
                  } else {
                    await contractEvents.follow({
                      address: otherPlayer.id,
                    });
                    toast("Followed!");
                  }
                  setSelectedPlayer(undefined);
                  setProileKey(Date.now());
                }}
                onClose={() => setSelectedPlayer(undefined)}
              />
            ) : (
              <SetupForm
                onSubmit={(s) => {
                  contractEvents
                    .updateUser({
                      name: s.username,
                      avatar: s.avatarSeed,
                    })
                    .then(() => {
                      toast("Profile updated!");
                    });
                }}
                initialUsername={renderEngineState.player.profile.name}
                initialSeed={renderEngineState.player.profile.avatar}
              />
            )
          }
        />
     </ResizablePanel>
    </ResizablePanelGroup>
  );
};
