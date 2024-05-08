import { useEffect, useState } from "react";
import type { ArweaveAddress } from "../lib/ao-gather";

interface Props {
	children: (arweaveAddress: ArweaveAddress) => React.ReactNode;
}

const WalletLoader = ({ children }: Props) => {
	const [arweaveId, setArweaveId] = useState<string | undefined>();
	useEffect(() => {
		(async () => {
			await window.arweaveWallet.connect([
				"ACCESS_ADDRESS",
				"ACCESS_PUBLIC_KEY",
				"SIGN_TRANSACTION",
				"ENCRYPT",
				"DECRYPT",
				"SIGNATURE",
				"ACCESS_ARWEAVE_CONFIG",
			]);
			setArweaveId(await window.arweaveWallet.getActiveAddress());
		})();
	}, []);

	if (window.arweaveWallet === undefined) {
		return (
			<div className="h-screen w-screen text-center flex flex-col justify-center">
				<p className="text-xl">
					Please install{" "}
					<a
						href="https://www.arconnect.io/download"
						target="_blank"
						rel="noreferrer"
						className="text-blue-800"
					>
						ArConnect
					</a>
				</p>
			</div>
		);
	}

	if (arweaveId === undefined) {
		return (
			<div className="h-screen w-screen text-center flex flex-col justify-center">
				<p className="text-xl">Please connect ArConnect</p>
			</div>
		);
	}

	return children(arweaveId);
};

export default WalletLoader;
