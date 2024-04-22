import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { config } from "@/config.ts";
import type { UploadResult } from "@/lib/upload";
import { VideoPreview } from "./VideoPreview";

interface Props {
	mainVideoResult: UploadResult;
	trailerVideoResult?: UploadResult;
}

const isArseeding = config.uploader === "arseeding";

export const SubmitSuccessDialog = (props: Props) => {
	const { mainVideoResult, trailerVideoResult } = props;

	const renderResult = (
		title: string,
		result: UploadResult,
		isAsset?: boolean,
	) => {
		const gatewayUrl = isArseeding
			? `${config.arseedingUrl}/${result.id}`
			: `https://arweave.net/${result.id}`;
		const mainVideoBazarUrl = `https://bazar.arweave.dev/#/asset/${mainVideoResult.id}`;

		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">{title}</CardTitle>
					{/* <CardDescription>{subtitle}</CardDescription> */}
				</CardHeader>
				<CardContent className="relative flex flex-col items-center">
					<VideoPreview controls={true} url={gatewayUrl} />
					<p className="text-center">
						{isAsset && (
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
						)}
						Open tx on{" "}
						<a
							href={gatewayUrl}
							target="_blank"
							className="underline"
							rel="noreferrer"
						>
							{isArseeding ? "Arseeding Gateway" : "Arweave Gateway"}
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
			<div className="flex flex-col gap-4">
				{renderResult("Main Video", mainVideoResult, true)}
				{trailerVideoResult &&
					renderResult("Trailer Video", trailerVideoResult)}
			</div>
		</DialogContent>
	);
};
