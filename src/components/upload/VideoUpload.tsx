import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { filesize } from "filesize";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { VideoPreview } from "./VideoPreview";

interface Props {
	title: string;
	subtitle?: string;
	file?: File;
	onFile: (file: File) => void;
	onClear: () => void;
	disabled?: boolean;
}

export const VideoUpload = (props: Props) => {
	const { title, subtitle, file, onFile, onClear, disabled } = {
		disabled: false,
		...props,
	};
	const hasFile = file !== undefined;

	const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		const objectUrl = file ? URL.createObjectURL(file) : undefined;
		setPreviewUrl(objectUrl);
		return () => {
			objectUrl && URL.revokeObjectURL(objectUrl);
		};
	}, [file]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length === 1) {
				onFile(acceptedFiles[0]);
			} else {
				onClear();
			}
		},
		[onFile, onClear],
	);

	const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
		disabled,
		onDrop,
		noClick: true,
		accept: {
			"video/*": [
				".avi",
				".mp4",
				".mpeg",
				".ogv",
				".ts",
				".webm",
				".3gp",
				".mov",
				".mkv",
			],
		},
		maxFiles: 1,
		maxSize: 1024 * 1024 * 1024, // 1GB
	});

	return (
		<Card {...getRootProps()} className="flex-grow">
			<input {...getInputProps()} />
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{subtitle && <CardDescription>{subtitle}</CardDescription>}
			</CardHeader>
			<CardContent className="relative flex flex-col items-center">
				<div className="absolute w-48 sm:w-72 z-20">
					{!disabled &&
						(hasFile && !isDragActive ? (
							<div className="text-center bg-primary-foreground/60 rounded-lg max-w-[80%] px-1 py-2 mx-auto my-6 sm:my-12">
								<span className="line-clamp-1 text-ellipsis">
									Name: <span>{file.name}</span>
								</span>
								<span className="line-clamp-1 text-ellipsis">
									Size:{" "}
									<span>{filesize(file.size, { standard: "jedec" })}</span>
								</span>
							</div>
						) : (
							<div className="text-center text-[#C9CDCF]/90 font-semibold bg-gradient-radial from-primary/20 via-primary/5 to-transparent px-2 sm:px-4 py-[2.6rem] sm:py-[4.25rem]">
								{isDragActive ? (
									<p>Drop video here!</p>
								) : (
									<p>Drag & drop video file</p>
								)}
							</div>
						))}
				</div>
				<VideoPreview url={previewUrl} darken={isDragActive && !disabled} />
				<div className="h-12 pt-2">
					{!disabled &&
						(hasFile ? (
							<Button variant={"destructive"} size={"sm"} onClick={onClear}>
								Clear
							</Button>
						) : (
							<Button variant={"secondary"} size={"sm"} onClick={open}>
								Select File
							</Button>
						))}
				</div>
			</CardContent>
			{/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
		</Card>
	);
};
