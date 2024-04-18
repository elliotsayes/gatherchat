import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { randomSeed } from "./sprite/edit"

function App() {
	const [seed, setSeed] = useState("a011b080d050300");

	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} />
				<button onClick={() => setSeed(randomSeed())}>Random</button><br />
				{
					<img src={`api/sprite/generate?seed=${seed}`}></img>
				}
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
