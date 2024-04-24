import ReactDOM from "react-dom/client";
import "./globals.css";
import { loadSw } from "./loadSw";
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

loadSw();

ReactDOM.createRoot(document.getElementById("app")!).render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
	// </React.StrictMode>,
);
