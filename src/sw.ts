/// <reference lib="webworker" />

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

self.addEventListener("activate", (e) => {
	console.log("[Service Worker] Activate", e);
});

self.addEventListener("fetch", (e) => {
	const event = e as FetchEvent;
	console.log(`[Service Worker] Fetch ${event.request.url}`);

	event.respondWith(
		(async () => {
			return fetch(event.request);
		})(),
	);
});
