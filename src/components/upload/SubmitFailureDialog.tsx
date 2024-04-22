import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Props {
	error?: Error;
	onAccept: () => void;
}

export const SubmitFailureDialog = (props: Props) => {
	const { error, onAccept } = props;

	return (
		<DialogContent className="sm:max-w-[425px]" hasCloseButton={false}>
			<DialogHeader>
				<DialogTitle className="text-xl">Error with Upload!</DialogTitle>
			</DialogHeader>
			{error !== undefined ? (
				<>
					<span className="text-xl">Error information:</span>
					<div className="max-h-[12rem] overflow-auto">
						<pre className="text-sm">
							{error.message ?? JSON.stringify(error, null, 2)}
						</pre>
					</div>
				</>
			) : (
				<span className="text-xl">No error information available.</span>
			)}
			<Button onClick={() => onAccept()}>Close</Button>
		</DialogContent>
	);
};
