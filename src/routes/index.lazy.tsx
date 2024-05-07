import { GameDemo2 } from "@/_old/components/GameDemo2";
import { buttonVariants } from "@/components/ui/button";
import { AoProvider } from "@/ao/lib/ao";
import {
	type ArweaveID,
	type ContractUser,
	aoGatherProcessId,
} from "@/ao/lib/ao-gather";
import type { AoToonSaved } from "@/_old/lib/model";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu"

export const Route = createLazyFileRoute("/")({
	component: Index,
});

const aoProvider = new AoProvider({
	processId: aoGatherProcessId,
});

const placeholderUser: AoToonSaved = {
	avatarSeed: "a1204030b070a01",
	displayName: "You?",
	id: "",
	isFollowing: false,
	lastSeen: 0,
	savedPosition: { x: 10, y: 5 },
};

function Index() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [targetOffset, setTargetOffset] = useState({
		x: 0,
		y: 0,
	});

	const { data: otherToons } = useQuery({
		queryKey: ["gatherUsers"],
		queryFn: async () => {
			const { Messages } = await aoProvider.ao.dryrun({
				process: aoProvider.processId,
				tags: [{ name: "Action", value: "GetUsers" }],
			});
			const json = JSON.parse(Messages[0].Data) as Record<
				ArweaveID,
				ContractUser
			>;

			const otherToons: AoToonSaved[] = Object.entries(json)
				.map(([id, toon]) => {
					return {
						id,
						avatarSeed: toon.avatar,
						displayName: toon.name,
						savedPosition: { x: 5, y: 5 },
						isFollowing: false,
						...toon,
					};
				})
				.filter(Boolean) as AoToonSaved[];
			return otherToons;
		},
	});

	return (
		<div
			ref={containerRef}
			className="w-[100%] h-[100%] relative"
			onMouseMove={(e) => {
				const position = e.currentTarget.getBoundingClientRect();
				const mousePosition = {
					x: e.clientX - position.left,
					y: e.clientY - position.top,
				};
				const fromCenter = {
					x: mousePosition.x - window.innerWidth / 2,
					y: mousePosition.y - window.innerHeight / 2,
				};
				function calculateOffset(mouseDistance: number) {
					if (mouseDistance === 0) return 0;
					return (
						(mouseDistance > 0 ? -1 : -0) *
						Math.floor(Math.log(Math.abs(mouseDistance / 2))) *
						10
					);
				}
				const targetOffset = {
					x: calculateOffset(fromCenter.x),
					y: calculateOffset(fromCenter.y),
				};
				setTargetOffset(targetOffset);
			}}
		>
			{/* <NavigationMenu className='w-[100%] max-w-full'>
        <NavigationMenuList className='flex flex-row justify-center px-8 py-4 gap-4'>
          <NavigationMenuItem>
            <Link to="/" className='[&.active]:font-bold'>
              <NavigationMenuLink >
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to='/game' className='[&.active]:font-bold'>
              <NavigationMenuLink>
                Game
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
			<div className="z-10 absolute w-[100%] h-[100%] text-white bg-gray-800/80 flex flex-col justify-center items-center pb-10">
				<img src="./assets/logo.png" width={400} alt="Gather Chat logo" />
				<div>
					<ol>
						<li className="h-10 pl-2">
							<span className="font-mono">1. </span>
							<span className="pl-3">
								Install{" "}
								<a
									href="https://www.arconnect.io/download"
									target="_blank"
									rel="noreferrer"
									className="unterline text-blue-200"
								>
									ArConnect
								</a>
							</span>
						</li>
						<li className="h-10 pl-2">
							<span className="font-mono">2. </span>
							<span className="pl-3">Set up a wallet</span>
						</li>
						<li className="h-10 pl-2">
							<span className="font-mono">3. </span>
							<Link
								to="/game"
								className={cn(buttonVariants({ variant: "default" }))}
							>
								Play Gather Chat!
							</Link>
						</li>
					</ol>
				</div>
			</div>
			<div className="z-20 absolute w-[100%] bottom-0 text-white flex flex-col justify-end items-center py-4">
				<p>
					Created by Elliot Sayes. Source on{" "}
					<a
						href="https://github.com/elliotsayes/gatherchat"
						target="_black"
						className="underline text-blue-200"
					>
						Github
					</a>
					.
				</p>
			</div>
			<div className="z-0 absolute w-[100%] h-[100%]">
				<GameDemo2
					parentRef={containerRef}
					lastResized={0}
					aoStateProp={{
						user: placeholderUser,
						otherToons: otherToons ?? [],
					}}
					onSelectToon={() => {}}
					onViewFeed={() => {}}
					onSavePosition={async () => true}
					targetOffset={targetOffset}
				/>
			</div>
		</div>
	);
}
