import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";
import { GameDemo } from "./components/GameDemo";
import { SetupForm } from "./components/SetupForm";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SetupForm onSubmit={(s) => console.log(s)} />
		</QueryClientProvider>
	);
}

export default App;
