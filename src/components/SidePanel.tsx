import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidePanelState = ["feed", "profile", "video"] as const;
export type SidePanelState = typeof sidePanelState[number];

interface SidePanelProps {
  state: SidePanelState;
  onSelectState: (state: SidePanelState) => void;
  activityFeed: JSX.Element;
  profile: JSX.Element;
  video: JSX.Element;
}

export const SidePanel = ({state, onSelectState, activityFeed, profile, video}: SidePanelProps) => {
  return (
    <Tabs value={state} onValueChange={(value) => onSelectState(value as SidePanelState)} className="w-[400px] h-[100%] flex flex-col">
      <TabsList>
        <TabsTrigger value="feed">Activity Feed</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="video">Video</TabsTrigger>
      </TabsList>
      <div className="flex flex-grow">
        <TabsContent value="feed">{activityFeed}</TabsContent>
        <TabsContent value="profile">{profile}</TabsContent>
        <TabsContent value="video">{video}</TabsContent>
      </div>
    </Tabs>
  )
}
