import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sidePanelState = ["feed", "profile", "video"] as const;
export type SidePanelState = (typeof sidePanelState)[number];

interface SidePanelProps {
	state: SidePanelState;
	onSelectState: (state: SidePanelState) => void;
	activityFeed: JSX.Element;
	upload: JSX.Element;
	profile: JSX.Element;
	// video: JSX.Element;
}

export const SidePanel = ({
	state,
	onSelectState,
	activityFeed,
	upload,
	profile,
	// video,
}: SidePanelProps) => {
	return (
		<Tabs
			value={state}
			onValueChange={(value) => onSelectState(value as SidePanelState)}
			className="h-[100%] flex flex-col"
		>
			<TabsList className="w-[100%]">
				<TabsTrigger value="feed">Activity Feed</TabsTrigger>
				<TabsTrigger value="upload">Upload</TabsTrigger>
				<TabsTrigger value="profile">Profile</TabsTrigger>
				{/* <TabsTrigger value="video">Video</TabsTrigger> */}
			</TabsList>
			<div className="flex flex-col flex-grow justify-stretch items-center bg-gray-50/50">
				<div className="px-4 pt-2 bg-gray-50 h-[100%]">
					<TabsContent value="feed" className="h-[100%]">
						{activityFeed}
					</TabsContent>
					<TabsContent value="upload">{upload}</TabsContent>
					<TabsContent value="profile">{profile}</TabsContent>
					{/* <TabsContent value="video">{video}</TabsContent> */}
				</div>
				<div />
			</div>
		</Tabs>
	);
};
