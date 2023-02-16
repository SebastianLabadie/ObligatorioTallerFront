import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./routes/Login";
import Registro from "./routes/Registro";
import Header from "./components/Header";
import { Provider } from "react-redux";
import {store} from './store/store'


function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<Router>

					<Header />
					<Routes>
						<Route exact path="/" element={<Login />} />
						<Route exact path="/registro" element={<Registro />} />
						{/* <Route path="/about">
							<About />
						</Route>
						<Route path="/dashboard">
							<Dashboard />
						</Route> */}
					</Routes>
				</Router>
			</div>
		</Provider>
	);
}

export default App;
