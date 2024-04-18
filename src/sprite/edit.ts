import { SHAPE_OPTIONS, colorCategories, colorThemes, pad2 } from "./shared";

export function randomSeed() {
  return serialize(randomValues());
}

export function serialize(values: number[]) {
	const e = "a";
	return (
		e +
		values
			.map(function (v) {
				return pad2(v);
			})
			.join("")
	);
}

function randomValues() {
	const faceIndex = SHAPE_OPTIONS.find((e) => e.key === "face")!.max;
  const headIndex = SHAPE_OPTIONS.find((e) => e.key === "head")!.max;

  const colorIndexes = colorCategories.map((e) => colorThemes.find((f) => f.key === e)!.options.length);

  return [
    faceIndex,
    headIndex,
   ...colorIndexes,
  ].map((e) => Math.floor(Math.random() * e));
}
