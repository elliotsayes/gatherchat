import type { AoToonMaybeSaved } from "@/lib/schema/gameModel"
import { AvatarStandalone } from "./AvatarStandalone";
import { Button } from "./ui/button";
 
interface ProfileViewProps {
  toonInfo: AoToonMaybeSaved;
  onCall: (toonInfo: AoToonMaybeSaved) => void;
  onClose: () => void;
}

export const ProfileView = ({toonInfo, onCall, onClose}: ProfileViewProps) => {
  return (
    <div>
      
      <p>{toonInfo.id}</p>
      <p>{toonInfo.displayName}</p>
      <AvatarStandalone scale={12} seed={toonInfo.avatarSeed} animationName={"jump"} isPlaying={true}  />
      <p>last online: TODO</p>
      <Button type="button" onClick={() => onClose()} variant={"outline"}>Close</Button>
      <Button type="button" onClick={() => onCall(toonInfo)}>Call</Button>
    </div>
  )
}
