import { createDataItemSigner } from "@permaweb/aoconnect";
/* @ts-ignore */
import type { Services } from "@permaweb/aoconnect/dist/index.common";
import { type Signer, ArconnectSigner } from "arbundles";
import type Arweave from "arweave";
import EventEmitter from "eventemitter3";
import { AoProvider } from "./ao";
import { defaultArweave } from "./arweave";

export const aoGatherProcessId = "_dxDnCZ5sEtaxMJCyA6GZth5CBC_CPU3qvedOsKq5uM";

export type ArweaveID = string;
export type ArweavePublicKey = string;
export type ConnectionID = ArweaveID;
export type ArweaveAddress = ArweaveID;

export type ContractPosition = {
	x: number;
	y: number;
};

export type ContractUser = {
	processId: ArweaveID; // personal process id of the user for things like notification, mail, etc.
	created: number;
	lastSeen: number;
	name: string;
	avatar: string;
	status: string;
	currentRoom: string;
	following: {
		[address: string]: boolean;
	};
	// blockList: ArweaveID[]; // disallows connection to specified users and prevent them from messaging/inviting the user to lobbies.
	// preferences: UserSettings;
};

export type ContractUserWritable = Omit<
	ContractUser,
	"processId" | "created" | "lastSeen"
>;

export type ContractRoom = {
	created: number;
	lastActivity: number;
	name: string;
	description: string;
	theme: string;
	spawnPosition: ContractPosition;
	playerPositions: Record<ArweaveID, ContractPosition>;
};

export type RoomIndex = Array<ContractRoom>;

export type ContractPost = {
	created: number;
	author: string;
	room: string;
	type: string;
	textOrTxId: string;
};

export type ContractPostWritable = Omit<ContractPost, "created" | "author">;

export interface AoGather {
	signer: Signer;
	arweave: Arweave;
	getUsers(): Promise<Record<ArweaveID, ContractUser>>;
	getRoomIndex(): Promise<RoomIndex>;
	getRoom(params?: { roomId: string }): Promise<
		Record<ArweaveID, ContractRoom>
	>;
	getPosts(params?: { roomId: string }): Promise<
		Record<ArweaveID, ContractPost>
	>; // queries contract for all connections associated with a user
	register(params: ContractUserWritable): Promise<this>;
	updateUser(params: Partial<ContractUserWritable>): Promise<this>;
	updatePosition(params: {
		roomId: string;
		position: ContractPosition;
	}): Promise<this>;
	post(params: ContractPostWritable): Promise<this>;
	follow(params: { address: string }): Promise<this>;
	unfollow(params: { address: string }): Promise<this>;
}

export const gatherEventEmitter = new EventEmitter();

// Class AoGatherProvider extends from AoProvider and implements the AoGather interface
export class AoGatherProvider extends AoProvider implements AoGather {
	signer: Signer;
	arweave: Arweave;
	updateInterval?: NodeJS.Timeout;

	constructor({
		arweave = defaultArweave,
		processId = aoGatherProcessId,
		signer = new ArconnectSigner(
			window.arweaveWallet,
			defaultArweave as unknown as any,
		),
		...params
	}: {
		signer?: Signer;
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

	async updateData(): Promise<void> {
		console.log("TODO: Periodic update");
	}

	async getUsers(): Promise<Record<ArweaveID, ContractUser>> {
		const { Messages } = await this.ao.dryrun({
			process: this.processId,
			tags: [{ name: "Action", value: "GetUsers" }],
		});
		return JSON.parse(Messages[0].Data) as Record<ArweaveID, ContractUser>;
	}

	async getRoomIndex(): Promise<RoomIndex> {
		const { Messages } = await this.ao.dryrun({
			process: this.processId,
			tags: [{ name: "Action", value: "GetRoomIndex" }],
		});
		return JSON.parse(Messages[0].Data) as RoomIndex;
	}

	async getRoom(params?: { roomId: string }): Promise<
		Record<string, ContractRoom>
	> {
		const { Messages } = await this.ao.dryrun({
			process: this.processId,
			tags: [{ name: "Action", value: "GetRoom" }],
			data: params !== undefined ? JSON.stringify(params) : undefined,
		});
		return JSON.parse(Messages[0].Data) as Record<ArweaveID, ContractRoom>;
	}

	async getPosts({
		roomId,
	}: { roomId?: string } = {}): Promise<Record<ArweaveID, ContractPost>> {
		const { Messages } = await this.ao.dryrun({
			process: this.processId,
			tags: [{ name: "Action", value: "GetPosts" }],
		});
		const posts = JSON.parse(Messages[0].Data) as Record<
			ArweavePublicKey,
			ContractPost
		>;
		// return all posts if no userId or signer is provided
		if (!roomId) return posts;
		// return all posts for a specific user if userId is provided
		return Object.fromEntries(
			Object.entries(posts).filter(([_, value]) => value.room === roomId),
		);
	}

	async register(userNew: ContractUserWritable): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(userNew),
			tags: [{ name: "Action", value: "Register" }],
			signer: createDataItemSigner(this.signer),
		});
		console.debug(`User registered with id ${registrationId}`);

		return this;
	}

	async updateUser(userUpdate: Partial<ContractUserWritable>): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(userUpdate),
			tags: [{ name: "Action", value: "UpdateUser" }],
			signer: createDataItemSigner(this.signer),
		});
		console.debug(`User updated with id ${registrationId}`);

		return this;
	}

	async updatePosition({
		roomId,
		position,
	}: { roomId: string; position: ContractPosition }): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify({ roomId, position }),
			tags: [{ name: "Action", value: "UpdatePosition" }],
			signer: createDataItemSigner(this.signer),
		});
		console.debug(
			`User position in ${roomId} to ${JSON.stringify(
				position,
			)} with id ${registrationId}`,
		);
		return this;
	}

	async post(post: ContractPostWritable): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(post),
			tags: [{ name: "Action", value: "CreatePost" }],
			signer: createDataItemSigner(this.signer),
		});
		console.debug(`Created post with id ${registrationId}`);

		return this;
	}

	async follow(data: { address: string }): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(data),
			tags: [{ name: "Action", value: "Follow" }],
			signer: createDataItemSigner(this.signer),
		});
		console.debug(`Followed ${data.address} with id ${registrationId}`);

		return this;
	}

	async unfollow(data: { address: string }): Promise<this> {
		const registrationId = await this.ao.message({
			process: this.processId,
			data: JSON.stringify(data),
			tags: [{ name: "Action", value: "Unfollow" }],
			signer: createDataItemSigner(this.signer),
		});
		console.debug(`Unfollowed ${data.address} with id ${registrationId}`);

		return this;
	}
}
