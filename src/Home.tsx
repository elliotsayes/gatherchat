import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./Home.css";
import { randomSeed } from "./sprite/edit";
import { PixiTest } from "./components/PixiTest";

function Home() {
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
				<input
					type="text"
					value={seed}
					onChange={(e) => setSeed(e.target.value)}
				/>
				<button onClick={() => setSeed(randomSeed())}>Random</button>
				<br />
				<img src={`/api/sprite/generate?seed=${seed}`} width={400} style={{"image-rendering": "pixelated"}}></img>
				<br />
				<PixiTest seed={seed} />
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default Home;
