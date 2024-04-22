import { AoGatherProvider, type ContractUser } from "@/lib/ao-gather";
import type {
	AoState,
	AoToonMaybeSaved,
	AoToonSaved,
} from "@/lib/schema/gameModel";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { GatherChat } from "./GatherChat";

const aoGather = new AoGatherProvider({});

export const GameLoader = () => {
	const { data, refetch } = useQuery({
		queryKey: ["gameData"],
		queryFn: async () => {
			aoGather.ensureStarted();
			return aoGather.getUsers();
		},
		// enabled: arweaveId !== undefined,
	});

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

	const gameData = useMemo<AoState | undefined>(() => {
		if (!data || !arweaveId) return undefined;
		// const userData = data[arweaveId];
		// const user: AoToonMaybeSaved = {
		//   id: arweaveId,
		//   ...userData,
		//   avatarSeed: userData.avatar,
		//   displayName: userData.name,
		//   savedPosition: { x: userData.position.x, y: userData.position.y },
		// };
		const userData = data.testUser1;
		console.log({ userData });
		const user: AoToonMaybeSaved = {
			id: "testUser1",
			avatarSeed: userData.avatar,
			displayName: userData.name,
			savedPosition: { x: userData.position.x, y: userData.position.y },
			...userData,
		};
		const otherToons: AoToonSaved[] = Object.entries(data)
			.map(([id, toon]) => {
				// if (id === arweaveId) return null;
				return {
					id,
					avatarSeed: toon.avatar,
					displayName: toon.name,
					savedPosition: { x: toon.position.x, y: toon.position.y },
					isFollowing: userData.following.includes(id),
					...toon,
				};
			})
			.filter(Boolean) as AoToonSaved[];
		return {
			user,
			otherToons,
		};
	}, [data, arweaveId]);

	if (gameData === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<GatherChat
			aoState={gameData}
			onUpdateProfile={async (p) => {
				const userPart: Partial<ContractUser> = {
					avatar: p.avatarSeed,
					name: p.name,
				};
				await aoGather.update(userPart)
        refetch();
				return true;
			}}
			onUpdatePosition={async (p) => {
				const userPart: Partial<ContractUser> = {
					position: p,
				};
				await aoGather.update(userPart);
        refetch();
				return true;
			}}
		/>
	);
};
