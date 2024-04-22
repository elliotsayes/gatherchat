/* @ts-ignore */
import type { Services } from '@permaweb/aoconnect/dist/index.common';
import { AoProvider } from './ao';
import { ArconnectSigner, type ArweaveSigner } from 'arbundles';
import Arweave from 'arweave';
import { createDataItemSigner } from '@permaweb/aoconnect';
import EventEmitter from 'eventemitter3';

export const aoRtcProcessId = "eMPaAiplysooaRR3xoIyi3kkT0oOHzQwB4cwm2f9qdk";
export const defaultArweave = Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443 })

export type ArweaveID = string;
export type ArweavePublicKey = string;
export type ConnectionID = ArweaveID
export type ArweaveAddress = ArweaveID

export type User = {
    processId: ArweaveID; // personal process id of the user for things like notification, mail, etc.
    created: number;
    lastSeen: number;
    name: string;
    avatar: string;
    status: string;
    position: {
      x: number;
      y: number;
    }
    following: ArweaveID[];
    // blockList: ArweaveID[]; // disallows connection to specified users and prevent them from messaging/inviting the user to lobbies.
    // preferences: UserSettings;
}

export type Post = {
  created: number;
  author: string;
  type: string;
  textOrTxId: string;
}

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

// Interface defining the structure for AoRtc which includes a signer of type RtcSigner and WebRTC management
export interface AoGather {
    signer: GatherSigner;
    connections:  Record<ArweaveAddress, RTCPeerConnection>
    streams: Record<ArweaveAddress, MediaStream>;
    arweave: Arweave;
    connect(params:{id: ArweaveID}): Promise<this>;
    disconnect(params:{id: ArweaveID}): void;
    getContractConnections(params:{userId: ArweaveID}): Promise<Record<ArweaveID, EncryptedAoRTCContractConnectionState>>; // queries contract for all connections associated with a user
    getMediaStream(params:{id: ArweaveID}): Promise<MediaStream>;
    getUsers(): Promise<Record<ArweaveID, User>>;
    register(params: Partial<User>): Promise<this>;
}

export const gatherEventEmitter = new EventEmitter();

// Class AoRtcProvider extends from AoProvider and implements the AoRtc interface
export class AoRtcProvider extends AoProvider implements AoGather {
    signer: GatherSigner;
    // it is possible to have multiple connections to the same user, so we store them in a nested object
    connections: Record<ArweavePublicKey, RTCPeerConnection>;
    streams: Record<ArweavePublicKey, MediaStream>;
    arweave: Arweave;
    heartbeat: any;

    constructor({
        arweave = defaultArweave,
        processId = aoRtcProcessId,
        signer = new ArconnectSigner(window.arweaveWallet, defaultArweave as any),
        ...params
    }: {
        signer?: GatherSigner, 
        processId?: string, 
        arweave?: Arweave,
        scheduler?: string, 
        connectConfig?: Services
    } = {}) {
        super({
            processId: processId, 
            scheduler: params.scheduler, 
            connectConfig: params.connectConfig
        });
        this.signer = signer;
        this.arweave = arweave;
        this.connections = {}
        this.streams = {}
    }

    /**
     * @description - Starts the AoRtcProvider, sets up the heartbeat to update connection states
     * @returns AoRtcProvider - the instance of the AoRtcProvider
     * 
     */
    start(): this {
        if (this.heartbeat) {
            throw new Error('Already started');
        }
        const heartbeat = setInterval(() => this.updateConnectionStates(), 3000);
        this.heartbeat = heartbeat;
        // disconnect all connections when the window is closed
        window.onbeforeunload = () => {
            Object.keys(this.connections).forEach(id => this.disconnect({id}));
        }
        return this;
    }

