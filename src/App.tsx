import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";
import Home from "./Home";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

export default App;
