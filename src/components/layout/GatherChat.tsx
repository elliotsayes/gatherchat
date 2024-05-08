import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import type {
	AoPostsState,
	AoToonSaved,
	AoUsersState,
} from "@/features/_old/lib/model";
import type { ContractPost } from "@/features/ao/lib/ao-gather";
import { RenderEngine } from "@/features/render/components/RenderEngine";
import { TileLoader } from "@/features/render/components/TileLoader";
import { RoomLayout } from "@/features/worlds/components/RoomLayout";
import { timeAgo } from "@/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ChatBox } from "../../features/post/components/ChatBox";
// import { ProfileView } from "../../features/profile/components/ProfileView";
import { SetupForm } from "../../features/profile/components/SetupForm";
import { SidePanel, type SidePanelState } from "./SidePanel";

export type UploadInfo = Pick<ContractPost, "type" | "textOrTxId">;

interface GatherChatProps {
	aoUsersState: AoUsersState;
	aoPostsState: AoPostsState;
	onUpdateProfile(profile: {
		name: string;
		avatarSeed: string;
	}): Promise<boolean>;
	onUpdatePosition(position: { x: number; y: number }): Promise<boolean>;
	onFollow(data: { address: string }): Promise<boolean>;
	onUnfollow(data: { address: string }): Promise<boolean>;
	onUpload(upload: UploadInfo): Promise<boolean>;
}

export const GatherChat = ({
	aoUsersState,
	aoPostsState,
	onUpdateProfile,
	onUpdatePosition,
	// onFollow,
	// onUnfollow,
	onUpload,
}: GatherChatProps) => {
	console.log({ aoState: aoUsersState });

	const containerRef = useRef<HTMLDivElement>(null);

	const [sidePanelState, setSidePanelState] =
		useState<SidePanelState>("profile");

	const [_, setSelectedToon] = useState<AoToonSaved | undefined>(undefined);

	const [lastResized, setLastResized] = useState(0);

	// const [profileKey, setProileKey] = useState(0);

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
						world={{
							tileSet: (
								<TileLoader alias="drum" src="assets/tiles/drum.json">
									<RoomLayout
										tileSet={"room"}
										roomSizeTiles={{
											w: 21,
											h: 12,
										}}
										windowSpacing={3}
									/>
								</TileLoader>
							),
							spritesBg: <></>,
							spritesFg: <></>,
							collision: () => false,
						}}
						state={{
							room: {
								id: "WelcomeLobby",
								data: {
									created: 0,
									lastActivity: 0,
									name: "",
									description: "",
									theme: "",
									spawnPosition: {
										x: 0,
										y: 0,
									},
									playerPositions: {},
								},
							},
							player: {
								id: "",
								profile: {
									processId: "",
									created: 0,
									lastSeen: 0,
									name: aoUsersState.user.displayName,
									avatar: aoUsersState.user.avatarSeed,
									status: "",
									currentRoom: "",
									following: {},
								},
								savedPosition: aoUsersState.user.savedPosition,
							},
							otherPlayers: [],
						}}
						events={{
							onPositionUpdate: ({ newPosition, newDirection }): void => {
								console.log({ newPosition, newDirection });
								if (newPosition) {
									onUpdatePosition(newPosition);
								}
							},
							onPlayerClick: (player): void => {
								setSelectedToon(
									aoUsersState.otherToons.find((t) => t.id === player.id),
								);
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
								{aoPostsState.map((post) => {
									const toon = [
										...aoUsersState.otherToons,
										aoUsersState.user,
									].find((t) => t.id === post.author);
									const isUser = aoUsersState.user.id === post.author;
									const isLink = !isUser && toon;
									return (
										<li
											key={post.id}
											className={`${toon?.isFollowing ? "bg-blue-100" : ""} ${
												isUser ? "bg-gray-200" : ""
											} break-words max-w-sm`}
										>
											<button
												className={"text-muted-foreground text-underline px-1"}
												type="button"
												onClick={
													isLink
														? () => {
																setSelectedToon(toon);
																setSidePanelState("profile");
															}
														: undefined
												}
											>
												{" "}
												{toon?.displayName ?? post.author}:{" "}
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
										await onUpload({ type: "text", textOrTxId: text });
										toast("Message sent!");
									}}
								/>
							</div>
						</div>
					}
					upload={<p>TODO</p>}
					profile={
						<SetupForm
							onSubmit={(s) => {
								onUpdateProfile({
									name: s.username,
									avatarSeed: s.avatarSeed,
								}).then((res) => {
									if (res) {
										toast("Profile updated!");
									} else {
										toast("Update failed!");
									}
								});
							}}
							initialUsername={aoUsersState.user.displayName}
							initialSeed={aoUsersState.user.avatarSeed}
						/>
					}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