    /**
     * @description - Stops the AoRtcProvider, clears the heartbeat
     * @returns AoRtcProvider - the instance of the AoRtcProvider
     */
    stop(): this {
        if (!this.heartbeat) {
            throw new Error('Not started');
        }
        clearInterval(this.heartbeat);
        this.heartbeat = undefined;
        return this;
    }
/**
 * @description - Updates the connections for all peers associated with the current user, both Host and Guest connections, answers offers
 * and sends offers to new connections, checks for renegotiation and sends new offers if needed
 */
    async updateConnectionStates(): Promise<void> {
        console.log(this)
        console.log('updating connection states')
        console.log("fetching public key")
        const publicKey = await window.arweaveWallet.getActivePublicKey();
        console.log(`fetching connection states`)
        const encryptedConnections = await this.getContractConnections({userId: publicKey});
        
        console.log('mapping over connections', encryptedConnections)
        for (const [connectionId, contractConnection] of Object.entries(encryptedConnections)) {
            console.log(contractConnection)
            const host = contractConnection.Host.id
            const guest = contractConnection.Guest.id

            if (host === publicKey) {
                console.log('if user is host')
                // update remote ICE servers as host
                if (contractConnection.Guest.IceCandidates.length) {
                    console.log('decrypting ice candidates', contractConnection.Guest.IceCandidates)

                await decryptJSONWithArconnect(contractConnection.Guest.IceCandidates, window.arweaveWallet)
                .then((obj: object) => Array.isArray(obj) ? obj : [])
                .then(candidates => candidates.forEach(candidate => {
                    console.log(candidate)
                    this.connections[guest].addIceCandidate(new RTCIceCandidate(candidate)).catch((e)=> console.error(e))
                }));
                }
                console.log('decrypted ice candidates')

                const decryptedAnswer = contractConnection.ConnectionConfig.Answer.length ? new RTCSessionDescription(
                    await decryptJSONWithArconnect(
                        contractConnection.ConnectionConfig.Answer, 
                        window.arweaveWallet
                        ) as RTCSessionDescriptionInit) : undefined;
                // if the decrypted answer is not the same as the remote description, set it
                if (decryptedAnswer && decryptedAnswer !== this.connections[guest].remoteDescription) {
                    await this.onRecieveAnswer({guestPublicKey: guest, encryptedAnswer: contractConnection.ConnectionConfig.Answer})
                }

            } else if (guest === publicKey) {
                // update remote ICE servers as guest
                if (contractConnection.Host.IceCandidates.length) {
                await decryptJSONWithArconnect(contractConnection.Host.IceCandidates, window.arweaveWallet)
                .then((obj: object) => Array.isArray(obj) ? obj.map(candidate => new RTCIceCandidate(candidate)) : [])
                .then(candidates => candidates.forEach(candidate => this.connections[host].addIceCandidate(candidate))).catch((e)=> console.error(e));
                }
                console.log('decrypted ice candidates')

                console.log('decrypting offer')
                const decryptedOffer = contractConnection.ConnectionConfig.Offer.length ? new RTCSessionDescription(
                    await decryptJSONWithArconnect(
                        contractConnection.ConnectionConfig.Offer, 
                        window.arweaveWallet
                        ) as RTCSessionDescriptionInit) : undefined;
                console.log('decrypted offer', decryptedOffer)
                // if the decrypted offer is not the same as the remote description, set it
                if (decryptedOffer && decryptedOffer !== this.connections[host]?.remoteDescription) {
                    await this.onRecieveOffer({connectionId, hostPublicKey:host, encryptedOffer: contractConnection.ConnectionConfig.Offer})
                }
            } else {
                throw new Error('Invalid connection state');
            }

        }

    }

    async register(params: Partial<User>): Promise<this> {
        const registrationId = await this.ao.message({
            process: this.processId,
            data: JSON.stringify({
                PublicKey: await window.arweaveWallet.getActivePublicKey(),
                MetaData: {...params}
            }),
            tags: [
                {name: 'Action', value: 'Register'},
            ],
            signer: createDataItemSigner(window.arweaveWallet)
        });
        console.debug(`User registered with id ${registrationId}`);

        return this;

    }

