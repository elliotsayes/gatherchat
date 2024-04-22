import { QueryClientProvider } from "@tanstack/react-query";
import { GameLoader } from "./components/GameLoader";
import { queryClient } from "./lib/query";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<GameLoader />
		</QueryClientProvider>
	);
}

export default App;
