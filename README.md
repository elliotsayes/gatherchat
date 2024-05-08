# WEAVERS HACKERS GUIDE

Read this guide to get started with the project.

## Basic Instructions

- Install: `npm install`
- Run: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Test: `npm run test`

## Important files
- [Gather Chat aos process LUA code](process/gatherchat.lua) (process/gatherchat.lua)
- [Gather Chat aos process JS interface](src/features/ao/lib/ao-gather.ts) (src/features/ao/lib/ao-gather.ts)
- [Contract loading logic](src/features/ao/components/GatherContractLoader.tsx) (src/features/ao/components/GatherContractLoader.tsx)
- [Wallet loading logic](src/features/ao/components/WalletLoader.tsx) (src/features/ao/components/WalletLoader.tsx)
- [Main game screen](src/components/layout/GatherChat.tsx) (src/components/layout/GatherChat.tsx)
- [Game view rendering](src/features/render/components/RenderEngine.tsx) (src/features/render/components/RenderEngine.tsx)
- [#/game route](src/routes/game.lazy.tsx) (src/routes/game.lazy.tsx)
- [#/render route (demo of RoomLayout)](src/routes/render.lazy.tsx) (src/routes/render.lazy.tsx)


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
