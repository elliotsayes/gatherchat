import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
// import { config } from "@/config";
import { uploadPageMachine } from "@/lib/machines/upload_page";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { SubmitFailureDialog } from "./SubmitFailureDialog";
import { SubmitSuccessDialog } from "./SubmitSuccessDialog";
import { SubmittingDialog } from "./SubmittingDialog";
import { UdlForm } from "./UdlForm";
import { UdlTable } from "./UdlTable";
import { VideoUpload } from "./VideoUpload";

interface UploadPageProps {
	onDone?: () => void;
}

export const UploadPage = ({ onDone }: UploadPageProps) => {
	const [current, send] = useMachine(uploadPageMachine);

	const canSumbit = current.can({
		type: "confirm symbol",
		data: { symbol: "AR" },
	});

	const [isUdlSheetOpen, setIsUdlSheetOpen] = useState(false);
	const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

	return (
		<div>
			<Card className="mx-auto max-w-md lg:max-w-3xl text-left">
				<CardHeader>
					<CardTitle>Upload Media Content</CardTitle>
					{/* <CardDescription>Card Description</CardDescription> */}
				</CardHeader>
				<CardContent className="flex flex-col gap-4 items-stretch">
					<div className="flex flex-col lg:flex-row gap-4 lg:justify-stretch">
						<VideoUpload
							title={"Image/Video"}
							subtitle={"Select your media"}
							file={current.context.mainVideo}
							onFile={(mainVideo) =>
								send({ type: "main video set", data: { mainVideo } })
							}
							onClear={() => send({ type: "main video cleared" })}
							disabled={!current.matches("configuring")}
						/>
						{/* <VideoUpload
							title={"Trailer"}
							subtitle={"Select trailer video (optional)"}
							file={current.context.trailerVideo}
							onFile={(trailerVideo) =>
								send({ type: "trailer video set", data: { trailerVideo } })
							}
							onClear={() => send({ type: "trailer video cleared" })}
							disabled={!current.matches("configuring")}
						/> */}
					</div>
					<Card className="w-full">
						<CardHeader>
							<CardTitle>UDL Config</CardTitle>
							<CardDescription>
								Configure{" "}
								<a
									href="https://wiki.arweave.dev/#/en/Universal-Data-License-How-to-use-it"
									target="_blank"
									className="underline"
									rel="noreferrer"
								>
									Universal Data License
								</a>
							</CardDescription>
						</CardHeader>
						<CardContent className="relative flex flex-col items-center">
							{current.matches({ configuring: { udlConfig: "hasConfig" } }) && (
								<UdlTable tags={current.context.udlTags ?? {}} />
							)}
							<div className="pt-4 flex flex-row gap-4">
								<Button
									variant={"secondary"}
									onClick={() => setIsUdlSheetOpen(true)}
									disabled={!current.matches("configuring")}
								>
									{current.matches({ configuring: { udlConfig: "hasConfig" } })
										? "Modify UDL"
										: "Add UDL"}
								</Button>
								{current.matches({
									configuring: { udlConfig: "hasConfig" },
								}) && (
									<Button
										variant={"destructive"}
										onClick={() => send({ type: "udl config cleared" })}
									>
										Clear UDL
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
					<div className="mx-auto pt-6">
						<TooltipProvider>
							<Tooltip delayDuration={canSumbit ? 500 : 200}>
								<TooltipTrigger
									disabled={!canSumbit}
									className={`${canSumbit ? "" : " cursor-not-allowed"}`}
								>
									<Button
										size={"lg"}
										onClick={() =>
											send({ type: "confirm symbol", data: { symbol: "AR" } })
										}
										className={`${
											canSumbit &&
											current.matches({
												configuring: { udlConfig: "hasConfig" },
											})
												? "animate-pulse"
												: ""
										}`}
										disabled={!canSumbit}
									>
										Upload With Bundlr
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{canSumbit ? "Click to Upload!" : "Requires Main Video"}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardContent>
			</Card>
			<Sheet
				open={isUdlSheetOpen}
				onOpenChange={setIsUdlSheetOpen}
				modal={true}
			>
				<SheetContent side="bottom" className="max-w-full">
					<SheetHeader className="max-w-screen-sm mx-auto">
						<SheetTitle className="min-w-full ">
							<div className="text-left">UDL Configuration</div>
							{/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
						</SheetTitle>
					</SheetHeader>
					<ScrollArea className="h-[60vh] w-full pr-4 overflow-y-auto">
						<div className="mx-auto max-w-screen-sm">
							<UdlForm
								initialValues={current.context.udlConfig ?? {}}
								onSubmit={(udlConfig) => {
									send({ type: "udl config set", data: { udlConfig } });
									setIsUdlSheetOpen(false);
								}}
							/>
						</div>
					</ScrollArea>
				</SheetContent>
			</Sheet>
			<Dialog
				open={
					isSubmitDialogOpen ||
					current.matches("submitting") ||
					current.matches("upload success") ||
					current.matches("upload failure")
				}
				onOpenChange={setIsSubmitDialogOpen}
				modal={true}
			>
				{current.matches("submitting") && (
					<SubmittingDialog submitLog={current.context.submitLog} />
				)}
				{current.matches("upload success") && (
					<SubmitSuccessDialog
						contentType={current.context.contentType!}
						mainVideoResult={current.context.mainVideoResult!}
						onAccept={() => onDone?.()}
					/>
				)}
				{current.matches("upload failure") && (
					<SubmitFailureDialog
						error={current.context.uploadError as Error}
						onAccept={() => onDone?.()}
					/>
				)}
			</Dialog>
		</div>
	);
};
