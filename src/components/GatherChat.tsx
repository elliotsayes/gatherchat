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
import { SidePanel, type SidePanelState } from "./SidePanel";
import { Game } from "./game/Game";
import { ProfileView } from "./profile/ProfileView";
import { SetupForm } from "./profile/SetupForm";
import { ChatBox } from "./upload/TextUpload";
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
							const doUpdate = confirm("Update saved position?");
							if (doUpdate) {
								const res = await onUpdatePosition(position);
								if (res) {
									alert("Position updated!");
								} else {
									alert("Update failed!");
								}
							}
							return doUpdate;
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
						<div className="h-[100%] flex flex-col gap-4 pb-6">
							<ul className="flex-grow">
								{aoPostsState.map((post) => {
									const toon = [
										...aoUsersState.otherToons,
										aoUsersState.user,
									].find((t) => t.id === post.author);
									const isUser = aoUsersState.user.id === post.author;
									return (
										<li
											key={post.id}
											className={`${toon?.isFollowing ? "bg-blue-100" : ""} ${
												isUser ? "bg-gray-200" : ""
											}`}
										>
											<span className=" text-muted-foreground">
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
												{timeAgo.format(toon?.lastSeen ?? 0)}
											</span>
										</li>
									);
								})}
							</ul>
							<ChatBox
								onSubmit={async (text) => {
									await onUpload({ type: "text", textOrTxId: text });
								}}
							/>
						</div>
					}
					upload={
						<UploadPage
							key={uploadPageKey}
							onDone={async (info) => {
								// Reset key
								if (info) {
									await onUpload(info);
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
										alert("Unfollowed!");
									} else {
										await onFollow({ address: toonInfo.id });
										alert("Followed!");
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
											alert("Profile updated!");
										} else {
											alert("Update failed!");
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
