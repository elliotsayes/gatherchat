import { config } from "@/config";
import { getArnsRootTransaction } from "./arns";
import { formatTagHuman, stripExtension } from "./utils";

export const getTitle = (file: File) => stripExtension(file.name);

export const fileTags = (file: File) => ({
	"Content-Type": file.type,
	"File-Name": file.name,
});

export type ContentType = "text" | "image" | "video";
export const discoverabilityTags = (type: ContentType, title: string) => ({
	Type: type,
	Title: title,
	Description: `Uploaded with Gather Chat via ${formatTagHuman(
		config.uploader,
	)}`,
});

export const rendererTags = async (): Promise<Record<string, string>> => {
	let rendererTxId = config.defaultRendererTxId!;
	const rendererArns = config.rendererArns;
	try {
		rendererTxId = await getArnsRootTransaction(rendererArns);
	} catch (e) {
		console.error(`Error getting ArNS for ${rendererArns}`, e);
	}
	return {
		"Render-With": rendererTxId,
		"Render-With-ArNS": rendererArns,
	};
};

export type UploadResult = {
	id: string;
};

export type UploadVideosResult = {
	contentType: ContentType;
	mainVideoResult: UploadResult;
	// trailerVideoResult?: UploadResult;
};
