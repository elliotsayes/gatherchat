import { AvatarStandalone } from "./AvatarStandalone";
import OptionSlider from "./OptionSlider";
import { useCallback, useMemo, useState } from "react";
import { deserialize } from "../sprite/generate";
import { serialize } from "../sprite/edit";
import { SHAPE_OPTIONS, colorCategories, colorThemes } from "../sprite/shared";
import { Button } from "@/components/ui/button";

interface CharacterCreatorProps {
	initialSeed?: string;
	onSeedChange?: (seed: string) => void;
}

const colorMaxs = colorCategories.map(
	(category) =>
		colorThemes.find((theme) => theme.key === category)!.options.length,
);

export const CharacterCreator = ({
	initialSeed,
	onSeedChange,
}: CharacterCreatorProps) => {
	const initialValues = useMemo(() => {
		if (initialSeed) return deserialize(initialSeed);
		return Array(SHAPE_OPTIONS.length + colorCategories.length).fill(0);
	}, [initialSeed]);

	const [faceIndex, setFaceIndex] = useState(initialValues[0]);
	const [headIndex, setHeadIndex] = useState(initialValues[1]);

	const [colorIndicies, setColorIndicies] = useState(initialValues.slice(2));

	const currentSeed = useMemo(() => {
		const seed = serialize([faceIndex, headIndex, ...colorIndicies]);
		onSeedChange?.(seed);
		return seed;
	}, [faceIndex, headIndex, colorIndicies, onSeedChange]);

	const randomize = useCallback(() => {
		setFaceIndex(Math.floor(Math.random() * SHAPE_OPTIONS[0].max));
		setHeadIndex(Math.floor(Math.random() * SHAPE_OPTIONS[1].max));
		setColorIndicies(colorMaxs.map((max) => Math.floor(Math.random() * max)));
	}, [setFaceIndex, setHeadIndex, setColorIndicies]);

	return (
		<div>
			<AvatarStandalone
				scale={10}
				seed={currentSeed}
				animationName={"idle"}
				isPlaying={true}
			/>
			<div>
				<Button onClick={randomize}>Randomize</Button>
				<div>
					<OptionSlider
						label={"Face"}
						valueCount={SHAPE_OPTIONS[0].max}
						value={faceIndex}
						onChange={setFaceIndex}
					/>
					<OptionSlider
						label={"Head"}
						valueCount={SHAPE_OPTIONS[1].max}
						value={headIndex}
						onChange={setHeadIndex}
					/>
				</div>
				<div>
					{colorCategories.map((category, index) => (
						<OptionSlider
							key={category}
							label={category}
							valueCount={colorMaxs[index]}
							value={colorIndicies[index]}
							onChange={(value) => {
								const newColorIndicies = [...colorIndicies];
								newColorIndicies[index] = value;
								setColorIndicies(newColorIndicies);
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
