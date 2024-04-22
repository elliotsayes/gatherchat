// const DRE_HOST = "https://dre-u.warp.cc";
const GATEWAY_HOST = "https://gateway.warp.cc";

export const ensureRegistered = async (
	id: string,
	bundlrNode: "node1" | "node2" | "arweave",
) => {
	const registerResult = await fetch(
		`${GATEWAY_HOST}/gateway/contracts/register`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id, bundlrNode }),
		},
	);
	return registerResult;
};
