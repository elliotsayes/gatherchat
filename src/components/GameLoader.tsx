import { AoGatherProvider, type ContractUser } from "@/lib/ao-gather";
import type {
	AoState,
	AoToonMaybeSaved,
	AoToonSaved,
} from "@/lib/schema/gameModel";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { GatherChat } from "./GatherChat";
import { SetupForm } from "./profile/SetupForm";
import type { UploadInfo } from "./upload/UploadPage";

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
		const userData = data[arweaveId];
    console.log({ userData })

    if (!userData) return undefined;

		const user: AoToonMaybeSaved = {
			id: "testUser1",
			avatarSeed: userData.avatar,
			displayName: userData.name,
			savedPosition: { x: userData.position.x, y: userData.position.y },
			...userData,
		};
		const otherToons: AoToonSaved[] = Object.entries(data)
			.map(([id, toon]) => {
				if (id === arweaveId) return null;
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

	if (data === undefined) {
		return <div>Loading...</div>;
	}

	if (gameData === undefined) {
		return (
      <SetupForm
        onSubmit={(s) => {
          (async () => {
            await aoGather.register({
              name: s.username,
              avatar: s.avatarSeed,
              status: "Hello Gather Chat!",
              position: { x: 3, y: 3 },
            })
            await refetch();
            alert("Registered!")
          })();
        }}
      />
    )
	}


	return (
		<GatherChat
      aoState={gameData}
      onUpdateProfile={async (p) => {
        const userPart: Partial<ContractUser> = {
          avatar: p.avatarSeed,
          name: p.name,
        };
        await aoGather.update(userPart);
        refetch();
        return true;
      } }
      onUpdatePosition={async (p) => {
        const userPart: Partial<ContractUser> = {
          position: p,
        };
        await aoGather.update(userPart);
        refetch();
        return true;
      } }
      onUpload={async (upload: UploadInfo): Promise<boolean> => {
        await aoGather.post(upload);
        return true;
      }}
      onFollow={async (data: { address: string }) => {
        await aoGather.follow(data);
        return true;
      }}
    />
	);
};
