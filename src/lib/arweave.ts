import Arweave from "arweave";

const arweave = new Arweave({});

export const addressFromPublicKey = async (
	publicKey: Buffer,
): Promise<string> => {
	const owner = arweave.utils.bufferTob64Url(publicKey);
	return await arweave.wallets.ownerToAddress(owner);
};
