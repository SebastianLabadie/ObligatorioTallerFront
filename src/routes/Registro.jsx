import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMenuActivo } from "../features/menuSlice";

export default function Registro() {
	const dispatch = useDispatch();
	const [Departamentos,setDepartamentos] = useState([]);
	const [Departamento,setDepartamento] = useState("");
	
	const [Ciudades,setCiudades] = useState([]);
	const [Ciudad,setCiudad] = useState("");

	const [usuario, setUsuario] = useState('')
	const [password, setPassword] = useState('')

	const handleChangeUsuario = (e)=>{
		console.log(e.target.value)
		setUsuario(e.target.value)
	}

	const handleChangePassword = (e)=>{
		console.log(e.target.value)
		setPassword(e.target.value)
	}

	useEffect(() => {
		
		dispatch(setMenuActivo("REGISTRO"));
		getDepartamentos();
	}, []);

	useEffect(() => {
		
		getCiudades();
		
	}, [Departamento]);

	const getDepartamentos = async ()=>{
		console.log('first')
		try {
			const res = await axios.post(`${URL_BASE}departamentos.php`)
			console.log(res.data);
			 setDepartamentos(res.data.departamentos)
		} catch (error) {
			
		}
	}

	const getCiudades = async ()=>{
		try {
			const res = await axios.post(`${URL_BASE}ciudades.php?idDepartamento=${Departamento}`)
			console.log(res.data);
			setCiudades(res.data.ciudades)
		} catch (error) {
			
		}
	}

	const RegistrarUsr = async ()=>{
		try {
			const req={
				"usuario":usuario,
				"password":password,
				"idDepartamento": Departamento,
				"idCiudades":Ciudad,
			}
			const res = await axios.post(`${URL_BASE}usuarios.php`)
			console.log(res.data);
			if(res.data.codigo ===200){
				alert("Registro realizado con exito")
			}
			else{
				alert(`ERROR : ${res.data.codigo}`)
			}
		} catch (error) {
			
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
						<form className="space-y-4 md:space-y-6" action="#">
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
								/>
							</div>
							<div>
								<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
								/>
							</div>
								<label htmlFor="Departamento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Departamento
								</label>

								<select id="Departamento" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
									
									{Departamentos.map( departamento => <option onChange={ ()=> setDepartamento(departamento.id)} value={departamento.id}> {departamento.nombre}</option> ) }
									
									
								</select>

							<div>

							</div>
								<label htmlFor="ciudad" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Ciudad
								</label>

								<select id="ciudad" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
									
									{Ciudades.map( ciudad => <option onChange={ ()=> setCiudad(ciudad.id)} value={ciudad.id}> {ciudad.nombre}</option> ) }
									
									
								</select>

							<div>

							</div>

							<button
								type="submit"
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								onClick={()=> RegistrarUsr()}
							>
								Crear Cuenta
							</button>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Tienes una cuenta?{" "}
								<a href="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
									Inicia Sesión
								</a>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
