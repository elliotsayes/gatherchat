import { config } from "@/config";
import { WebIrys } from "@irys/sdk";
import { BigNumber } from "bignumber.js";
import { ucmTags } from "./ucm";
import {
	type UploadResult,
	type UploadVideosResult,
	discoverabilityTags,
	fileTags,
	getTitle,
	rendererTags,
} from "./upload";
import { ensureRegistered } from "./warp";

// Function to get upload fee
export const getUploadFee = async (fileSize: number, token: string) => {
	if (fileSize < 10 * 1024) return BigNumber(0);

	const bundlr = new WebIrys({
		network: "mainnet",
		token,
	});
	const fee = await bundlr.getPrice(fileSize);
	return fee;
};

// Function to connect to bundlr instance
const connectInstance = async (token: string) => {
	const injectedArweave = window.arweaveWallet;
	await injectedArweave.connect([
		"ACCESS_PUBLIC_KEY",
		"SIGNATURE",
		"SIGN_TRANSACTION",
	]);
	const bundlr = new WebIrys({
		network: "mainnet",
		token,
		wallet: {
			provider: injectedArweave,
		},
	});
	await bundlr.ready();
	return {
		instance: bundlr,
		address: bundlr.address!,
	};
};

// Function to get upload fee
const getBalance = async (instance: WebIrys) => {
	return instance.getLoadedBalance();
};

// Function to upload file to bundlr
const uploadFile = async (
	instance: WebIrys,
	file: File,
	tags: Record<string, string>,
): Promise<UploadResult> => {
	const fileArrayBuffer = await file.arrayBuffer();
	const fileBuffer = Buffer.from(fileArrayBuffer);

	const options = {
		tags: Object.entries(tags).map(([name, value]) => ({
			name,
			value,
		})),
	};

	const uploadResult = await instance.upload(fileBuffer, {
		...options,
	});

	return {
		id: uploadResult.id,
	};
};

export const uploadVideosToBundlr = async (
	mainVideo: File,
	token: string,
	udlTags?: Record<string, string>,
	trailerVideo?: File,
	log?: (message: string) => void,
): Promise<UploadVideosResult> => {
	log?.("Connecting to Arweave Wallet...");
	const { instance, address } = await connectInstance(token);
	log?.(`Connected to Arweave Wallet: ${address}`);

	log?.("Checking fee...");
	const fee = await getUploadFee(
		mainVideo.size + (trailerVideo?.size ?? 0),
		token,
	);
	log?.(`Fee: ${fee.toString()} winston`);

	if (fee.gt(0)) {
		log?.("Checking balance...");
		let balance = await getBalance(instance);
		log?.(`Initial Balance: ${balance.toString()} winston`);

		if (balance.lt(fee)) {
			const fundAmount = fee.minus(balance);
			log?.(`Funding ${fundAmount.toString()} winston...`);
			await instance.fund(fundAmount);
			log?.("Funded!");
		}

		let waitTimeMs = 1 * 60 * 1000;
		while (balance.lt(fee)) {
			log?.(
				`Waiting for fund to go through, sleeping for ${waitTimeMs / 1000}s...`,
			);
			await new Promise((resolve) => setTimeout(resolve, waitTimeMs));

			log?.("Checking balance...");
			balance = await getBalance(instance);
			log?.(`Balance: ${balance.toString()} winston`);

			waitTimeMs = Math.min(waitTimeMs * 2, 10 * 60 * 1000);
		}
	}

	let trailerVideoResult: UploadResult | undefined;
	if (trailerVideo !== undefined) {
		log?.("Uploading trailer video...");
		const trailerVideoTitle = getTitle(trailerVideo);
		const trailerVideoTags = {
			...fileTags(trailerVideo),
			...discoverabilityTags(trailerVideoTitle),
		};
		trailerVideoResult = await uploadFile(
			instance,
			trailerVideo,
			trailerVideoTags,
		);
	}

	log?.("Getting latest renderer...");
	const latestRendererTags = await rendererTags();

	log?.("Uploading main video...");
	const mainVideoTitle = getTitle(mainVideo);
	const mainVideoTags = {
		...fileTags(mainVideo),
		...discoverabilityTags(mainVideoTitle),
		...(udlTags !== undefined
			? {
					...udlTags,
					...ucmTags(address, mainVideo.type, mainVideoTitle),
				}
			: {}),
		...latestRendererTags,
		...(trailerVideoResult !== undefined
			? { Trailer: trailerVideoResult.id }
			: {}),
	};
	const mainVideoResult = await uploadFile(instance, mainVideo, mainVideoTags);

	log?.("Registering atomic asset with Warp...");
	const result = await ensureRegistered(mainVideoResult.id, config.bundlrNode);
	log?.(`Registered with Warp: ${JSON.stringify(await result.json())}`);

	try {
		log?.("Checking remaining balance...");
		const remainingBalance = await getBalance(instance);
		log?.(`Balance: ${remainingBalance.toString()} winston`);

		if (remainingBalance.gt(0)) {
			log?.("Withdrawing balance...");
			await instance.withdrawBalance(remainingBalance);
		} else {
			log?.("No balance to withdraw.");
		}
	} catch (e) {
		console.error(e);
		log?.("Problem withdrawing balance, skipping.");
	}

	log?.("Done!");

	return {
		mainVideoResult,
		trailerVideoResult,
	};
};
