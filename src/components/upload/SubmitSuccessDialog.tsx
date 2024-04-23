import { Card, CardContent } from "@/components/ui/card";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
// import { config } from "@/config.ts";
import type { ContentType, UploadResult } from "@/lib/upload";
import { Button } from "../ui/button";
import TextView from "./TextView";
import { VideoPreview } from "./VideoPreview";

interface Props {
	contentType: ContentType;
	mainVideoResult: UploadResult;
	// trailerVideoResult?: UploadResult;
	onAccept: () => void;
}

export const SubmitSuccessDialog = (props: Props) => {
	const { contentType, mainVideoResult, onAccept } = props;

	const renderResult = (
		// title: string,
		result: UploadResult,
		// isAsset?: boolean,
	) => {
		const gatewayUrl = `https://arweave.net/${result.id}`;
		// const mainVideoBazarUrl = `https://bazar.arweave.dev/#/asset/${mainVideoResult.id}`;

		return (
			<Card>
				<CardContent className="relative flex flex-col items-center">
					{contentType === "video" ? (
						<VideoPreview controls={true} url={gatewayUrl} />
					) : contentType === "image" ? (
						<img
							src={gatewayUrl}
							className="aspect-video w-48 sm:w-72"
							alt="Uploaded Asset"
						/>
					) : (
						<TextView url={gatewayUrl} />
					)}
					<p className="text-center">
						{/* {isAsset && (
							<>
								Open asset on{" "}
								<a
									href={mainVideoBazarUrl}
									target="_blank"
									className="underline"
									rel="noreferrer"
								>
									BazAr
								</a>
								<br />
							</>
						)} */}
						Open tx on{" "}
						<a
							href={gatewayUrl}
							target="_blank"
							className="underline"
							rel="noreferrer"
						>
							Arweave Gateway
						</a>{" "}
						or{" "}
						<span
							onClick={() => navigator.clipboard.writeText(result.id)}
							className="underline cursor-pointer"
						>
							copy txId
						</span>
					</p>
				</CardContent>
			</Card>
		);
	};

	return (
		<DialogContent hasCloseButton={false}>
			<DialogHeader>
				<DialogTitle className="text-xl">Successfully Uploaded!</DialogTitle>
				{/* <DialogDescription>
          Yay :)
        </DialogDescription> */}
			</DialogHeader>
			<div className="flex flex-col gap-4">{renderResult(mainVideoResult)}</div>
			<Button onClick={() => onAccept()}>Done</Button>
		</DialogContent>
	);
};
