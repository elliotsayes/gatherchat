import { QueryClientProvider } from "@tanstack/react-query";
import { GameDemo } from "./components/GameDemo";
import { queryClient } from "./lib/query";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<GameDemo />
		</QueryClientProvider>
	);
}

export default App;
