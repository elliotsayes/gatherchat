import type {
  ArweaveID,
  ContractPosition,
  ContractWorld,
  ContractUser,
} from "@/features/ao/lib/ao-gather";
import type { Position } from "@/features/render/lib/schema";
import { Stage } from "@pixi/react";
import { Container, Sprite } from "@pixi/react-animated";
import { Spring } from "@react-spring/web";
import { AlphaFilter } from "pixi.js";
import { useState } from "react";
import InteractableToon from "../../avatar/components/InteractableToon";
import NamedAvatar from "../../avatar/components/NamedAvatar";
import {
  type FaceDirection,
  type MovementKey,
  keyToMovementMap,
  movementKeys,
  useMovement,
} from "../hooks/useMovement";
import { useResizableStage } from "../hooks/useResizableStage";

const veryTransparent = new AlphaFilter(0.3);
const slightlyTransparent = new AlphaFilter(0.6);

const tileSize = {
  x: 64,
  y: 64,
};

export type RenderEngineWorld = {
  tileSet: React.ReactNode;
  spritesBg: React.ReactNode;
  spritesFg: React.ReactNode;
  collision: (pos: Position) => boolean;
};

export type RenderWorld = {
  id: string;
  data: ContractWorld;
};

export type RenderPlayer = {
  id: ArweaveID;
  profile: ContractUser;
  savedPosition?: ContractPosition;

  // Player transient state is managed by RenderEngine
};

export type RenderOtherPlayer = {
  id: ArweaveID;
  profile: ContractUser;
  savedPosition: ContractPosition;

  // Derived
  isFollowedByUser: boolean;
  isFollowingUser: boolean;
  isInWorld: boolean;

  // Transient
  isActivated: boolean;
  isTalking: boolean;
};

export type RenderState = {
  world: RenderWorld;
  player: RenderPlayer;
  otherPlayers: Array<RenderOtherPlayer>;
};

export type RenderEngineEvents = {
  onPositionUpdate: (params: {
    newPosition?: Position;
    newDirection?: FaceDirection;
  }) => void;
  onPlayerClick: (player: RenderOtherPlayer) => void;
};

export type RenderEngineFlags = {
  enableMovement: boolean;
  animateMovement: boolean,

  showWorld: boolean;
  showPlayer: boolean;
  showOtherPlayers: boolean;
  showObjects: boolean;
};

type Props = {
  parentRef: React.RefObject<HTMLDivElement>;
  lastResized: number;

  state: RenderState;

  world: RenderEngineWorld;
  events: RenderEngineEvents;
  flags: RenderEngineFlags;
};

export const RenderEngine = ({
  parentRef,
  lastResized,

  state,

  world,
  events,
  flags,
}: Props) => {
  const stageSize = useResizableStage(parentRef, lastResized);

  // Used for the camera offset on mouse move
  const [targetOffset, setTargetOffset] = useState({
    x: 0,
    y: 0,
  });

  const { optimisticState, activeMovement, move } = useMovement({
    initialState: {
      position: state.player.savedPosition ?? state.world.data.spawnPosition,
      direction: "right",
    },
    onPositionUpdate: events.onPositionUpdate,
    collision: world.collision,
  });

  return (
    <>
      <Stage
        options={{
          background: 0x111111,
        }}
        width={stageSize.width}
        height={stageSize.height}
        style={{ outline: "none" }}
        tabIndex={0}
        onKeyDown={(e) => {
          //@ts-expect-error
          if (flags.enableMovement && movementKeys.includes(e.key)) {
            e.preventDefault();
            move(keyToMovementMap[e.key as MovementKey]);
          }
        }}
        onMouseMove={(e) => {
          const position = e.currentTarget.getBoundingClientRect();
          const mousePosition = {
            x: e.clientX - position.left,
            y: e.clientY - position.top,
          };
          const fromCenter = {
            x: mousePosition.x - stageSize.width / 2,
            y: mousePosition.y - stageSize.height / 2,
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
        <Spring to={{ ...targetOffset }}>
          {(props) => (
            <Container {...props}>
              {flags.showWorld && (
                <Spring
                  to={{
                    x:
                      stageSize.width / 2 -
                      (optimisticState.position.x + 1) * tileSize.x +
                      tileSize.x / 2,
                    y:
                      stageSize.height / 2 -
                      (optimisticState.position.y + 1) * tileSize.y +
                      tileSize.y / 2,
                  }}
                  immediate={!flags.animateMovement}
                >
                  {(props) => (
                    <Container anchor={{ x: 0.5, y: 0.5 }} {...props}>
                      {world.tileSet}
                      {state.player.savedPosition !== undefined && (
                        <Sprite
                          image={"assets/sprite/purple.png"}
                          width={tileSize.x}
                          height={tileSize.y}
                          x={tileSize.x * state.player.savedPosition.x}
                          y={tileSize.y * state.player.savedPosition.y}
                          filters={[veryTransparent]}
                        />
                      )}
                      {flags.showObjects && world.spritesBg}
                      {flags.showOtherPlayers &&
                        state.otherPlayers.map((otherPlayer) => (
                          <InteractableToon
                            key={otherPlayer.id}
                            name={otherPlayer.profile.name}
                            seed={otherPlayer.profile.avatar}
                            scale={3}
                            x={
                              otherPlayer.savedPosition.x * tileSize.x +
                              tileSize.x / 2
                            }
                            y={
                              otherPlayer.savedPosition.y * tileSize.y +
                              tileSize.y / 2
                            }
                            isPlaying={true}
                            animationName={"idle"}
                            animationSpeed={
                              otherPlayer.isActivated ? 0.3 : 0.1
                            }
                            onclick={() => {
                              events.onPlayerClick(otherPlayer);
                            }}
                            filters={
                              otherPlayer.isInWorld ? [] : [slightlyTransparent]
                            }
                          />
                        )
                      )}
                    </Container>
                  )}
                </Spring>
              )}
              {flags.showPlayer && (
                <Container x={stageSize.width / 2} y={stageSize.height / 2}>
                  <NamedAvatar
                    name={state.player.profile.name}
                    seed={state.player.profile.avatar}
                    animationName={
                      activeMovement.state === "moving" ? "run" : "idle"
                    }
                    flipX={optimisticState.direction === "left"}
                    scale={3}
                    isPlaying={true}
                  />
                </Container>
              )}
              {flags.showWorld && flags.showObjects && (
                <Spring
                  to={{
                    x:
                      stageSize.width / 2 -
                      (optimisticState.position.x + 1) * tileSize.x +
                      tileSize.x / 2,
                    y:
                      stageSize.height / 2 -
                      (optimisticState.position.y + 1) * tileSize.y +
                      tileSize.y / 2,
                  }}
                  immediate={!flags.animateMovement}
                >
                  {(props) => (
                    <Container anchor={{ x: 0.5, y: 0.5 }} {...props}>
                      {world.spritesFg}
                    </Container>
                  )}
                </Spring>
              )}
            </Container>
          )}
        </Spring>
      </Stage>
    </>
  );
};
