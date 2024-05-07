import { QueryClientProvider } from "@tanstack/react-query";
import {
	RouterProvider,
	createHashHistory,
	createRouter,
} from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { queryClient } from "./ao/lib/query";
import "./globals.css";
import { loadSw } from "./loadSw";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const hashHistory = createHashHistory();
// Create a new router instance
const router = createRouter({ routeTree, history: hashHistory });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

loadSw();

ReactDOM.createRoot(document.getElementById("app")!).render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>,
	// </React.StrictMode>,
);
