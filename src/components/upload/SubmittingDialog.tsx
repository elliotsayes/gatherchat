import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { config } from "@/config";

const isArseeding = config.uploader === "arseeding";

interface Props {
	submitLog: string;
}

export const SubmittingDialog = (props: Props) => {
	const { submitLog } = props;

	return (
		<DialogContent className="sm:max-w-[425px]" hasCloseButton={false}>
			<DialogHeader>
				<DialogTitle>
					Uploading with {isArseeding ? "Everpay" : "Bundlr"}
				</DialogTitle>
				<DialogDescription>
					Please wait while your data is uploading...
				</DialogDescription>
			</DialogHeader>
			<div className="max-h-[12rem] overflow-auto">
				<pre className="text-sm">{submitLog}</pre>
			</div>
		</DialogContent>
	);
};
