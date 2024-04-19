import { AvatarStandalone } from "./AvatarStandalone";

export const CharacterCreator = () => {
	return (
		<div>
			<AvatarStandalone
				scale={10}
				seed={"a09010903080a02"}
				animationName={"idle"}
				isPlaying={true}
			/>
		</div>
	);
};
