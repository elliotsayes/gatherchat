import { createDataItemSigner } from "@permaweb/aoconnect";
import type Arweave from "arweave";
import EventEmitter from "eventemitter3";
import { AoProvider } from "./ao";
import { defaultArweave } from "./arweave";

export const aoGatherProcessId = "PHHOfjFPSbn7TQT1Z-dB4ndyIyppHV5haMPCg8dIccs";

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
  currentWorldId: string;
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

export type ContractWorld = {
  created: number;
  lastActivity: number;
  name: string;
  description: string;
  worldSize: {
    w: number;
    h: number;
  }
  worldType: string;
  worldTheme: string;
  spawnPosition: ContractPosition;
  playerPositions: Record<ArweaveID, ContractPosition>;
};

export type ContractWorldIndex = Array<string>;

export type ContractPost = {
  created: number;
  author: string;
  worldId: string;
  type: string;
  textOrTxId: string;
};

export type ContractPostWritable = Omit<ContractPost, "created" | "author">;

export interface AoGather {
  signer: unknown;
  arweave: Arweave;
  getUsers(): Promise<Record<ArweaveID, ContractUser>>;
  getWorldIndex(): Promise<ContractWorldIndex>;
  getWorlds(): Promise<Record<ArweaveID, ContractWorld>>;
  getWorld(): Promise<ContractWorld>;
  getPosts(params?: { dm?: string }): Promise<
    Record<ArweaveID, ContractPost>
  >; // queries contract for all connections associated with a user
  register(params: ContractUserWritable): Promise<void>;
  updateUser(params: Partial<ContractUserWritable>): Promise<void>;
  updatePosition(params: {
    worldId: string;
    position: ContractPosition;
  }): Promise<void>;
  post(params: ContractPostWritable): Promise<void>;
  follow(params: { address: string }): Promise<void>;
  unfollow(params: { address: string }): Promise<void>;
}

export const gatherEventEmitter = new EventEmitter();

// Class AoGatherProvider extends from AoProvider and implements the AoGather interface
export class AoGatherProvider extends AoProvider implements AoGather {
  signer: unknown;
  arweave: Arweave;
  updateInterval?: NodeJS.Timeout;

  constructor({
    arweave = defaultArweave,
    processId = aoGatherProcessId,
    signer = window?.arweaveWallet ?? defaultArweave,
    ...params
  }: {
    signer?: unknown;
    processId?: string;
    arweave?: Arweave;
    scheduler?: string;
    // connectConfig?: Services;
  } = {}) {
    super({
      processId: processId,
      scheduler: params.scheduler,
      // connectConfig: params.connectConfig,
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
    // TODO: remove?
  }

  async getUsers(): Promise<Record<ArweaveID, ContractUser>> {
    const { Messages } = await this.ao.dryrun({
      process: this.processId,
      tags: [{ name: "Action", value: "GetUsers" }],
    });
    return JSON.parse(Messages[0].Data) as Record<ArweaveID, ContractUser>;
  }

  async getWorldIndex(): Promise<ContractWorldIndex> {
    const { Messages } = await this.ao.dryrun({
      process: this.processId,
      tags: [{ name: "Action", value: "GetWorldIndex" }],
    });
    return JSON.parse(Messages[0].Data) as ContractWorldIndex;
  }

  async getWorlds(): Promise<Record<string, ContractWorld>> {
    const { Messages } = await this.ao.dryrun({
      process: this.processId,
      tags: [{ name: "Action", value: "GetWorld" }],
    });
    return JSON.parse(Messages[0].Data) as Record<ArweaveID, ContractWorld>;
  }

  async getWorld(): Promise<ContractWorld> {
    const { Messages } = await this.ao.dryrun({
      process: this.processId,
      tags: [{ name: "Action", value: "GetWorld" }]
    });
    return JSON.parse(Messages[0].Data) as ContractWorld;
  }

  async getPosts({
    dm,
  }: { dm?: string } = {}): Promise<Record<ArweaveID, ContractPost>> {
    var params = [{ name: "Action", value: "GetPosts" }]
    if (dm) {
      params.push({ name: "DM", value: dm })
    }
    const { Messages } = await this.ao.dryrun({
      process: this.processId,
      tags: params,
    });
    const posts = JSON.parse(Messages[0].Data) as Record<
      ArweavePublicKey,
      ContractPost
    >;
    return posts;
  }

  async register(userNew: ContractUserWritable): Promise<void> {
    const registrationId = await this.ao.message({
      process: this.processId,
      data: JSON.stringify(userNew),
      tags: [{ name: "Action", value: "Register" }],
      signer: createDataItemSigner(this.signer),
    });
    console.debug(`User registered with id ${registrationId}`);
  }

  async updateUser(userUpdate: Partial<ContractUserWritable>): Promise<void> {
    const registrationId = await this.ao.message({
      process: this.processId,
      data: JSON.stringify(userUpdate),
      tags: [{ name: "Action", value: "UpdateUser" }],
      signer: createDataItemSigner(this.signer),
    });
    console.debug(`User updated with id ${registrationId}`);
  }

  async updatePosition({
    worldId,
    position,
  }: { worldId: string; position: ContractPosition }): Promise<void> {
    const registrationId = await this.ao.message({
      process: this.processId,
      tags: [{ name: "Action", value: "UpdatePosition" }],
      data: JSON.stringify({ worldId, position }),
      signer: createDataItemSigner(this.signer),
    });
    console.debug(
      `User position in ${worldId} to ${JSON.stringify(
        position,
      )} with id ${registrationId}`,
    );
  }

  async post(post: ContractPostWritable): Promise<void> {
    const registrationId = await this.ao.message({
      process: this.processId,
      data: JSON.stringify(post),
      tags: [{ name: "Action", value: "CreatePost" }],
      signer: createDataItemSigner(this.signer),
    });
    console.debug(`Created post with id ${registrationId}`);
  }

  async follow(data: { address: string }): Promise<void> {
    const registrationId = await this.ao.message({
      process: this.processId,
      data: JSON.stringify(data),
      tags: [{ name: "Action", value: "Follow" }],
      signer: createDataItemSigner(this.signer),
    });
    console.debug(`Followed ${data.address} with id ${registrationId}`);
  }

  async unfollow(data: { address: string }): Promise<void> {
    const registrationId = await this.ao.message({
      process: this.processId,
      data: JSON.stringify(data),
      tags: [{ name: "Action", value: "Unfollow" }],
      signer: createDataItemSigner(this.signer),
    });
    console.debug(`Unfollowed ${data.address} with id ${registrationId}`);
  }
}
