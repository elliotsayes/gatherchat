export const config = {
	arseedingUrl: import.meta.env.VITE_CONFIG_ARSEEDING_URL,
	arseedingDefaultSymbol: import.meta.env.VITE_CONFIG_ARSEEDING_DEFAULT_SYMBOL,
	bundlerUrl: import.meta.env.VITE_CONFIG_BUNDLER_URL,
	uploader: import.meta.env.VITE_CONFIG_UPLOADER ?? "turbo",
	rendererArns: import.meta.env.VITE_CONFIG_RENDERER_ARNS as string,
	defaultRendererTxId: import.meta.env.VITE_CONFIG_RENDERER_TX_ID as
		| string
		| undefined,
};
