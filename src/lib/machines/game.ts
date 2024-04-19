import { setup, assign } from "xstate";

export const movementKeys = [
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
] as const;
export type MovementKey = (typeof movementKeys)[number];

export const movementDirections = ["up", "down", "left", "right"] as const;
export type MovementDirection = (typeof movementDirections)[number];

export const faceDirections = ["left", "right"] as const;
export type FaceDirection = (typeof faceDirections)[number];

const keyToMovementMap: Record<MovementKey, MovementDirection> = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
} as const;

export const gameMachine = setup({
	schemas: {
		context: {} as {
			currentPosition: {
				x: number;
				y: number;
			};
      currentDirection: FaceDirection,
			queuedMovement: MovementDirection | undefined;
		},
		events: {} as {
			type: "KEY_PRESSED";
			key: string;
		},
	},
	actions: {
		queueMovement: assign({
			queuedMovement: ({ event }) => keyToMovementMap[event.key as MovementKey],
		}),
		executeQueuedMovement: assign(({context}) => {
      const { queuedMovement } = context;
      const xDelta =
        queuedMovement === "left" ? -1 : queuedMovement === "right" ? 1 : 0;
      const yDelta =
        queuedMovement === "up" ? -1 : queuedMovement === "down" ? 1 : 0;

      const { x, y } = context.currentPosition;

      const currentPosition = {
        x: x + xDelta,
        y: y + yDelta,
      };

      const directionUpdate = faceDirections.includes(queuedMovement)
        ? { currentDirection: queuedMovement }
        : {};

      return {
        ...context,
        currentPosition,
        ...directionUpdate,
        queuedMovement: undefined,
      }
		}),
	},
	guards: {
		isMovementInput: ({ event }) => {
			return movementKeys.includes(event.key);
		},
		isMovementQueued: ({ context }) => {
			return context.queuedMovement !== undefined;
		},
	},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYgG0AGAXUVAAcB7WS3L-OxAAPRAEYAzAFYSTAJwAmACwA2JQrkSlADiYqpAGhABPRNoUl9UlQoUqJasU21KAvq6NoseQqVhgKAFcORlYhbl4qASFRBAllEm0xBSklMXUAdhUMiW0VI1MEc0spa1t7R2c3dyN8Lgg4IS8cAmJwnj5opBFEAFp8kz6VWSZRsfGxjJqQZp9iMnw+WnbI-kFu2PUCszESeI0lZ21tDI106dnWvwDglc710FjbORIpMYlRlMUFdO2i3f2ckOxxOZ2qngwLV8JAATlx0KgCFA7lEHj0EGkXrYmE4MmIVDixKk-kk9s98fIJGI5FIMtV3EA */
	context: {
		currentPosition: {
			x: 0,
			y: 0,
		},
	},
	initial: "initial",
	states: {
		initial: {
			always: {
				target: "setup",
			},
		},
		setup: {
			always: {
				target: "roaming",
			},
		},
		roaming: {
			tags: ["SHOW_WORLD", "SHOW_OTHER_TOONS", "SHOW_TOON"],
			type: "parallel",
			states: {
				movement: {
					initial: "idle",
					states: {
						idle: {
							on: {
								KEY_PRESSED: {
									target: "moving",
									guard: "isMovementInput",
									actions: "queueMovement",
								},
							},
							always: {
								target: "moving",
								guard: "isMovementQueued",
							},
						},
						moving: {
							entry: "executeQueuedMovement",
							on: {
								KEY_PRESSED: {
									target: "moving",
									actions: "queueMovement",
								},
							},
							after: {
								200: "idle",
							},
						},
					},
				},
			},
		},
	},
});
