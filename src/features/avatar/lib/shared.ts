export const SHAPE_OPTIONS = [
    { key: "face", y: 2, max: 25 }, //13 default
    { key: "head", y: 0, max: 44 }, //28 default
];

export const colorCategories = [
    "eyes",
    "skin",
    "suit",
    "item",
    "hair",
] as const;
export type ColorSelections = Map<string, number>;

export const itemOptions = [
    //[Medium, Dark, Light]
    ["91804c", "726641", "b9a156"],
    ["ccaa44", "aa6622", "c89437"],
    ["facb3e", "ee8e2e", "fdf7ed"],
    ["d04648", "aa3333", "caacac"],
    ["a9b757", "828a58", "c1cd74"],
    ["4ba747", "3d734f", "79f874"],
    ["f0f0dd", "d1d1c2", "fdfdfb"],
    ["944a9c", "5a3173", "ae68b6"],
    ["447ccf", "3d62b3", "69b7d8"],
    ["72d6ce", "5698cc", "fdf7ed"],
    ["3e3e3e", "353535", "434343"],
];
export const colorThemes = [
    {
        key: "eyes",
        defaults: ["ee7755"],
        options: [
            ["222033"],
            ["178178"],
            ["7722ab"],
            ["346524"],
            ["5a8ca6"],
            ["fafafa"],
            ["ababab"],
            ["751f20"],
            ["da4e38"],
            ["000000"],
        ],
    },
    {
        key: "skin",
        defaults: ["cccc77", "aaaa55", "888844"],
        options: [
            //[Light, Medium, Dark],
            ["cccc77", "aaaa55", "888844"],
            ["f0f0dd", "d1d1c2", "b1b1b1"],
            ["ccccbe", "877d78", "675d58"],
            ["e6d1bc", "d9af83", "b98f73"],
            ["cb9f76", "af8055", "8f6035"],
            ["a47d5b", "7c5e46", "5c3e56"],
            ["7a3333", "56252f", "36051f"],
            ["686e46", "505436", "303416"],
            ["dcb641", "aa6622", "8a4602"],
            ["72b8e4", "5d96ba", "3d76aa"],
            ["aa4951", "8a344d", "6a142d"],
            ["887777", "554444", "775555"],
            ["434343", "353535", "3e3e3e"],
            ["6cb832", "3c8802", "4c9812"],
        ],
    },
    { key: "suit", defaults: ["7722aa", "552277"], options: itemOptions },
    {
        key: "item",
        defaults: ["dd77bb", "aa5599", "eebbee"],
        options: itemOptions,
    },
    {
        key: "hair",
        defaults: ["eeeeee", "cccccc"],
        options: [
            ["ebebeb", "c7c7c7"],
            ["e4da99", "d9c868"],
            ["b62f31", "751f20"],
            ["cc7733", "bb5432"],
            ["4d4e4c", "383839"],
        ],
    },
];

export function pad2(e: number) {
    return `00${e.toString(16)}`.slice(-2);
}
