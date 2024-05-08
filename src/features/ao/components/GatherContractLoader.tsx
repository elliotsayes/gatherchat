import {
	AoGatherProvider,
	type ArweaveAddress,
	type ContractPost,
	type ContractRoom,
	type ContractRoomIndex,
	type ContractUser,
} from "@/features/ao/lib/ao-gather";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { throttle } from "throttle-debounce";

export type GatherContractState = {
	worldIndex: ContractRoomIndex;
	worldId: string;
	room: ContractRoom;
	users: Record<ArweaveAddress, ContractUser>;
	posts: Record<string, ContractPost>;
};

export type GatherContactEvents = {
	setWorldId: (worldId: string) => Promise<void>;
} & Pick<
	AoGatherProvider,
	"register" | "updateUser" | "updatePosition" | "post" | "follow" | "unfollow"
>;

const aoGather = new AoGatherProvider({});

interface Props {
	children: (
		gatherContractState: GatherContractState,
		gatherContactEvents: GatherContactEvents,
	) => React.ReactNode;
	initialWorldId?: string;
}

export const GatherContractLoader = ({ children, initialWorldId }: Props) => {
	const [worldId, setWorldId] = useState(initialWorldId ?? "WelcomeLobby");

	const {
		data: users,
		error: errorUsers,
		refetch: refetchUsers,
	} = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			console.log("fetching users");
			aoGather.ensureStarted();
			return aoGather.getUsers();
		},
		refetchInterval: 5000,
		// enabled: arweaveAddress !== undefined,
	});

	const { data: worldIndex } = useQuery({
		queryKey: ["roomIndex"],
		queryFn: async () => {
			console.log("fetching room Index");
			aoGather.ensureStarted();
			return aoGather.getRoomIndex();
		},
		refetchInterval: 10000,
		// enabled: arweaveAddress !== undefined,
	});

	const {
		data: room,
		// error: errorRoom,
		// refetch: refetchRoom,
	} = useQuery({
		queryKey: ["room", worldId],
		queryFn: async () => {
			console.log("fetching room");
			aoGather.ensureStarted();
			return aoGather.getRoom({
				roomId: worldId,
			});
		},
		refetchInterval: 500,
		// enabled: arweaveAddress !== undefined,
	});

	const {
		data: posts,
		error: errorPosts,
		refetch: refetchPosts,
	} = useQuery({
		queryKey: ["posts", worldId],
		queryFn: async () => {
			console.log("fetching posts");
			aoGather.ensureStarted();
			return aoGather.getPosts({ roomId: worldId });
		},
		refetchInterval: 5000,
		// enabled: arweaveAddress !== undefined,
	});

	const throttledUpdatePositionAndRefetch = useMemo(
		() =>
			throttle(
				250,
				async (args) => {
					await aoGather.updatePosition(args);
					await refetchUsers();
				},
				{
					noTrailing: false,
					noLeading: false,
				},
			),
		[refetchUsers],
	);

	if (errorUsers !== null || errorPosts !== null) {
		return (
			<div className="h-screen w-screen text-center flex flex-col justify-center">
				<p className="text-xl">Error Loading</p>
			</div>
		);
	}

	if (
		users === undefined ||
		worldIndex === undefined ||
		room === undefined ||
		posts === undefined
	) {
		return (
			<div className="h-screen w-screen text-center flex flex-col justify-center">
				<p className="text-xl">Loading...</p>
			</div>
		);
	}

	const state: GatherContractState = {
		worldId,
		worldIndex,
		users,
		room,
		posts,
	};

	const events: GatherContactEvents = {
		setWorldId: async (worldId) => {
			return setWorldId(worldId);
			// Will automatically refetch room and posts
		},
		register: async (args) => {
			await aoGather.register(args);
			await refetchUsers();
		},
		updateUser: async (args) => {
			await aoGather.updateUser(args);
			await refetchUsers();
		},
		updatePosition: async (args) => {
			// This one might be called a lot, so throttle it
			throttledUpdatePositionAndRefetch(args);
		},
		post: async (args) => {
			await aoGather.post(args);
			await refetchPosts();
		},
		follow: async (args) => {
			await aoGather.follow(args);
			await refetchUsers();
		},
		unfollow: async (args) => {
			await aoGather.unfollow(args);
			await refetchUsers();
		},
	};

	return children(state, events);
};
