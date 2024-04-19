import { setup, assign, and } from "xstate";

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

function calculateNextPosition(currentPosition: { x: number; y: number }, direction: MovementDirection) {
	const xDelta = direction === "left"? -1 : direction === "right"? 1 : 0;
	const yDelta = direction === "up"? -1 : direction === "down"? 1 : 0;
	return {
		x: currentPosition.x + xDelta,
		y: currentPosition.y + yDelta,
	};
}

const movementBounds = {
	x: {
		min: 1,
		max: 9,
	},
	y: {
		min: 1,
		max: 7,
	},
} as const;

export const gameMachine = setup({
	schemas: {
		context: {} as {
			currentPosition: {
				x: number;
				y: number;
			};
			currentDirection: FaceDirection;
			queuedMovement: MovementDirection | undefined;
			selectedToonId: string | undefined;
		},
		events: {} as
			| {
					type: "KEY_PRESSED";
					key: string;
			  }
			| {
					type: "TOON_SELECTED";
					toonId: string;
			  },
	},
	actions: {
		queueMovement: assign({
			queuedMovement: ({ event }) => keyToMovementMap[event.key as MovementKey],
		}),
		executeQueuedMovement: assign(({ context }) => {
			const { currentPosition, queuedMovement } = context;

			const nextPosition = calculateNextPosition(currentPosition, queuedMovement!);

			const directionUpdate = faceDirections.includes(queuedMovement)
				? { currentDirection: queuedMovement }
				: {};

			return {
				...context,
				currentPosition: nextPosition,
				...directionUpdate,
				queuedMovement: undefined,
			};
		}),
		assignSelectedToon: assign({
			selectedToonId: ({ event }) => event.toonId,
		}),
		clearSelectedToon: assign({
			selectedToonId: undefined,
		}),
	},
	guards: {
		isMovementInput: ({ event }) => {
			return movementKeys.includes(event.key);
		},
		canMove: ({ context, event }) => {
			const { currentPosition } = context;
			const desiredDirection = keyToMovementMap[event.key as MovementKey];

			const testPosition = calculateNextPosition(currentPosition, desiredDirection);

			return (
				testPosition.x >= movementBounds.x.min &&
				testPosition.x <= movementBounds.x.max &&
				testPosition.y >= movementBounds.y.min &&
				testPosition.y <= movementBounds.y.max
			);
		},
		isMovementQueued: ({ context }) => {
			return context.queuedMovement !== undefined;
		},
	},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYgG0AGAXUVAAcB7WS3L-OxAAPRAEYAzAFYSTAJwAmACxKJCgOxKAHFqUKAbABoQAT0RaFJfVJtz9a9XKdK5AX1fG0WPIVKwwFACuHIysQty8VAJCoghiUpYSYgpSTErqYkxJNgrGZggSeiRiSlJiWvaKLununhg4BMQkAE5c6KgEUCSoXABuYKhg+BRkEDRgdADSAKIAmgD6AAoAStMAymvTACLMbEggEXzR+7EKTDLWOlIS+lrnChJaEnmI6loy6uoKYvpKt7+lfS1EBeBq+FptDr4Lo9fqDYajcahPacHhHQQnRBnC5SK43O4JR7PUzmLRiWR-RQSRTJCRMMTA0E+Jqtdqdbp9AZDEawzpTOZLVYbba7cJoqIY0CxKTqfQkT4VfRMdS4hRPF4ITRaEjKeRSVRKeTpLSM+rM0isqEwznwnl9PnCWAUdAUMAkdAAM1dzWQZyYRDoTMaFsh7NhXIRvOhov2hwlMUQEnUEh1mTkqX0YmT+jV6g1ye1cnSckKbwMaQUpu8wYhbOhZGGYGaWAlsEREwAKgB5LsAOXmmwAMtMAMIdkVhWPi-iSkRYrLFZIqfRKxw0qQasQlSxZL5yeJJpy4qtglmh+sEb0tmdty9N6-QuiO52u91epvITJMf2Bs01y3snezaYK2DZXiBnQxqikQzgmCAaCm6TqEwGgVFcTArpueqpnSFgZDmJRAsC+BcBAcBCEGvhijBxxSogAC0ChyCQ+q-MqyopEktwavRMhOPxcgYd+CSpJWHggn+4LkFQtDUeicF6BqZIkGoTE-MospfDmJ7miQ-hBBwcnxpiCAyhqhRMCQZIpBhSTfPobw6f+55QEZsEmeUJClNIiiKJotxqBqUi-CpKHKlIJblBUDLiZRZ51tacLcm5tFzgg+hyBq1jkjmLiOLiuF-E54IAfW4a2u2KWzrEW55iSCB3HKPzpH8KRyBUybFfFVocklkb2tCVVwWU2plBlSiZNoGHJkp2gsfEGU2Oc1IuF1IYJWB94QQI8BTjR1WICuXnXBFTEaH8Ty5PVX7qFZglZncapJMka21j1QHXjtlV7fJHklMdPlnf5l2bpISjFA8K4oW8nxFq9pVdB9234LejbAVQg0-cZdEFEWOqqU9MrJHYRjXZkMiGoaXxiCWvxw+4rhAA */
	context: {
		currentPosition: {
			x: 5,
			y: 3,
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
									guard: and(["isMovementInput", "canMove"]),
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
									guard: and(["isMovementInput", "canMove"]),
									actions: "queueMovement",
								},
							},
							after: {
								200: "idle",
							},
						},
					},
				},
				interactions: {
					initial: "idle",
					states: {
						idle: {
							on: {
								TOON_SELECTED: {
									target: "interacting",
									actions: "assignSelectedToon",
								},
							},
						},
						interacting: {
							after: {
								1000: {
									target: "idle",
								},
							},
							exit: "clearSelectedToon",
						},
					},
				},
			},
		},
	},
});
