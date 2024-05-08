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
	type RenderEngineState,
	type RenderOtherPlayer,
} from "@/features/render/components/RenderEngine";
import { createDecoratedRoom } from "@/features/worlds/DecoratedRoom";
import { timeAgo } from "@/utils";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ChatBox } from "../../features/post/components/ChatBox";
import { ProfileView } from "../../features/profile/components/ProfileView";
import { SetupForm } from "../../features/profile/components/SetupForm";
import { SidePanel, type SidePanelState } from "./SidePanel";
import { throttle } from "throttle-debounce";

export type UploadInfo = Pick<ContractPost, "type" | "textOrTxId">;

interface GatherChat2Props {
	arweaveAddress: string;
	state: GatherContractState;
	events: GatherContactEvents;
}

export const GatherChat2 = ({
	arweaveAddress,
	state: contractState,
	events: contractEvents,
}: GatherChat2Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [lastResized, setLastResized] = useState(0);

	// To force rerender of profile view
	const [profileKey, setProileKey] = useState(0);

	const [sidePanelState, setSidePanelState] =
		useState<SidePanelState>("profile");
	const [selectedPlayer, setSelectedPlayer] = useState<
		RenderOtherPlayer | undefined
	>(undefined);
	
	const throttledUpdatePosition = useMemo(
		() =>
			throttle(
				250,
				async (args) => {
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
	const renderEngineState: RenderEngineState = useMemo(() => {
		const player = contractState.users[arweaveAddress];

		return {
			room: {
				id: contractState.worldId,
				data: contractState.room,
			},
			player: {
				id: arweaveAddress,
				profile: player,
				savedPosition: contractState.room.playerPositions[arweaveAddress],
			},
			otherPlayers: Object.entries(contractState.users)
				.filter(
					([address, player]) =>
						address !== arweaveAddress &&
						player.currentRoom === contractState.room.name,
				)
				.map(([address, otherPlayer]) => {
					return {
						id: address,
						profile: otherPlayer,
						savedPosition: contractState.room.playerPositions[address],

						// Derived
						isFollowingUser: Object.keys(otherPlayer.following).includes(
							address,
						),
						isFollowedByUser: Object.keys(player.following).includes(
							arweaveAddress,
						),
						isInRoom: true,
						isActivated: false,
						isTalking: false,
					};
				}),
		};
	}, [arweaveAddress, contractState]);

	return (
		<ResizablePanelGroup direction="horizontal" className="h-screen">
			<ResizablePanel
				className="h-screen"
				onResize={() => {
					console.log("Resized handle!");
					setLastResized(Date.now());
				}}
			>
				<div ref={containerRef} className="h-screen">
					<RenderEngine
						parentRef={containerRef}
						lastResized={lastResized}
						world={createDecoratedRoom(
							"room",
							{
								w: 21,
								h: 12,
							},
							3,
							{
								w: 4,
								h: 4,
							},
						)}
						state={renderEngineState}
						events={{
							onPositionUpdate: ({ newPosition /* newDirection */ }): void => {
								if (newPosition) {
									throttledUpdatePosition({
										roomId: "WelcomeLobby",
										position: newPosition,
									});
								}
							},
							onPlayerClick: (player): void => {
								player && setSelectedPlayer(player);
							},
						}}
						flags={{
							enableMovement: true,
							showWorld: true,
							showPlayer: true,
							showOtherPlayers: true,
							showObjects: true,
						}}
					/>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
				<SidePanel
					state={sidePanelState}
					onSelectState={setSidePanelState}
					activityFeed={
						<div className="min-h-min h-auto flex flex-col gap-4 py-4">
							<ul className="w-[100%] min-h-0 max-h-full h-[calc(100vh-140px)] overflow-y-auto px-2">
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
												selectedPlayer?.isFollowedByUser ? "bg-blue-100" : ""
											} ${isUser ? "bg-gray-200" : ""} break-words max-w-sm`}
										>
											<button
												className={"text-muted-foreground text-underline px-1"}
												type="button"
												onClick={
													isLink
														? () => {
																setSelectedPlayer(selectedPlayer);
																setSidePanelState("profile");
															}
														: undefined
												}
											>
												{" "}
												{selectedPlayer?.profile.name ?? post.author}:{" "}
											</button>
											{post.type === "text" ? (
												<span>{post.textOrTxId}</span>
											) : (
												<a
													href={`https://arweave.net/${post.textOrTxId}`}
													target="_blank"
													className=" text-blue-400"
													rel="noreferrer"
												>
													({post.type})
												</a>
											)}
											<span className="text-muted-foreground text-xs">
												{" "}
												{timeAgo.format(post.created)}
											</span>
										</li>
									);
								})}
							</ul>
							<div className="">
								<ChatBox
									onSubmit={async (text) => {
										await contractEvents.post({
											type: "text",
											room: contractState.worldId,
											textOrTxId: text,
										});
										toast("Message sent!");
									}}
								/>
							</div>
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
										await contractEvents.unfollow({ address: otherPlayer.id });
										toast("Unfollowed!");
									} else {
										await contractEvents.follow({ address: otherPlayer.id });
										toast("Followed!");
									}
									setProileKey(Date.now());
									setSelectedPlayer(undefined);
								}}
								onCall={() => {
									console.log("Call clicked!");
									setSidePanelState("video");
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
