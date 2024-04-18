// const baseTex: HTMLImageElement = new Image();
// baseTex.src = "base.png";
// const partTex: HTMLImageElement = new Image();
// partTex.src = "parts.png";
// const generate = buildGenerator(baseTex, partTex);
// const sprite = generate("seed");

export function buildGenerator(
	baseTex: CanvasImageSource,
	partTex: CanvasImageSource,
) {
	async function generate(seed: string) {
		const selections = deserialize(seed);

		const faceSelection = selections[0];
		const headSelection = selections[1];
		const colorSelections: ColorSelections = new Map([
			["eyes", selections[2]],
			["skin", selections[3]],
			["suit", selections[4]],
			["item", selections[5]],
			["hair", selections[6]],
		]);

		const srcCanvas = new OffscreenCanvas(srcCanvasWidth, srcCanvasHeight);
		const srcCtx = srcCanvas.getContext("2d")!;

		srcCtx.drawImage(baseTex, 0, 0);
		recalcVal(srcCtx, faceSelection, EYES_ORIGINS.length, 3, EYES_ORIGINS);
		recalcVal(srcCtx, headSelection, HEAD_ORIGINS.length, 0, HEAD_ORIGINS);
		recalcVal(srcCtx, headSelection, EYES_ORIGINS.length, 1, HEAD_ORIGINS);
		recalcVal(srcCtx, faceSelection, EYES_ORIGINS.length, 2, EYES_ORIGINS);
		recolorAll(srcCtx, colorSelections);

		return await srcCanvas.convertToBlob({ type: "image/png" });
	}

	function deserialize(e: string) {
		return e
			.slice(1)
			.match(/.{1,2}/g)
			.map((e) => parseInt(e, 16));
	}

	function draw16(
		ctx: OffscreenCanvasRenderingContext2D,
		a: number,
		t: number,
		r: CanvasImageSource,
		n: number,
		c: number,
	) {
		const i = 16;
		const o = 20;
		const d = 4;
		ctx.drawImage(r, (n || 0) * i, (c || 0) * o, i, o, a, t + d, i, o);
	}

	function drawShape(
		ctx: OffscreenCanvasRenderingContext2D,
		e: number,
		a: number,
		t: number,
		r: number,
		n: number[],
	) {
		let c = false;
		if (t == 4 && r == 2) {
			if (a == 1) {
				if (a == 2 && e == 2) {
					draw16(ctx, e * 16, a * 24 + 0, partTex, 4, 4);
					c = true;
				} else if (a == 1 && e == 1) {
					draw16(ctx, e * 16, a * 24 + 1, partTex, 4, 4);
					c = true;
				} else if (a == 1 && e == 2) {
					draw16(ctx, e * 16, a * 24 + 2, partTex, 5, 4);
					c = true;
				} else if (a == 1 && e == 3) {
					draw16(ctx, e * 16, a * 24 + 1, partTex, 4, 4);
					c = true;
				}
			} else if (a == 3) {
				draw16(ctx, e * 16, a * 24 + EYES_ORIGINS[3][e], partTex, 4, 4);
				c = true;
			}
		} else if (t == 6 && r == 0) {
			if (a == 1 && (e == 1 || e == 3)) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[1][e], partTex, 6, 4);
				c = true;
			} else if (a == 1 && e == 2) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[1][e], partTex, 7, 4);
				c = true;
			} else if (a == 2 && e == 3) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[1][e], partTex, 6, 4);
				c = true;
			} else if (a == 3 && e == 2) {
				draw16(ctx, e * 16, a * 24 + 2, partTex, 8, 4);
				c = true;
			} else if (a == 3 && (e == 5 || e == 3)) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[3][e], partTex, 6, 4);
				c = true;
			} else if (a == 3 && e == 4) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[3][e], partTex, 7, 4);
				c = true;
			} else if (a == 3 && e == 1) {
				draw16(ctx, e * 16, a * 24 + 2, partTex, 9, 4);
				c = true;
			}
		} else if (t == 8 && r == 3) {
			if ((e == 1 || e == 3) && a == 3) {
				draw16(ctx, e * 16, a * 24 + EYES_ORIGINS[3][e], partTex, 10, 4);
				c = true;
			}
			if (e == 2 && a == 3) {
				draw16(ctx, e * 16, a * 24 + EYES_ORIGINS[3][e], partTex, 11, 4);
				c = true;
			}
		} else if (t == 13 && (r == 0 || r == 1)) {
			drawShape(ctx, e, a, 6, r, n);
			drawShape(ctx, e, a, 12, r, n);
			c = true;
		} else if (t == 14 && (r == 0 || r == 1)) {
			drawShape(ctx, e, a, 10, r, n);
			drawShape(ctx, e, a, 12, r, n);
			c = true;
		} else if (t == 15 && (r == 0 || r == 1)) {
			drawShape(ctx, e, a, 7, r, n);
			drawShape(ctx, e, a, 12, r, n);
			c = true;
		} else if (t == 23 && (r == 0 || r == 1)) {
			drawShape(ctx, e, a, 6, r, n);
			drawShape(ctx, e, a, 22, r, n);
			c = true;
		} else if (t == 24 && (r == 0 || r == 1)) {
			drawShape(ctx, e, a, 7, r, n);
			drawShape(ctx, e, a, 22, r, n);
			c = true;
		}
		if (!c) {
			draw16(ctx, e * 16, a * 24 + n[e], partTex, t, r);
		}
	}

	function recalcVal(
		ctx: OffscreenCanvasRenderingContext2D,
		selectionIndex: number,
		a: number,
		t: number,
		r: number[][],
	) {
		for (let y = 0; y < r.length; y++) {
			const n = r[y];
			for (let x = 0; x < n.length; x++) {
				drawShape(ctx, x, y, selectionIndex, t, n);
			}
		}
	}

	function recolorAll(
		ctx: OffscreenCanvasRenderingContext2D,
		colorSelections: ColorSelections,
	) {
		const e = ctx.getImageData(0, 0, srcCanvasWidth, srcCanvasHeight);
		const a = e.data;
		for (let t = 0; t < colorThemes.length; t++) {
			const r = colorThemes[t];
			const n = r.options[colorSelections.get(r.key)!];
			applyTheme(a, r.defaults, n);
		}
		ctx.putImageData(e, 0, 0);
	}

	function pad2(e: number) {
		return ("00" + e.toString(16)).slice(-2);
	}

	function hexToArr(e: string) {
		return [
			parseInt(e.slice(0, 2), 16),
			parseInt(e.slice(2, 4), 16),
			parseInt(e.slice(4, 6), 16),
		];
	}

	function applyTheme(e: Uint8ClampedArray, a: string[], t: string[]) {
		for (let r = 0; r < a.length; r++) {
			const n = a[r];
			const c = hexToArr(t[r]);
			for (let i = 0; i < e.length; i += 4) {
				const o = pad2(e[i]) + pad2(e[i + 1]) + pad2(e[i + 2]);
				if (e[i + 3] == 255 && o === n) {
					e[i + 0] = c[0];
					e[i + 1] = c[1];
					e[i + 2] = c[2];
				}
			}
		}
	}

	return generate;
}

const SHAPE_OPTIONS = [
	{ key: "face", y: 2, max: 25 }, //13 default
	{ key: "head", y: 0, max: 44 }, //28 default
];

const colorCategories = ["eyes", "skin", "suit", "item", "hair"] as const;
type ColorSelections = Map<string, number>;

const ANIMATIONS = {
	no_anim: { len: 1, y: 0 },
	idle: { len: 4, y: 1 },
	run: { len: 4, y: 2 },
	jump: { len: 7, y: 3 },
};
const HEAD_ORIGINS = [
	[0],
	[0, 1, 2, 1],
	[-1, -2, 0, 1],
	[-1, -1, -1, 1, 2, 1, 0],
];
const EYES_ORIGINS = HEAD_ORIGINS;

const itemOptions = [
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
const colorThemes = [
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

const srcCanvasWidth = 16 * 7;
const srcCanvasHeight = 24 * 4;
