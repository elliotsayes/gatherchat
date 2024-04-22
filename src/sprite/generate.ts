// const baseTex: HTMLImageElement = new Image();
// baseTex.src = "base.png";
// const partTex: HTMLImageElement = new Image();
// partTex.src = "parts.png";
// const generate = buildGenerator(baseTex, partTex);
// const sprite = generate("seed");

import { type ColorSelections, colorThemes, pad2 } from "./shared";

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
		if (t === 4 && r === 2) {
			if (a === 1) {
				if (e === 1) {
					draw16(ctx, e * 16, a * 24 + 1, partTex, 4, 4);
					c = true;
				} else if (e === 2) {
					draw16(ctx, e * 16, a * 24 + 2, partTex, 5, 4);
					c = true;
				} else if (e === 3) {
					draw16(ctx, e * 16, a * 24 + 1, partTex, 4, 4);
					c = true;
				}
			} else if (a === 3) {
				draw16(ctx, e * 16, a * 24 + EYES_ORIGINS[3][e], partTex, 4, 4);
				c = true;
			}
		} else if (t === 6 && r === 0) {
			if (a === 1 && (e === 1 || e === 3)) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[1][e], partTex, 6, 4);
				c = true;
			} else if (a === 1 && e === 2) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[1][e], partTex, 7, 4);
				c = true;
			} else if (a === 2 && e === 3) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[1][e], partTex, 6, 4);
				c = true;
			} else if (a === 3 && e === 2) {
				draw16(ctx, e * 16, a * 24 + 2, partTex, 8, 4);
				c = true;
			} else if (a === 3 && (e === 5 || e === 3)) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[3][e], partTex, 6, 4);
				c = true;
			} else if (a === 3 && e === 4) {
				draw16(ctx, e * 16, a * 24 + HEAD_ORIGINS[3][e], partTex, 7, 4);
				c = true;
			} else if (a === 3 && e === 1) {
				draw16(ctx, e * 16, a * 24 + 2, partTex, 9, 4);
				c = true;
			}
		} else if (t === 8 && r === 3) {
			if ((e === 1 || e === 3) && a === 3) {
				draw16(ctx, e * 16, a * 24 + EYES_ORIGINS[3][e], partTex, 10, 4);
				c = true;
			}
			if (e === 2 && a === 3) {
				draw16(ctx, e * 16, a * 24 + EYES_ORIGINS[3][e], partTex, 11, 4);
				c = true;
			}
		} else if (t === 13 && (r === 0 || r === 1)) {
			drawShape(ctx, e, a, 6, r, n);
			drawShape(ctx, e, a, 12, r, n);
			c = true;
		} else if (t === 14 && (r === 0 || r === 1)) {
			drawShape(ctx, e, a, 10, r, n);
			drawShape(ctx, e, a, 12, r, n);
			c = true;
		} else if (t === 15 && (r === 0 || r === 1)) {
			drawShape(ctx, e, a, 7, r, n);
			drawShape(ctx, e, a, 12, r, n);
			c = true;
		} else if (t === 23 && (r === 0 || r === 1)) {
			drawShape(ctx, e, a, 6, r, n);
			drawShape(ctx, e, a, 22, r, n);
			c = true;
		} else if (t === 24 && (r === 0 || r === 1)) {
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
		_: number,
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

	function hexToArr(e: string) {
		return [
			Number.parseInt(e.slice(0, 2), 16),
			Number.parseInt(e.slice(2, 4), 16),
			Number.parseInt(e.slice(4, 6), 16),
		];
	}

	function applyTheme(e: Uint8ClampedArray, a: string[], t: string[]) {
		for (let r = 0; r < a.length; r++) {
			const n = a[r];
			const c = hexToArr(t[r]);
			for (let i = 0; i < e.length; i += 4) {
				const o = pad2(e[i]) + pad2(e[i + 1]) + pad2(e[i + 2]);
				if (e[i + 3] === 255 && o === n) {
					e[i + 0] = c[0];
					e[i + 1] = c[1];
					e[i + 2] = c[2];
				}
			}
		}
	}

	return generate;
}

export function deserialize(e: string): number[] {
	return e
		.slice(1)
		.match(/.{1,2}/g)
		?.map((e) => Number.parseInt(e, 16));
}

const HEAD_ORIGINS = [
	[0],
	[0, 1, 2, 1],
	[-1, -2, 0, 1],
	[-1, -1, -1, 1, 2, 1, 0],
];
const EYES_ORIGINS = HEAD_ORIGINS;

const srcCanvasWidth = 16 * 7;
const srcCanvasHeight = 24 * 4;
