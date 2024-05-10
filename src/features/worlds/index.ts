export const WorldTypes = ["decoratedRoom", "clubbeach"] as const;
export type WorldType = (typeof WorldTypes)[number];
