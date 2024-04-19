import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";
import { GameDemo } from "./components/GameDemo";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<GameDemo />
		</QueryClientProvider>
	);
}

export default App;
