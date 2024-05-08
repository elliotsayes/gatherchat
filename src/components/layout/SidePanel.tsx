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
      className="flex flex-col items-center h-screen"
    >
      <TabsList className="flex w-[100%]">
        <TabsTrigger value="feed">Activity Feed</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        {/* <TabsTrigger value="video">Video</TabsTrigger> */}
      </TabsList>
      <div className="flex">
        <TabsContent value="feed">{activityFeed}</TabsContent>
        <TabsContent value="upload">{upload}</TabsContent>
        <TabsContent value="profile">{profile}</TabsContent>
        {/* <TabsContent value="video">{video}</TabsContent> */}
      </div>
    </Tabs>
  );
};
