import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import type {
	AoPostsState,
	AoToonSaved,
	AoUsersState,
} from "@/lib/schema/gameModel";
import { timeAgo } from "@/lib/timeago";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { SidePanel, type SidePanelState } from "./SidePanel";
import { Game } from "./game/Game";
import { ProfileView } from "./profile/ProfileView";
import { SetupForm } from "./profile/SetupForm";
import { ChatBox } from "./upload/ChatBox";
import { type UploadInfo, UploadPage } from "./upload/UploadPage";

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
					<Game
						parentRef={containerRef}
						lastResized={lastResized}
						aoStateProp={aoUsersState}
						onSelectToon={(toon) => {
							console.info("onSelectToon", toon);
							setSelectedToon(toon);
							setSidePanelState("profile");
						}}
						onViewFeed={() => {
							setSidePanelState("feed");
						}}
						onSavePosition={async (position) => {
							const res = await onUpdatePosition(position);
							if (res) {
								toast("Saved your home position!");
								return true;
								// biome-ignore lint/style/noUselessElse: <explanation>
							} else {
								toast("Update failed!");
								return false;
							}
							// const doUpdate = confirm("Update saved position?");
							// if (doUpdate) {
							// 	const res = await onUpdatePosition(position);
							// 	if (res) {
							// 		alert("Position updated!");
							// 	} else {
							// 		alert("Update failed!");
							// 	}
							// }
							// return doUpdate;
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
											<span
												className={`text-muted-foreground text-underline px-1 ${
													isLink ? "cursor-pointer" : ""
												}`}
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
											</span>
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
					upload={
						<UploadPage
							key={uploadPageKey}
							onDone={async (info) => {
								// Reset key
								if (info) {
									await onUpload(info);
									toast("Media uploaded! 🎉");
								}
								setUploadPageKey(Date.now());
							}}
						/>
					}
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
