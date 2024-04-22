import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { AoState, AoToonMaybeSaved } from "@/lib/schema/gameModel";
import { useRef, useState } from "react";
import { SidePanel, type SidePanelState } from "./SidePanel";
import { Game } from "./game/Game";
import { ProfileView } from "./profile/ProfileView";
import { SetupForm } from "./profile/SetupForm";
import { type UploadInfo, UploadPage } from "./upload/UploadPage";

interface GatherChatProps {
	aoState: AoState;
	onUpdateProfile(profile: {
		name: string;
		avatarSeed: string;
	}): Promise<boolean>;
	onUpdatePosition(position: { x: number; y: number }): Promise<boolean>;
	onFollow(data: {address: string}): Promise<boolean>;
	onUpload(upload: UploadInfo): Promise<boolean>;
}

export const GatherChat = ({
	aoState,
	onUpdateProfile,
	onUpdatePosition,
	onFollow,
	onUpload,
}: GatherChatProps) => {
	console.log({ aoState });

	const containerRef = useRef<HTMLDivElement>(null);

	const [sidePanelState, setSidePanelState] = useState<SidePanelState>("feed");

	const [selectedToon, setSelectedToon] = useState<
		AoToonMaybeSaved | undefined
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
						aoStateProp={aoState}
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
					activityFeed={<p>AF</p>}
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
									await onFollow({address: toonInfo.id});
									alert("Followed!");
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
								initialUsername={aoState.user.displayName}
								initialSeed={aoState.user.avatarSeed}
							/>
						)
					}
					video={<p>Video</p>}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
