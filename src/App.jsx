import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./routes/Login";
import Registro from "./routes/Registro";
import Header from "./components/Header";
import { Provider } from "react-redux";
import {store} from './store/store'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify';
import AgregarGasto from "./routes/AgregarGasto";
import ListadoMovimientos from "./routes/ListadoMovimientos";
import AgregarIngreso from "./routes/AgregarIngreso";
import Analisis from "./routes/Analisis";
import MontosTotales from "./routes/MontosTotales";

function App() {
	return (
		<Provider store={store}>
			<ToastContainer />
			
			<div className="App">
				<Router>

					<Header />
					<Routes>
						<Route exact path="/" element={<Login />} />
						<Route exact path="/registro" element={<Registro />} />
						<Route exact path="/AgregarGasto" element={<AgregarGasto />} />
						<Route exact path="/AgregarIngreso" element={<AgregarIngreso />} />
						<Route exact path="/ListadoMovimientos" element={<ListadoMovimientos/>} />
						<Route exact path="/MontosTotales" element={<MontosTotales/>} />
						<Route exact path="/Analisis" element={<Analisis/>} />
					</Routes>
				</Router>
			</div>
		</Provider>
	);
}

export default App;
