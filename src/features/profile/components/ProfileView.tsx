import type { RenderOtherPlayer } from "@/features/render/components/RenderEngine";
import { timeAgo } from "@/utils";
import { trimId } from "@/utils";
import { Button } from "../../../components/ui/button";
import { AvatarStandalone } from "../../avatar/components/AvatarStandalone";

interface ProfileViewProps {
  otherPlayer: RenderOtherPlayer;
  onChangeFollow: (otherPlayer: RenderOtherPlayer) => void;
  onWarpToWorld: (worldId: string) => void;
  onClose: () => void;
}

export const ProfileView = ({
  otherPlayer,
  onChangeFollow,
  onWarpToWorld,
  onClose,
}: ProfileViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-2 items-start justify-between">
        <div>
          <p className="text-lg">{otherPlayer.profile.name}</p>
          <p className="text-muted-foreground">{trimId(otherPlayer.id)}</p>
        </div>
        <Button
          type="button"
          onClick={() => onClose()}
          variant={"ghost"}
          className=" text-accent-foreground"
        >
          Close
        </Button>
      </div>
      <AvatarStandalone
        scale={12}
        seed={otherPlayer.profile.avatar}
        animationName={"jump"}
        isPlaying={true}
      />
      <p>In World: {otherPlayer.profile.currentWorldId}</p>
      <p>Last activity: {timeAgo.format(otherPlayer.profile.lastSeen)}</p>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-row gap-2 items-center">
          <Button
            type="button"
            onClick={() => onChangeFollow(otherPlayer)}
            variant={otherPlayer.isFollowedByUser ? "destructive" : "default"}
          >
            {otherPlayer.isFollowedByUser ? "Unfollow" : "Follow"}
          </Button>
          <Button
            type="button"
            onClick={() => onWarpToWorld(otherPlayer.id)}
            disabled={!otherPlayer.profile.hasUserWorld}
          >
            {otherPlayer.profile.hasUserWorld ? "Go to world" : "No world yet"}
          </Button>
        </div>
      </div>
    </div>
  );
};
