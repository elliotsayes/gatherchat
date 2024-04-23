const arnsApiContract = "https://api.arns.app/v1/contract";
const arnsGlobalContractTxId = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U";

export const getArnsRootTransaction = async (arnsName: string) => {
	const arnsNameReservedUrl = `${arnsApiContract}/${arnsGlobalContractTxId}/records/${arnsName}`;
	const arnsNameContractTxId = (
		await fetch(arnsNameReservedUrl).then((res) => res.json())
	).record.contractTxId;

	const arns = `${arnsApiContract}/${arnsNameContractTxId}`;
	const arnsRootTransaction = (await fetch(arns).then((res) => res.json()))
		.state.records["@"].transactionId as string;

	return arnsRootTransaction;
};
