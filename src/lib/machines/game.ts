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

function calculateNextPosition(
	currentPosition: { x: number; y: number },
	direction: MovementDirection,
) {
	const xDelta = direction === "left" ? -1 : direction === "right" ? 1 : 0;
	const yDelta = direction === "up" ? -1 : direction === "down" ? 1 : 0;
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

export function isValidPosition(position: { x: number; y: number }) {
	const insideBounds =
		position.x >= movementBounds.x.min &&
		position.x <= movementBounds.x.max &&
		position.y >= movementBounds.y.min &&
		position.y <= movementBounds.y.max;

	const onTile = position.x % 2 === 0 && position.y % 2 === 0;

	return insideBounds && !onTile;
}

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

			const nextPosition = calculateNextPosition(
				currentPosition,
				queuedMovement!,
			);

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

			const testPosition = calculateNextPosition(
				currentPosition,
				desiredDirection,
			);

			return isValidPosition(testPosition);
		},
		isMovementQueued: ({ context }) => {
			return context.queuedMovement !== undefined;
		},
	},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCWA7bALtigDYDEA2gAwC6ioADgPayHZO70gAeiAjAGYArJioBOAEwAWIVSoSJ8qgDYA7ABoQAT0QTZmIcr6KxVVSqpCAHMoC+tzagyZYYAgFcGlWl2asiHFy8CAICfJjGfIICUmbKQhJWmjoIelQGRiZmFtZ2DiBOWABOTOh4UJhoTABuYBi4BDgQJGBkANIAogCaAPoACgBKHQDKwx0AItR0SCB+bIEzwUZimALKoVIxEnxiVrvJiNYi26pSqqpWUlZyO-aO6MWlaOWVNXVgDU0t3tOMLPOcRaIZardYxLY7PZJbTA66YKSSBSqRRWMJiKR3AoPTAlMq4CpVWr1RqE8rtbr9IajCZTXz-AKA0DBPYSeGCBJUTYIxLKA4IIRnTDKGzSPhCASSKiCTGFHFPF6E96fUn4sjcWAEFAELAoABm2qKAApFFQAJRkWW457415Ej4kmrlWkzOYMoKIVR8ZSYKyqdae7Y2KxCPh88VWVZiATSaxSKSKBIy7FWl54A0oADGDNgX1aABUAPIFgByPTGABkOgBhPM0nwu+nsRk8YHIoVCVTWMTKTkXMR80ICTCqMRCcVrc58a5iVRJ5wpm1psBFTPZnANZersnqzXazB6g2GvhyM0W5PyxcbldZps5pfXoj451-fxN90IU4RhLCeShEfo3kYVSGxMBnaJZE5dFNjye55wvCpYBQWpyV6QYRjGSZ6xfAF33WEQ9l2LkNmUQCUmDVke0SAQ9k2UwJTnR48QQpCsAzJgmBICAmAAd1wNUNS1HV9WXY0IPNS14JcFjMDYjiuN459ZkbBYmUQSRVFAqdOSESRjAkUI+WDKQIioGJzgsCRJAEBi5SYqTalzMhhgAQQANQ6Ms82cgY80U103yBBBj2sCJv19AU9h2DQgKscJo0SbtPUuSwZBsxDqjJFz3J6Dpi0w34lNfFSWxCMIIm2aJYj9BJoRSE1h2EEjO3kM4FHsfJcCYCA4C4Qo6SK5tggAWlIxAhpEMRJqm6bJqsGwbLwNhSH6nDAvjPlpBWBRyJUcxtmUTY0rcTwVrdQL9PSMVNkHGdYsIjaEUwbaOTUeQvSuGyFygU6AtUhAuWHTkzmEdFR1igQ+SiVlozHKQxWFaJZ3yCS7MVYkfuK4IrlZcw41UEGEWsQQ+RkcJsio0zTl2IRPsktH7VzDHBsOAR0lx4GdMJ2K+R7EQjDkK5jGsZExFp1G3mJW1yiZ98RQiKx9M55Qo22CQecFbtxFMAiQ1F5Hzzs+8tw4eAGwG99xQm3ZPRnc5O3xyHJqFK5NgVmxxTosXrQqI2bxNxmzdWv7rCHWabbt+2IaAmIIx7eIWt9ZQkS91Mr2N3A7zTm98RlwKbC2i5TjUfSRyuAcdh9INdgEEck72FObXSsBc+D30fVmoiYhIvlqqe645FyHtgwb5iHNkzieObfzMcQa4hxS05pEuHS5sMhJh3MC53cm+Q9dgxjvfsrBsGaZvA7Ov7jyMH1exIqhgwOzs15xze5viHfLLSpDpfP36SoUYyEFTLdgOtRDYhkNJmGkJ2NQ4Ma4YnakAA */
	id: "game",
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
			tags: ["SHOW_WORLD", "SHOW_OBJECTS", "SHOW_OTHER_TOONS", "SHOW_TOON"],
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
				save: {
					initial: "cooldown",
					states: {
						cooldown: {
							after: {
								2500: {
									target: "idle",
								},
							},
						},
						idle: {
							on: {
								SAVE_START: {
									target: "#game.saving",
								},
							},
						},
					},
					on: {
						KEY_PRESSED: {
							target: "save.cooldown",
						},
					},
				},
			},
		},
		saving: {
			tags: ["SHOW_WORLD", "SHOW_TOON", "SHOW_LOADING"],
			on: {
				SAVE_END: {
					target: "roaming",
				},
			},
		},
	},
});