    /**
     * 
     * @param id - public key of the peer to connect to
     * 
     * @returns AoRtcProvider - the instance of the AoRtcProvider
     * 
     * @example
     * const mediaStream = await aoRtc.connect({id: 'publicKey'}).getMediaStream({id: 'publicKey'})
     */
    async connect({id}: {id: ArweavePublicKey}): Promise<this> {
          // check we are not already connected locally
        if (id in Object.keys(this.connections)) {
            throw new Error(`Connection to user ${id} already exists`);
        }
        const address = await window.arweaveWallet.getActiveAddress();

        if (id === address) {
            throw new Error('Cannot connect to thyself');
        }

        const encryptedContractConnections = await this.getContractConnections({userId: address});
        
        const connectedAsHost = Object.entries(encryptedContractConnections).find(([connectionId, value]) => {
            if (value.Host.id === address && value.Guest.id === id) return connectionId
        });
        // peer is attempting to connect as host to me
        const connectedAsGuest = Object.entries(encryptedContractConnections).find(([connectionId, value]) => {
            if (value.Host.id === id && value.Guest.id === address) return connectionId
        });

        // could be connected on another device using the same wallet, if thats the case then we should just create a new connection
        if (connectedAsHost || connectedAsGuest) {
         throw new Error(`Connection to user ${id} already exists`);
        }

        const connection = this.createPeerConnection();


        this.connections[id] = connection;
        const offer = await this.connections[id].createOffer();
        await this.connections[id].setLocalDescription(offer);
        // set video and audio tracks
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        stream.getTracks().forEach(track => this.connections[id].addTrack(track, stream));
        this.streams[id] = stream;

        const connectionId = await this.ao.message({
            process: this.processId,
            tags: [
                {name: 'Action', value: 'CreateConnection'},
                {name: 'Guest', value: id},
                {name: 'Offer', value: await encryptJSONWithPublicKey(offer, id)},
            ],
            signer: createDataItemSigner(window.arweaveWallet)
        });
        this.setupConnection({remoteId: id, connectionId});



        console.debug(`Connection to user ${id} created with id ${connectionId}`)

        return this;
    }


    setupConnection({remoteId, connectionId}: {remoteId: ArweaveID, connectionId: ArweaveID}): void {
        // Check if the connection exists in the connections map
        const connection = this.connections[remoteId];
        if (!(connection)) {
            throw new Error(`Connection to user ${remoteId} does not exist`);
        }
    
        // Handle ICE candidates
        connection.onicecandidate = async event => {
            if (event.candidate) {
                // Send the ICE candidate to a signaling server or store it to send later
               const messageId = await this.ao.message({
                    process: this.processId,
                    tags: [
                        {name: 'Action', value: 'AddIceCandidate'},
                        // TODO: may need to pull all canidates, decrypt, add, encrypt, and send back
                        {name: 'Candidate', value: await encryptJSONWithPublicKey([event.candidate], remoteId)},
                        {name: "ConnectionId", value: connectionId}
                    ],
                    signer: createDataItemSigner(window.arweaveWallet)
                });
                console.debug(`ICE candidate sent to user ${remoteId} with message id ${messageId}`);
            } else {
                // This null candidate event indicates the end of candidate gathering
                console.debug("All ICE candidates have been gathered for peer ID:", remoteId);
            }
        };
    
        // Handle incoming media streams
        connection.ontrack = event => {
            if (!this.streams[remoteId]) {
                this.streams[remoteId] = new MediaStream();
            }
    
            // Add each track from the event to the stored stream
            event.streams[0].getTracks().forEach(track => {
                this.streams[remoteId].addTrack(track);
            });
    
            // Optionally, do something with the stream like attaching it to an HTML media element
        };
    
        // Additional event handlers you might consider adding:
    
        // ICE connection state change handler
        connection.oniceconnectionstatechange = () => {
            console.debug(`ICE connection state changed to: ${connection.iceConnectionState}`);
            if (connection.iceConnectionState === "failed" ||
                connection.iceConnectionState === "disconnected" ||
                connection.iceConnectionState === "closed") {
                // Handle disconnection or failed connection scenarios
            }
        };
    
        // Signaling state change handler
        connection.onsignalingstatechange = () => {
            console.debug(`Signaling state change: ${connection.signalingState}`);
        };
    
        // Negotiation needed handler
        connection.onnegotiationneeded = async () => {
            try {
                // Handle renegotiation (create and send a new offer)
                const offer = await connection.createOffer();
                await connection.setLocalDescription(offer);
                // Send the offer to the remote peer via your signaling mechanism
                this.ao.message({
                    process: this.processId,
                    data: JSON.stringify({Offer: await encryptJSONWithPublicKey(offer, remoteId)}),
                    tags: [
                        {name: 'Action', value: 'RenegotiateConnection'},
                        {name: "ConnectionId", value: connectionId}
                    ],
                    signer: createDataItemSigner(window.arweaveWallet)
                });
            } catch (err) {
                console.error('Failed to renegotiate connection, disconnecting:', err);
                this.disconnect({id: remoteId});
            }
        };
    }

