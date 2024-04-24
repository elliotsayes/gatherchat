import { Game } from '@/components/game/Game'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useRef, useState } from 'react'
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu"

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const containerRef = useRef<HTMLDivElement>(null)
	const [targetOffset, setTargetOffset] = useState({
		x: 0,
		y: 0,
	});

  return (
    <div ref={containerRef} className='w-[100%] h-[100%] relative'
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
    }}>
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
      <div className='z-10 absolute w-[100%] h-[100%] text-white bg-gray-800/80'>
        <h3>Welcome Home!</h3>
        <Link to="/game">
          Play game
        </Link>
      </div>
      <div className='z-0 absolute w-[100%] h-[100%]'>
        <Game
          parentRef={containerRef} lastResized={0}
          aoStateProp={{
            user: {
              avatarSeed: 'a1204030b070a01',
              displayName: "TEST",
              id: "TEST",
              isFollowing: false,
              lastSeen: 0,
              savedPosition: {x : 10, y: 6}
            },
            otherToons: []
          }}
          onSelectToon={() => {}}
          onViewFeed={() => {}}
          onSavePosition={async () => true}
          targetOffset={targetOffset}
        />
      </div>
    </div>
  )
}