/// <reference lib="webworker" />

import { buildGenerator } from "./features/avatar/lib/generate";

self.addEventListener(
	"message",
	({ data }) => {
		console.log("[Service Worker] Message", data);
		self.postMessage("pong");
	},
	false,
);

self.addEventListener("install", (e) => {
	console.log("[Service Worker] Install", e);
});

const assetsCacheName = "assets_v1";

async function cacheAssets(assets: string[]) {
	try {
		const cache = await caches.open(assetsCacheName);
		console.log("[Service Worker] Caching assets");
		for (const asset of assets) {
			const res = await fetch(asset);
			await cache.put(asset, res);
		}
	} catch (error) {
		console.error(error);
	}
}

async function retrieveAssets(assets: string[]) {
	const cache = await caches.open(assetsCacheName);
	const requests = assets.map((asset) => cache.match(asset)!);
	return await Promise.all(requests);
}

async function responseToBitmap(response: Response) {
	const blob = await response.blob();
	const bitmap = await createImageBitmap(blob);
	return bitmap;
}

self.addEventListener("activate", (e) => {
	const event = e as ExtendableEvent;
	console.log("[Service Worker] Activate", e);

	event.waitUntil(
		(async () => {
			await cacheAssets(["assets/sprite/base.png", "assets/sprite/parts.png"]);
			console.log("[Service Worker] Cached assets");
		})(),
	);
});

self.addEventListener("fetch", (e) => {
	const event = e as FetchEvent;
	console.log(`[Service Worker] Fetch ${event.request.url}`);

	event.respondWith(
		(async () => {
			const url = new URL(event.request.url);

			if (url.pathname.match(/^\/api\/sprite\/generate/)) {
				console.log("[Service Worker] Generating sprite");

				const seed = url.searchParams.get("seed")!;

				const assets = await retrieveAssets([
					"assets/sprite/base.png",
					"assets/sprite/parts.png",
				]);
				const baseTex = await responseToBitmap(assets[0]!);
				const partTex = await responseToBitmap(assets[1]!);
				const spriteBlob = await buildGenerator(baseTex, partTex)(seed);

				return new Response(spriteBlob, {
					headers: {
						"Content-Type": "image/png",
					},
				});
			}

			return fetch(event.request);
		})(),
	);
});
