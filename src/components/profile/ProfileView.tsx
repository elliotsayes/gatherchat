import type { AoToonMaybeSaved, AoToonSaved } from "@/lib/schema/gameModel";
import { Button } from "../ui/button";
import { AvatarStandalone } from "./AvatarStandalone";

interface ProfileViewProps {
	toonInfo: AoToonSaved;
	onChangeFollow: (toonInfo: AoToonMaybeSaved) => void;
	onCall: (toonInfo: AoToonMaybeSaved) => void;
	onClose: () => void;
}

export const ProfileView = ({
	toonInfo,
	onChangeFollow,
	onCall,
	onClose,
}: ProfileViewProps) => {
	return (
		<div className="space-y-4">
			<div className="flex flex-row gap-2 items-start justify-between">
				<div>
					<p className="text-lg">{toonInfo.displayName}</p>
					<p className="text-muted-foreground">{toonInfo.id}</p>
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
			<p>Last activity: TODO</p>
			<div className="flex flex-col gap-2 items-center">
				<div className="flex flex-row gap-2 items-center">
					<Button
						type="button"
						onClick={() => onChangeFollow(toonInfo)}
						variant={toonInfo.isFollowing ? "ghost" : "default"}
						disabled={toonInfo.isFollowing}
					>
						{toonInfo.isFollowing ? "Already following" : "Follow"}
					</Button>
					{/* <Button type="button" onClick={() => onCall(toonInfo)}>
						Call
					</Button> */}
				</div>
			</div>
		</div>
	);
};
