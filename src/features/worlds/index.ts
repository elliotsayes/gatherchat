export const WorldTypes = ["room", "clubbeach"] as const;
export type WorldType = (typeof WorldTypes)[number];
