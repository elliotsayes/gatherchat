import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidePanelState = ["feed", "profile", "video"] as const;
export type SidePanelState = typeof sidePanelState[number];

interface SidePanelProps {
  state: SidePanelState;
  onSelectState: (state: SidePanelState) => void;
}

export const SidePanel = ({state, onSelectState}: SidePanelProps) => {
  return (
    <Tabs value={state} onValueChange={(value) => onSelectState(value as SidePanelState)} className="w-[400px]">
      <TabsList>
        <TabsTrigger value="feed">Activity Feed</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="video">Video</TabsTrigger>
      </TabsList>
      <TabsContent value="feed">Activity Feed</TabsContent>
      <TabsContent value="profile">Profile</TabsContent>
      <TabsContent value="video">Video</TabsContent>
    </Tabs>
  )
}
