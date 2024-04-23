import { AoGatherProvider, type ContractUser } from "@/lib/ao-gather";
import type {
	AoUsersState,
	AoToonMaybeSaved,
	AoToonSaved,
  AoPostsState,
} from "@/lib/schema/gameModel";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { GatherChat } from "./GatherChat";
import { SetupForm } from "./profile/SetupForm";
import type { UploadInfo } from "./upload/UploadPage";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const aoGather = new AoGatherProvider({});

export const GameLoader = () => {
	const { data: users, error: errorUsers, refetch: refetchUsers } = useQuery({
		queryKey: ["gameData"],
		queryFn: async () => {
      console.log("fetching users")
			aoGather.ensureStarted();
			return aoGather.getUsers();
		},
    refetchInterval: 5000,
		// enabled: arweaveId !== undefined,
	});

  const { data: posts, error: errorPosts, refetch: refetchPosts } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
      console.log("fetching posts")
			aoGather.ensureStarted();
			return aoGather.getPosts();
		},
    refetchInterval: 5000,
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

	const usersState = useMemo<AoUsersState | undefined>(() => {
		if (!users || !arweaveId) return undefined;

		const userData = users[arweaveId];
    console.log({ userData })

    if (!userData) return undefined;

		const user: AoToonMaybeSaved = {
			id: arweaveId,
			avatarSeed: userData.avatar,
			displayName: userData.name,
			savedPosition: { x: userData.position.x, y: userData.position.y },
			...userData,
		};
		const otherToons: AoToonSaved[] = Object.entries(users)
			.map(([id, toon]) => {
				if (id === arweaveId) return null;
				return {
					id,
					avatarSeed: toon.avatar,
					displayName: toon.name,
					savedPosition: { x: toon.position.x, y: toon.position.y },
					isFollowing: userData.following[id] === true,
					...toon,
				};
			})
			.filter(Boolean) as AoToonSaved[];
		return {
			user,
			otherToons,
		};
	}, [users, arweaveId]);

  const postsState = useMemo<AoPostsState | undefined>(() => {
    if (!posts) return undefined;
    return Object.keys(posts).map((id) => ({
      id,
      ...posts[id],
    })).sort((a, b) => a.created - b.created);
  }, [posts]);

	if (errorUsers !== null || errorPosts !== null) {
    console.log({ users, posts })
		return <div>Error!</div>;
	}

	if (users === undefined || posts === undefined) {
    console.log({ users, posts })
		return <div>Loading...</div>;
	}

	if (usersState === undefined) {
		return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl pb-8">Welcome to Gather Chat!</p>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Set up your Profile</CardTitle>
          </CardHeader>
          <CardContent>
          <SetupForm
          onSubmit={(s) => {
            (async () => {
              await aoGather.register({
                name: s.username,
                avatar: s.avatarSeed,
                status: "Hello Gather Chat!",
                position: { x: 3, y: 3 },
              })
              await refetchUsers();
              alert("Registered!")
            })();
          }}
        />
          </CardContent>
        </Card>
      </div>
    )
	}


	return (
		<GatherChat
      aoUsersState={usersState}
      aoPostsState={postsState ?? []}
      onUpdateProfile={async (p) => {
        const userPart: Partial<ContractUser> = {
          avatar: p.avatarSeed,
          name: p.name,
        };
        await aoGather.update(userPart);
        refetchUsers();
        return true;
      } }
      onUpdatePosition={async (p) => {
        const userPart: Partial<ContractUser> = {
          position: p,
        };
        await aoGather.update(userPart);
        refetchUsers();
        return true;
      } }
      onUpload={async (upload: UploadInfo): Promise<boolean> => {
        await aoGather.post(upload);
        refetchPosts();
        return true;
      }}
      onFollow={async (data: { address: string }) => {
        await aoGather.follow(data);
        refetchUsers();
        // window.location.reload();
        return true;
      }}
      onUnfollow={async (data: { address: string }) => {
        await aoGather.unfollow(data);
        refetchUsers();
        // window.location.reload();
        return true;
      }}
    />
	);
};
