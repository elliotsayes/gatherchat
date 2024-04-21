import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";
import { GameDemo } from "./components/GameDemo";
import { SetupForm } from "./components/SetupForm";
import { SidePanel, type SidePanelState } from "./components/SidePanel";
import { useState } from "react";

function App() {
	const [state, setState] = useState<SidePanelState>("feed");

	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<SidePanel state={state} onSelectState={setState} />
				<SetupForm onSubmit={(s) => console.log(s)} />
			</div>
		</QueryClientProvider>
	);
}

export default App;
