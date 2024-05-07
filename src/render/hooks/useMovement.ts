import type { Position } from "@/_old/lib/model";
import { type Reducer, useCallback, useReducer, useState } from "react";

export const movementKeys = [
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"w",
	"s",
	"a",
	"d",
	"W",
	"S",
	"A",
	"D",
] as const;
export type MovementKey = (typeof movementKeys)[number];

export const movementDirections = ["up", "down", "left", "right"] as const;
export type MovementDirection = (typeof movementDirections)[number];

export const keyToMovementMap: Record<MovementKey, MovementDirection> = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	w: "up",
	s: "down",
	a: "left",
	d: "right",
	W: "up",
	S: "down",
	A: "left",
	D: "right",
} as const;

export const faceDirections = ["left", "right"] as const;
export type FaceDirection = (typeof faceDirections)[number];

export function calculateNextPosition(
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

type ActiveMovementState = {
	state: "idle" | "moving";
	queuedDirection?: MovementDirection;
};

type ActiveMovementEvent =
	| {
			type: "move";
			direction: MovementDirection;
	  }
	| {
			type: "stop";
	  };

const activeMovementReducer =
	({
		execute,
		stop,
	}: {
		execute: (direction: MovementDirection) => void;
		stop: () => void;
	}): Reducer<ActiveMovementState, ActiveMovementEvent> =>
	(movementState: ActiveMovementState, movementEvent: ActiveMovementEvent) => {
		switch (movementState.state) {
			case "idle": {
				switch (movementEvent.type) {
					case "move": {
						execute(movementEvent.direction);

						setTimeout(() => {
							stop();
						}, 200);

						return {
							state: "moving",
						};
					}
				}
				break;
			}
			case "moving": {
				switch (movementEvent.type) {
					case "stop": {
						if (movementState.queuedDirection) {
							execute(movementState.queuedDirection);

							setTimeout(() => {
								stop();
							}, 200);

							return {
								state: "moving",
								queuedDirection: undefined,
							};
						}
						return {
							state: "idle",
						};
					}
					case "move": {
						return {
							state: "moving",
							queuedDirection: movementEvent.direction,
						};
					}
				}
			}
		}
		return movementState;
	};

export function useMovement({
	localPosition,
	onPositionUpdate,
	collision,
}: {
	localPosition: Position;
	onPositionUpdate: (args: {
		newPosition?: Position;
		newDirection?: FaceDirection;
	}) => void;
	collision: (args: Position) => boolean;
}) {
	const executeMovement = useCallback(
		(direction: MovementDirection) => {
			// @ts-expect-error
			const newDirection = faceDirections.includes(direction)
				? (direction as FaceDirection)
				: undefined;
			const newPosition = calculateNextPosition(localPosition, direction);

			if (collision(newPosition)) return;

			onPositionUpdate({
				newPosition,
				newDirection,
			});
		},
		[localPosition, onPositionUpdate, collision],
	);

	const stopMovement = useCallback(() => {
		movementDispatch({ type: "stop" });
	}, []);

	const [_, movementDispatch] = useReducer(
		activeMovementReducer({ execute: executeMovement, stop: stopMovement }),
		{
			state: "idle",
		},
	);

	return (direction: MovementDirection) =>
		movementDispatch({ type: "move", direction });
}
