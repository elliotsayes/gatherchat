import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { AoUsersState as AoUsersState, AoToonMaybeSaved, AoPostsState, AoToonSaved } from "@/lib/schema/gameModel";
import { useRef, useState } from "react";
import { SidePanel, type SidePanelState } from "./SidePanel";
import { Game } from "./game/Game";
import { ProfileView } from "./profile/ProfileView";
import { SetupForm } from "./profile/SetupForm";
import { type UploadInfo, UploadPage } from "./upload/UploadPage";
import { timeAgo } from "@/lib/timeago";

interface GatherChatProps {
	aoUsersState: AoUsersState;
	aoPostsState: AoPostsState;
	onUpdateProfile(profile: {
		name: string;
		avatarSeed: string;
	}): Promise<boolean>;
	onUpdatePosition(position: { x: number; y: number }): Promise<boolean>;
	onFollow(data: {address: string}): Promise<boolean>;
	onUnfollow(data: {address: string}): Promise<boolean>;
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

	const [sidePanelState, setSidePanelState] = useState<SidePanelState>("feed");

	const [selectedToon, setSelectedToon] = useState<
		AoToonSaved | undefined
	>(undefined);

	const [lastResized, setLastResized] = useState(0);

	const [uploadPageKey, setUploadPageKey] = useState(0);

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
					activityFeed={(
						<div>
							<ul className="w-[100%] h-[100%]">
								{
									aoPostsState.map((post) => {
										const toon = [...aoUsersState.otherToons, aoUsersState.user].find((t) => t.id === post.author);
										if (post.type === "text") {
											return (
												<li key={post.id}>
													<span className="text-muted-foreground"> {toon?.displayName ?? post.author}: </span>
													{post.textOrTxId}
													<span className="text-muted-foreground text-xs"> {timeAgo.format(toon?.lastSeen ?? 0)}</span>
												</li>
											)
										// biome-ignore lint/style/noUselessElse: <explanation>
										} else {
											return (
												<li key={post.id}>
													<span className=" text-muted-foreground"> {toon?.displayName ?? post.author}: </span>
													<a href={`https://arweave.net/${post.textOrTxId}`} target="_blank" className=" text-blue-400">({post.type})</a>
													<span className="text-muted-foreground text-xs"> {timeAgo.format(toon?.lastSeen ?? 0)}</span>
												</li>
											)
										}
									})
								}
							</ul>
						</div>
					)}
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
								toonInfo={selectedToon}
								onChangeFollow={async (toonInfo) => {
									if (toonInfo.isFollowing) {
										await onUnfollow({address: toonInfo.id});
										// alert("Unfollowed!");
									} else {
										await onFollow({address: toonInfo.id});
										// alert("Followed!");
									}
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
					video={<p>Video</p>}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
