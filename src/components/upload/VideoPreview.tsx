import { useCallback, useState } from "react";

interface Props {
	url?: string;
	controls?: boolean;
	darken?: boolean;
}

export const VideoPreview = (props: Props) => {
	const { url, controls, darken } = {
		controls: false,
		darken: false,
		...props,
	};

	const [videoKey, setVideoKey] = useState("");
	const delayResetVideo = useCallback(() => {
		if (url === undefined) return;
		setTimeout(() => setVideoKey(Date.now().toString()), 1000);
	}, [url]);

	return (
		<div className="relative aspect-video w-48 sm:w-72 rounded-md overflow-hidden">
			{url ? (
				<video
					key={videoKey}
					src={url}
					className={`absolute w-full h-full aspect-video object-cover ${
						controls !== true ? "opacity-60 blur-[1px]" : ""
					}`}
					muted
					controls={controls}
					autoPlay={controls}
					onError={delayResetVideo}
				/>
			) : (
				<div className="absolute w-full h-full aspect-video opacity-40 bg-primary" />
			)}
			{!controls && (
				<div
					className={`absolute w-full h-full bg-gradient-to-b from-gray-800/50 to-gray-800 mix-blend-overlay ${
						darken ? "" : "opacity-20"
					}`}
				/>
			)}
		</div>
	);
};
