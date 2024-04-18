/// <reference lib="webworker" />

import { buildGenerator } from "./sprite/generate";

self.addEventListener(
	"message",
	({ data }) => {
		console.log("[Service Worker] Message", data);
		self.postMessage("pong");
	},
	false,
);

let baseTex: ImageBitmap;
let partTex: ImageBitmap;

self.addEventListener("install", (e) => {
	console.log("[Service Worker] Install", e);
});

self.addEventListener("activate", (e) => {
	const event = e as ExtendableEvent;
	console.log("[Service Worker] Activate", e);

	event.waitUntil(
		(async () => {
			console.log("[Service Worker] Loading assets");
			baseTex = await fetch("src/assets/sprite/base.png")
				.then((r) => r.blob())
				.then((b) => createImageBitmap(b));
			partTex = await fetch("src/assets/sprite/parts.png")
				.then((r) => r.blob())
				.then((b) => createImageBitmap(b));
		})(),
	);
});

self.addEventListener("fetch", (e) => {
	const event = e as FetchEvent;
	console.log(`[Service Worker] Fetch ${event.request.url}`);

	event.respondWith(
		(async () => {
			const url = new URL(event.request.url);
			console.log(url.pathname);
			if (url.pathname.match(/^\/api\/sprite\/generate/)) {
				console.log("[Service Worker] Generating sprite");

				const seed = url.searchParams.get("seed")!;
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
