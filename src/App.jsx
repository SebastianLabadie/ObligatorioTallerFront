import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./routes/Login";
import Registro from "./routes/Registro";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<Router>
				<div>
					<ul>
						<li>
							<Link to="/">Iniciar Sesion</Link>
						</li>
						<li>
							<Link to="/registro">Registrarse</Link>
						</li>
					</ul>

					<hr />

					
					
					<Routes>
						<Route exact path="/" element={<Login/>} />
						<Route exact path="/registro" element={<Registro/>} />
						{/* <Route path="/about">
							<About />
						</Route>
						<Route path="/dashboard">
							<Dashboard />
						</Route> */}
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
