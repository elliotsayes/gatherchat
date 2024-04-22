import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import 'arconnect'
import Arweave from 'arweave';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
	);
}




export async function decryptJSONWithArconnect(b64EncryptedData: string, arweaveWallet: Window['arweaveWallet'] ): Promise<object> {
	console.log('decrypting', b64EncryptedData)

	console.log('converting b64 to Uint8')
    const encryptedData = Uint8Array.from(atob(b64EncryptedData), c => c.charCodeAt(0));
    const decoder = new TextDecoder('utf-8');

	return JSON.parse(atob(b64EncryptedData))
    
// 	console.log('decrypting with arconnect')
// 	// @ts-ignore types package not up to date, this is the correct usage
//   const decryptedBytes = await arweaveWallet.decrypt(encryptedData, { name: "RSA-OAEP" }).catch(console.error)
//   console.log('decrypted bytes', decryptedBytes)
//   const decodedString = decryptedBytes ?? '{}';
//   const obj = JSON.parse(decodedString);
//   console.log('decrypted obj', obj)
// return obj
}

export async function encryptJSONWithArconnect(obj: object, arweaveWallet: Window['arweaveWallet'] ): Promise<string> {
    const encoder = new TextEncoder();
    const jsonString = JSON.stringify(obj);
    const byteArray = encoder.encode(jsonString);

    // @ts-ignore types package not up to date, this is the correct usage
    return arweaveWallet.encrypt(byteArray, { name: "RSA-OAEP"}).then(btoa)

}

export async function encryptJSONWithPublicKey(obj: object, publicKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const jsonString = JSON.stringify(obj);
   // const byteArray = encoder.encode(jsonString);

	return btoa(jsonString)

    // @ts-ignore types package not up to date, this is the correct usage
    return Arweave.crypto.encrypt(byteArray, publicKey).then(btoa)
}

export async function decryptJSONWithArweaveSigner() {
    throw new Error('Not implemented');
}

export async function encryptJSONWithArweaveSigner() {
    throw new Error('Not implemented');
}