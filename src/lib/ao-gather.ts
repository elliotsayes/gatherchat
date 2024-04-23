import { createDataItemSigner } from "@permaweb/aoconnect";
/* @ts-ignore */
import type { Services } from "@permaweb/aoconnect/dist/index.common";
import { ArconnectSigner, type ArweaveSigner } from "arbundles";
import Arweave from "arweave";
import EventEmitter from "eventemitter3";
import { AoProvider } from "./ao";

export const aoGatherProcessId = "nUfdG3fx30W4b0fFWSd9JttPCFP_I1URM--Iri8Y4xo";
export const defaultArweave = Arweave.init({
	host: "arweave.net",
	protocol: "https",
	port: 443,
});

export type ArweaveID = string;
export type ArweavePublicKey = string;
export type ConnectionID = ArweaveID;
export type ArweaveAddress = ArweaveID;

export type ContractUser = {
	processId: ArweaveID; // personal process id of the user for things like notification, mail, etc.
	created: number;
	lastSeen: number;
	name: string;
	avatar: string;
	status: string;
	position: {
		x: number;
		y: number;
	};
	following: {
		[address: string]: boolean;
	};
	// blockList: ArweaveID[]; // disallows connection to specified users and prevent them from messaging/inviting the user to lobbies.
	// preferences: UserSettings;
};

export type ContractPost = {
	created: number;
	author: string;
	type: string;
	textOrTxId: string;
};

// export type ContractState = {
//     users: Record<ArweaveID, User>
//     posts: Record<ArweaveID, Post>;
//     // connections: Record<ArweaveID, EncryptedAoRTCContractConnectionState>;
//     // CreateConnection(params: { Guest: ArweavePublicKey, Offer: string }): Promise<string>
//     // AcceptConnection(params: { Answer: string }): Promise<string>
//     // AddIceCandidate(params: { Candidate: string }): Promise<string>
// }

// Base interfaces for WebRTC functionalities
export type GatherSigner = ArweaveSigner | ArconnectSigner;

// Interface defining the structure for AoGather which includes a signer of type RtcSigner and WebRTC management
export interface AoGather {
	signer: GatherSigner;
	arweave: Arweave;
	getUsers(): Promise<Record<ArweaveID, ContractUser>>;
	getPosts(params: { userId: ArweaveID }): Promise<
		Record<ArweaveID, ContractPost>
	>; // queries contract for all connections associated with a user
	register(params: Partial<ContractUser>): Promise<this>;
	update(params: Partial<ContractUser>): Promise<this>;
	post(params: Partial<ContractPost>): Promise<this>;
	follow(params: {
		address: string;
	}): Promise<this>;
}

export const gatherEventEmitter = new EventEmitter();

// Class AoGatherProvider extends from AoProvider and implements the AoGather interface
export class AoGatherProvider extends AoProvider implements AoGather {
	signer: GatherSigner;
	arweave: Arweave;
	updateInterval: any;

	constructor({
		arweave = defaultArweave,
		processId = aoGatherProcessId,
		signer = new ArconnectSigner(window.arweaveWallet, defaultArweave as any),
		...params
	}: {
		signer?: GatherSigner;
		processId?: string;
		arweave?: Arweave;
		scheduler?: string;
		connectConfig?: Services;
	} = {}) {
		super({
			processId: processId,
			scheduler: params.scheduler,
			connectConfig: params.connectConfig,
		});
		this.signer = signer;
		this.arweave = arweave;
	}

	ensureStarted(): this {
		if (!this.updateInterval) {
			const heartbeat = setInterval(() => this.updateData(), 3000);
			this.updateInterval = heartbeat;
		}

		return this;
	}

	/**
	 * @description - Starts the AoGatherProvider, sets up the heartbeat to update connection states
	 * @returns AoGatherProvider - the instance of the AoGatherProvider
	 *
	 */
	start(): this {
		if (this.updateInterval) {
			throw new Error("Already started");
		}
		const heartbeat = setInterval(() => this.updateData(), 3000);
		this.updateInterval = heartbeat;

		return this;
	}

	/**
	 * @description - Stops the AoGatherProvider, clears the heartbeat
	 * @returns AoGatherProvider - the instance of the AoGatherProvider
	 */
	stop(): this {
		if (!this.updateInterval) {
			throw new Error("Not started");
		}
		clearInterval(this.updateInterval);
		this.updateInterval = undefined;
		return this;
	}

	/**
	 * @description - Updates the connections for all peers associated with the current user, both Host and Guest connections, answers offers
	 * and sends offers to new connections, checks for renegotiation and sends new offers if needed
	 */
	async updateData(): Promise<void> {
		console.log("Updating connection states");
	}

	async getUsers(): Promise<Record<ArweaveID, ContractUser>> {
		const { Messages } = await this.ao.dryrun({
			process: this.processId,
			tags: [{ name: "Action", value: "GetUsers" }],
		});
		return JSON.parse(Messages[0].Data) as Record<ArweaveID, ContractUser>;
	}

	async getPosts({
		userId,
	}: { userId?: ArweaveID } = {}): Promise<Record<ArweaveID, ContractPost>> {
		const { Messages } = await this.ao.dryrun({
			process: this.processId,
			tags: [{ name: "Action", value: "GetPosts" }],
		});
		const posts = JSON.parse(Messages[0].Data) as Record<
			ArweavePublicKey,
			ContractPost
		>;
		// return all posts if no userId or signer is provided
		if (!userId) return posts;
		// return all posts for a specific user if userId is provided
		return Object.fromEntries(
			Object.entries(posts).filter(([_, value]) => value.author === userId),
		);
	}

	async register(user: Partial<ContractUser>): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(user),
			tags: [{ name: "Action", value: "Register" }],
			signer: createDataItemSigner(window.arweaveWallet),
		});
		console.debug(`User registered with id ${registrationId}`);

		return this;
	}

	async update(user: Partial<ContractUser>): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(user),
			tags: [{ name: "Action", value: "Update" }],
			signer: createDataItemSigner(window.arweaveWallet),
		});
		console.debug(`User updated with id ${registrationId}`);

		return this;
	}

	async post(post: Partial<ContractPost>): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(post),
			tags: [{ name: "Action", value: "CreatePost" }],
			signer: createDataItemSigner(window.arweaveWallet),
		});
		console.debug(`Created post with id ${registrationId}`);

		return this;
	}

	async follow(data: { address: string }): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(data),
			tags: [{ name: "Action", value: "Follow" }],
			signer: createDataItemSigner(window.arweaveWallet),
		});
		console.debug(`Followed ${data.address} with id ${registrationId}`);

		return this;
	}
}
