import {
  AoGatherProvider,
  type ArweaveAddress,
  type ContractPost,
  type ContractUser,
  type ContractWorld,
  type ContractWorldIndex,
} from "@/features/ao/lib/ao-gather";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export type GatherContractState = {
  worldIndex: ContractWorldIndex;
  worldId: string;
  world: ContractWorld;
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
    onWorldChange: (worldId: string) => void,
  ) => React.ReactNode;
  initialWorldId?: string;
}

export const GatherContractLoader = ({ children, initialWorldId }: Props) => {
  const [worldId, setWorldId] = useState(initialWorldId ?? "WelcomeLobby");

  const {
    data: users,
    error: errorUsers,
    refetch: refetchUsers,
  } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("fetching users");
      aoGather.ensureStarted();
      return aoGather.getUsers();
    },
    refetchInterval: 10000,
  });

  const { data: worldIndex } = useSuspenseQuery({
    queryKey: ["worldIndex"],
    queryFn: async () => {
      console.log("fetching world Index");
      aoGather.ensureStarted();
      return aoGather.getWorldIndex();
    },
    refetchInterval: 10000,
  });

  const {
    data: world,
    error: errorRoom,
    refetch: refetchRoom,
  } = useSuspenseQuery({
    queryKey: ["world", worldId],
    queryFn: async () => {
      console.log("fetching world");
      aoGather.ensureStarted();
      return aoGather.getWorld({
        worldId: worldId,
      });
    },
    refetchInterval: 500,
  });

  const {
    data: posts,
    error: errorPosts,
    refetch: refetchPosts,
  } = useSuspenseQuery({
    queryKey: ["posts", worldId],
    queryFn: async () => {
      console.log("fetching posts");
      aoGather.ensureStarted();
      return aoGather.getPosts({ worldId });
    },
    refetchInterval: 5000,
  });

  if (errorUsers !== null || errorPosts !== null || errorRoom !== null) {
    return (
      <div className="h-screen w-screen text-center flex flex-col justify-center">
        <p className="text-xl">Error Loading</p>
      </div>
    );
  }

  const state: GatherContractState = {
    worldId,
    worldIndex,
    users,
    world,
    posts,
  };

  const events: GatherContactEvents = {
    setWorldId: async (worldId) => {
      setWorldId(worldId);
      // Will automatically refetch room and posts, so no need to do this manually
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
      await aoGather.updatePosition(args);
      await refetchRoom();
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

  return children(state, events, setWorldId);
};