    async disconnect({id}: {id: ArweaveID}): Promise<this> {
        if (!(id in this.connections)) {
            throw new Error(`Connection to user ${id} does not exist`);
        }
        this.connections[id].close();
        this.streams[id].getTracks().forEach(track => track.stop());
        delete this.connections[id];
        delete this.streams[id];

        if (Object.keys(this.connections).length === 0) {
            this.stop();
        }
        return this
    }

    async getContractConnections({userId}: {userId?: ArweaveID} = {}): Promise<Record<ArweaveID, EncryptedAoRTCContractConnectionState>> {

        const { Messages } = await this.ao.dryrun({
            process: this.processId,
            tags: [{name: 'Action', value: 'GetConnections'}]
        })
        const encryptedConnections = JSON.parse(Messages[0].Data) as Record<ArweavePublicKey, EncryptedAoRTCContractConnectionState>;
        // return all connections if no userId or signer is provided
        if (!userId) return encryptedConnections;
        // return all connections for a specific user if userId is provided
        return Object.fromEntries(Object.entries(encryptedConnections)
        .filter(([key, value]) => value.Host.id === userId || value.Guest.id === userId));

    }

    async getUsers(): Promise<Record<ArweaveID, User>> {
        const { Messages } = await this.ao.dryrun({
            process: this.processId,
            tags: [{name: 'Action', value: 'GetUsers'}]
        });
        return JSON.parse(Messages[0].Data) as Record<ArweaveID, User>;
    }

    async getMediaStream({id}: {id: ArweaveID}): Promise<MediaStream> {
        if (!(Object.keys(this.streams).includes(id))) {
            throw new Error(`Connection to user ${id} does not exist`);
        }
        return this.streams[id];
    }



    // Assume this function is triggered when an offer is received from the signaling channel
    async onRecieveOffer({
        connectionId, 
        hostPublicKey, 
        encryptedOffer} : {
            connectionId: ConnectionID,
            hostPublicKey: ArweavePublicKey,
            encryptedOffer: string
        
        }) {
        try {
            const decryptedOffer = await decryptJSONWithArconnect(encryptedOffer, window.arweaveWallet);
            if (!this.connections[hostPublicKey]) {
                this.connections[hostPublicKey] = this.createPeerConnection();
                this.setupConnection({remoteId: hostPublicKey, connectionId});
            }
            const connection = this.connections[hostPublicKey];
            await connection.setRemoteDescription(new RTCSessionDescription(decryptedOffer as RTCSessionDescriptionInit));
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);

            // setup media stream
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            stream.getTracks().forEach(track => connection.addTrack(track, stream));
            this.streams[hostPublicKey] = stream;
            gatherEventEmitter.emit('mediaStream', stream);

            // Send the answer back to the original sender (host)
            this.ao.message({
                process: this.processId,
                data: JSON.stringify({ Answer: await encryptJSONWithPublicKey(answer, hostPublicKey)}),
                tags: [
                    {name: 'Action', value: 'AcceptConnection'},
                    {name: "ConnectionId", value: connectionId}
                ],
                signer: createDataItemSigner(window.arweaveWallet)
            });
        } catch (error) {
            console.error("Error handling received offer:", error);
        }
    }

    async onRecieveAnswer({guestPublicKey, encryptedAnswer}: {
        guestPublicKey: ArweavePublicKey,
        encryptedAnswer: string
    
    }) {
        try {
            const decryptedAnswer = await decryptJSONWithArconnect(encryptedAnswer, window.arweaveWallet);
            const connection = this.connections[guestPublicKey];
            await connection.setRemoteDescription(new RTCSessionDescription(decryptedAnswer as RTCSessionDescriptionInit));
        } catch (error) {
            console.error("Error handling received answer:", error);
        }
    }

}