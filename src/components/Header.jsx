import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setUserData,setLogin } from "../features/usuarioSlice";

export default function Header() {
	const dispatch = useDispatch();
	const { isLoged } = useSelector((state) => state.usuario);
	const location = useLocation()
	const navigate = useNavigate()
	const handleToggle = () => {
		const navContent = document.getElementById("nav-content");
		navContent.classList.toggle("hidden");
	};

	const handleClickLogOut = () => {
		dispatch(setLogin(false));
		dispatch(setUserData({}));
		navigate('/')
	}


	useEffect(()=>{
		console.log(`locatiion `,location.pathname)
	},[])

	return (
		<nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6 relative w-full z-10 top-0">
			<div className="flex items-center flex-shrink-0 text-white mr-6">
				<a className="text-white no-underline hover:text-white hover:no-underline" href="#">
					<span className="text-2xl pl-2">
						<i className="em em-grinning"></i> Finanzas Personales
					</span>
				</a>
			</div>

			<div className="block lg:hidden">
				<button
					id="nav-toggle"
					onClick={handleToggle}
					className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-white hover:border-white"
				>
					<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>

			<div className="w-full flex-grow lg:items-center lg:w-auto hidden lg:block  pt-6 lg:pt-0" id="nav-content">
				<ul className="list-reset lg:flex justify-end flex-1 items-center">
					{!isLoged ? (
						<>
							{/* MENUES CUANDO NO ESTA LOGEADO */}
							<li className="mr-3">
								<Link
									className={
										location.pathname == "/"
											? "inline-block py-2 px-4 text-white no-underline"
											: "inline-block py-2 px-4 text-gray-600 no-underline hover:text-gray-200 hover:text-underline"
									}
									to="/"
								>
									Iniciar Sesion
								</Link>
							</li>
							<li className="mr-3">
								<Link
									className={
										location.pathname == "/registro"
											? "inline-block py-2 px-4 text-white no-underline"
											: "inline-block py-2 px-4 text-gray-600 no-underline hover:text-gray-200 hover:text-underline"
									}
									to="/registro"
								>
									Registrarse
								</Link>
							</li>
						</>
					) : (
						<>
							{/* MENUES CUANDO ESTA LOGEADO */}
							<li className="mr-3">
								<Link
									className={
										location.pathname == "/AgregarGasto"
											? "inline-block py-2 px-4 text-white no-underline"
											: "inline-block py-2 px-4 text-gray-600 no-underline hover:text-gray-200 hover:text-underline"
									}
									to="/AgregarGasto"
								>
									Agregar Gasto
								</Link>
							</li>
							<li className="mr-3">
								<Link
									className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4"
									href="#"
								>
									Agregar Ingreso
								</Link>
							</li>
							<li className="mr-3">
							<Link
									className={
										location.pathname == "/ListadoMovimientos"
											? "inline-block py-2 px-4 text-white no-underline"
											: "inline-block py-2 px-4 text-gray-600 no-underline hover:text-gray-200 hover:text-underline"
									}
									to="/ListadoMovimientos"
								>
									Listado Movimientos
								</Link>
							</li>
							<li className="mr-3">
								<Link
									className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4"
									href="#"
								>
									Montos Totales
								</Link>
							</li>
							<li className="mr-3">
								<Link
									className="inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline py-2 px-4"
									href="#"
								>
									Análisis
								</Link>
							</li>
							<li className="mr-3 inline-block text-gray-600 no-underline hover:text-gray-200 hover:text-underline hover:cursor-pointer py-2 px-4" onClick={handleClickLogOut}>
									
									Cerrar Sesion
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
}
