import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { URL_BASE } from "../utils/utils";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { setLogin, setUserData } from "../features/usuarioSlice";

export default function Registro() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [Departamentos, setDepartamentos] = useState([]);
	const [Departamento, setDepartamento] = useState(0);

	const [Ciudades, setCiudades] = useState([]);
	const [Ciudad, setCiudad] = useState("");

	const [usuario, setUsuario] = useState("");
	const [password, setPassword] = useState("");

	const handleChangeUsuario = (e) => {
		
		setUsuario(e.target.value);
	};

	const handleChangePassword = (e) => {
		setPassword(e.target.value);
	};

	useEffect(() => {
		getDepartamentos();
	}, []);

	useEffect(() => {
		getCiudades();
	}, [Departamento]);

	const getDepartamentos = async () => {
		try {
			const res = await axios.get(`${URL_BASE}departamentos.php`);
			const depMapped = res.data.departamentos.map((item) => {
				return { value: item.id, label: item.nombre };
			});
			setDepartamentos(depMapped);
		} catch (error) {}
	};

	const getCiudades = async () => {
		
		if (Departamento > 0) {
			try {
				const res = await axios.get(`${URL_BASE}ciudades.php?idDepartamento=${Departamento}`);
				const ciuMapped = res.data.ciudades.map((item) => {
					return { value: item.id, label: item.nombre };
				});
				ciuMapped.unshift({ value: 0, label: "Seleccione una ciudad" });
				setCiudades(ciuMapped);
				setCiudad(0)
			} catch (error) {}
		}
	};

	const RegistrarUsr = async () => {
		const camposValidos = validarCampos();

		if (camposValidos) {
			try {
				const req = {
					usuario: usuario,
					password: password,
					idDepartamento: Departamento,
					idCiudades: Ciudad,
				};
				const res = await axios.post(`${URL_BASE}usuarios.php`, req);
				if (res.data.codigo === 200) {
					toast.success("Usuario Registrado con exito");
					window.localStorage.setItem("user",usuario)
					window.localStorage.setItem("password",password)
					handleClickLogin();
				} else {
					toast.error(res.data.mensaje);
				}
			} catch (error) {
				if (error.response.data.mensaje) {
					toast.error(error.response.data.mensaje);
				} else {
					toast.error(error.message);
				}
			}
		}
	};



	const validarCampos = () => {
		if (!usuario) {
			toast.error("El usuario es requerido");
			return false;
		}
		if (!password) {
			toast.error("La contraseña es requerida");
			return false;
		}
		if (!Departamento) {
			toast.error("El Departamento es requerido");
			return false;
		}
		if (!Ciudad) {
			toast.error("La Ciudad es requerida");
			return false;
		}
		return true;
	};

	const handleClickLogin = async ()=>{
		
			try {
				
				const req={
					usuario:window.localStorage.getItem("user"),
					password:window.localStorage.getItem("password")
				}
				const res = await axios.post(`${URL_BASE}login.php`,req)
	
	
				if (res.data.codigo === 200) {
					//setear api key para futuras request
					axios.defaults.headers.common['apiKey'] = ''+res.data.apiKey;
				
					//guardar info de usuario en redux
					dispatch(setUserData({...res.data}))
	
					//marcar usuario como logueado
					dispatch(setLogin(true))
	
					//redireccionar a home
					navigate('/AgregarGasto')
	
				}
				
				
			} catch (error) {
				if (error.response.data.mensaje) {
					toast.error(error.response.data.mensaje)
				}else{
					toast.error(error.message)
				}
			}
		}
	

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Crear un Usuario
						</h1>
						<div className="space-y-4 md:space-y-6">
							<div>
								<label htmlFor="usuario" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Usuario
								</label>
								<input
									type="text"
									name="usuario"
									id="usuario"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Pepe_1234"
									required=""
									onChange={handleChangeUsuario}
									value={usuario}
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Contraseña
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
									onChange={handleChangePassword}
									value={password}
								/>
							</div>
							<label
								htmlFor="Departamento"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Departamento
							</label>

							<Select
								defaultValue={Departamento}
								placeholder="Seleccione Departamento"
								onChange={(e) => {
									setDepartamento(e.value);
								}}
								options={Departamentos}
							/>

							<div></div>
							<label htmlFor="ciudad" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Ciudad
							</label>

							<Select
								defaultValue={Ciudad}
								placeholder="Seleccione Ciudad"
								onChange={(e) => {
									setCiudad(e.value);
								}}
								options={Ciudades}
							/>

							<div></div>

							<button
								type="button"
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								onClick={() => RegistrarUsr()}
							>
								Crear Cuenta
							</button>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Tienes una cuenta?{" "}
								<Link to={"/"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
									Inicia Sesión
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
