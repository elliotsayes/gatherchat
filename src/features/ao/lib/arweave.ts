import Arweave from "arweave";

export const defaultArweave = Arweave.init({
    host: "arweave.net",
    protocol: "https",
    port: 443,
});

export const addressFromPublicKey = async (
    publicKey: Buffer,
): Promise<string> => {
    const owner = defaultArweave.utils.bufferTob64Url(publicKey);
    return await defaultArweave.wallets.ownerToAddress(owner);
};
