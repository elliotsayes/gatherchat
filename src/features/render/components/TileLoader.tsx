import { Assets } from "pixi.js";
import { useEffect, useState } from "react";

interface Props {
	children: React.ReactNode;
	alias: string;
	src: string;
}

export const TileLoader = ({ children, alias, src }: Props) => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		async function loadAssets() {
			const notLoaded = Assets.get(alias) === undefined;
			if (notLoaded) {
				Assets.add({ alias, src });
				await Assets.load([alias]);
			}
			setLoaded(true);
		}
		loadAssets();
	}, [alias, src]);

	if (!loaded) {
		return null;
	}

	return <>{children}</>;
};
