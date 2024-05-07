import type { AoToonSaved } from "@/features/_old/lib/model";
import { timeAgo } from "@/utils";
import { trimId } from "@/utils";
import { Button } from "../../../components/ui/button";
import { AvatarStandalone } from "../../avatar/components/AvatarStandalone";

interface ProfileViewProps {
	toonInfo: AoToonSaved;
	onChangeFollow: (toonInfo: AoToonSaved) => void;
	onCall: (toonInfo: AoToonSaved) => void;
	onClose: () => void;
}

export const ProfileView = ({
	toonInfo,
	onChangeFollow,
	// onCall,
	onClose,
}: ProfileViewProps) => {
	return (
		<div className="space-y-4">
			<div className="flex flex-row gap-2 items-start justify-between">
				<div>
					<p className="text-lg">{toonInfo.displayName}</p>
					<p className="text-muted-foreground">{trimId(toonInfo.id)}</p>
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
				seed={toonInfo.avatarSeed}
				animationName={"jump"}
				isPlaying={true}
			/>
			<p>Last activity: {timeAgo.format(toonInfo.lastSeen)}</p>
			<div className="flex flex-col gap-2 items-center">
				<div className="flex flex-row gap-2 items-center">
					<Button
						type="button"
						onClick={() => onChangeFollow(toonInfo)}
						variant={toonInfo.isFollowing ? "destructive" : "default"}
					>
						{toonInfo.isFollowing ? "Unfollow" : "Follow"}
					</Button>
					{/* <Button type="button" onClick={() => onCall(toonInfo)}>
						Call
					</Button> */}
				</div>
			</div>
		</div>
	);
};
