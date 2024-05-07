import type {
	AoPostsState,
	AoToonSaved,
	AoUsersState,
	Position,
} from "@/_old/lib/model";
import type { ContractPost } from "@/ao/lib/ao-gather";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { timeAgo } from "@/lib/timeago";
import { RenderEngine } from "@/render/components/RenderEngine";
import { TileLoader } from "@/render/components/TileLoader";
import { ObstacleLayout } from "@/rooms/components/ObstacleLayout";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Game } from "../../_old/components/Game";
import { ChatBox } from "../../post/components/ChatBox";
import { ProfileView } from "../../profile/components/ProfileView";
import { SetupForm } from "../../profile/components/SetupForm";
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
	onFollow,
	onUnfollow,
	onUpload,
}: GatherChatProps) => {
	console.log({ aoState: aoUsersState });

	const containerRef = useRef<HTMLDivElement>(null);

	const [sidePanelState, setSidePanelState] =
		useState<SidePanelState>("profile");

	const [selectedToon, setSelectedToon] = useState<AoToonSaved | undefined>(
		undefined,
	);

	const [lastResized, setLastResized] = useState(0);

	const [uploadPageKey, setUploadPageKey] = useState(0);
	const [profileKey, setProileKey] = useState(0);

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
						lastResized={0}
						world={{
							tileSet: (
								<TileLoader alias="drum" src="assets/tiles/drum.json">
									<ObstacleLayout
										tileSet={"room"}
										roomSizeTiles={{
											w: 21,
											h: 12,
										}}
										windowSpacing={3}
									/>
								</TileLoader>
							),
							sprites: <></>,
							collision: (pos: Position) => false,
						}}
						state={{
							room: {
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
								localPosition: aoUsersState.user.savedPosition,
								localDirection: "left",
								isRunning: false,
							},
							otherPlayers: [],
						}}
						events={{
							onPositionUpdate: ({ newPosition, newDirection }): void => {
								if (newPosition) {
									onUpdatePosition(newPosition);
								}
							},
							onPlayerClick: (playerId: string): void => {
								setSelectedToon(
									aoUsersState.otherToons.find((t) => t.id === playerId),
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
						selectedToon ? (
							<ProfileView
								key={profileKey}
								toonInfo={selectedToon}
								onChangeFollow={async (toonInfo) => {
									if (toonInfo.isFollowing) {
										await onUnfollow({ address: toonInfo.id });
										toast("Unfollowed!");
									} else {
										await onFollow({ address: toonInfo.id });
										toast("Followed!");
									}
									setProileKey(Date.now());
									setSelectedToon(undefined);
								}}
								onCall={() => {
									console.log("Call clicked!");
									setSidePanelState("video");
								}}
								onClose={() => setSelectedToon(undefined)}
							/>
						) : (
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
						)
					}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
