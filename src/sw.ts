/// <reference lib="webworker" />

import { buildGenerator } from "./features/avatar/lib/generateAvatar";
import { buildLlamaGenerator } from "./features/avatar/lib/generateLlama";

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
  console.log(assets);
  const cache = await caches.open(assetsCacheName);
  console.log("llama_ao: ", await caches.has(assets[0]))
  console.log("parts: ", await caches.has(assets[1]));
  console.log(cache);
  const requests = assets.map((asset) => cache.match(asset)!);
  console.log(requests);
  return await Promise.all(requests);
}

async function responseToBitmap(response: Response) {
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  return bitmap;
}

const assetPaths = ["assets/sprite/avatar/base.png", "assets/sprite/avatar/parts.png"]
const llamaPaths = ["assets/sprite/avatar/llama_ao.png", 
    "assets/sprite/avatar/llama_burgerKing.png",
    "assets/sprite/avatar/llama_dumdum_v1.png",
    "assets/sprite/avatar/llama_base_v1.png"]


self.addEventListener("activate", (e) => {
  const event = e as ExtendableEvent;
  console.log("[Service Worker] Activate", e);

  event.waitUntil(
    (async () => {
      await cacheAssets(assetPaths);
      await cacheAssets(llamaPaths);
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

      if (url.pathname.match(/^\/api\/sprite\/generate\/llama/)) {
        console.log("[Service Worker] Generating a llama sprite!");

        const seed = url.searchParams.get("seed")!;
        let x = BigInt('0x' + seed);
        const index = Number(x % BigInt(4));
        const assets = await retrieveAssets(llamaPaths);
        const baseTex = await responseToBitmap(assets[index]!);
        const partTex = await responseToBitmap(assets[3-index]!); // unused
        const spriteBlob = await buildLlamaGenerator(baseTex, partTex)(seed);

        return new Response(spriteBlob, {
          headers: {
            "Content-Type": "image/png",
          },
        });
      } else if (url.pathname.match(/^\/api\/sprite\/generate\/avatar/)) {
        console.log("[Service Worker] Generating sprite");

        const seed = url.searchParams.get("seed")!;

        const assets = await retrieveAssets(assetPaths);
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
