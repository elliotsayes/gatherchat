import { Slider } from "@/components/ui/slider";

interface OptionSliderProps {
	label: string;
	value: number;
	valueCount: number;
	onChange: (value: number) => void;
}

const OptionSlider = (props: OptionSliderProps) => {
	const { label, valueCount, value: defaultValue, onChange } = props;

	return (
		<div>
			<p>{label}</p>
			<Slider
				min={0}
				max={valueCount - 1}
				value={[defaultValue]}
				onValueChange={(e) => onChange(e[0])}
			/>
		</div>
	);
};

export default OptionSlider;
