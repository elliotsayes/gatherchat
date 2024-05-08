# WEAVERS HACKERS GUIDE

Read this guide to get started with the project.

## Basic Instructions

Prerequisites:
- Node.js 21.x

Scripts:
- Install: `npm install`
- Run: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Test: `npm run test`

## Key libraries used
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- Game rendering: 
  - [pixi.js](https://pixijs.com/)
  - [@pixi/react](https://pixijs.io/pixi-react/)
  - [@pixi/react-animated](https://pixijs.io/pixi-react/react-spring/)
  - [@pixi/tilemap](https://github.com/pixijs/tilemap)
- [@tanstack/react-query](https://tanstack.com/query/latest)
- [@tanstack/react-router](https://tanstack.com/router/latest/)
- [@permaweb/aoconnect](https://cookbook_ao.g8way.io/guides/aoconnect/aoconnect.html)

## Important source files
- [Gather Chat aos process LUA code](process/gatherchat.lua) (process/gatherchat.lua)
  - Edit this to extend the game contract to add custom rooms, more profile options, etc
- [Gather Chat aos process JS interface](src/features/ao/lib/ao-gather.ts) (src/features/ao/lib/ao-gather.ts)
  - For interfacing with the game contract from the JS frontend
- [Contract loading logic](src/features/ao/components/GatherContractLoader.tsx) (src/features/ao/components/GatherContractLoader.tsx)
  - For controlling the load logic of the contract data
- [Wallet loading logic](src/features/ao/components/WalletLoader.tsx) (src/features/ao/components/WalletLoader.tsx)
  - For controlling how to load the user's wallet (e.g. via ArConnect)
- [Main game screen](src/components/layout/GatherChat.tsx) (src/components/layout/GatherChat.tsx)
  - The main game screen, which includes the game logic, world view, chat, profile view, etc. Modify this to change the main game screen view, or change the core functionality of the game (e.g. warping between worlds)
- [Game view rendering](src/features/render/components/RenderEngine.tsx) (src/features/render/components/RenderEngine.tsx)
  - The main world view rendering logic. Also handles player movement.
- [/game route](src/routes/game.lazy.tsx) (src/routes/game.lazy.tsx)
  - Route for loading and displaying the main game screen
- ["DecoratedRoom" world generator](src/features/worlds/DecoratedRoom.tsx) (src/features/worlds/DecoratedRoom.tsx)
  - Example of a custom paramaterizable world generator. Modify this to change the world generation logic, or use it as a template for creating new world generators
- [/render route (demo of DecoratedRoom)](src/routes/render.lazy.tsx) (src/routes/render.lazy.tsx)
  - Route for rendering a world using the DecoratedRoom generator. You can play with cusomize the parameters and see how it affects the world generation

## Acknowledgements
- [Atticus](https://github.com/atticusofsparta) for the original project idea + base LUA contract/TS Interface
- Avatar Generator: based on [pixeldudesmaker](https://masterpose.itch.io/pixelduuuuudesmaker) by [masterpose](https://masterpose.itch.io/), which is in turn based on [0x72's original version](https://0x72.itch.io/pixeldudesmaker)
- `drummondbass` for the original pixel art of tilesets and non-player sprites
- [Weavers](https://www.weaversofficial.com/) for running the hackathon!

## Licenses
- Original license for the generated pixel art used in this applicatoin's avatars:
```
PERMISSION IS GRANTED, FREE OF CHARGE, TO ANY PERSON, TO USE THE  ASSETS GENERATED WITH THE SOFTWARE IN ANY COMMERCIAL OR NON-COMMERCIAL  PROJECTS, GAME OR OTHERWISE, AS LONG AS THE ASSETS ARE NOT USED AS SO  CALLED NFTs (NON-FUNGIBLE TOKENS).
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT ANY KIND OF WARRANTY.
```
- The pixel art generator code itself is ["not released as licensed software"](https://itch.io/post/5408271)
- All original code is licensed under the [GPLv3 License](LICENSE)

---

# Original Readme Below

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
