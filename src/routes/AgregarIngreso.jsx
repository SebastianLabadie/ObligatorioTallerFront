import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import { URL_BASE } from "../utils/utils";
import { setLogin, setUserData } from "../features/usuarioSlice";

const medios = [
	{ value: "Efectivo", label: "Efectivo" },
	{ value: "Banco", label: "Banco" },
];

export default function AgregarIngreso() {
	const [concepto, setConcepto] = useState("");
	const [rubro, setRubro] = useState(0);
	const [rubros, setRubros] = useState([]);
	const [medio, setMedio] = useState(0);
	const [total, setTotal] = useState(0);
	const [fecha, setFecha] = useState("");
	const { id } = useSelector((state) => state.usuario.userData);

	const dispatch = useDispatch();
	const nav = useNavigate()

	useEffect(() => {
		getRubros();
	}, []);

	const getRubros = async () => {
		
		try {
			const res = await axios.get(`${URL_BASE}rubros.php`);
			
			const rubrosFiltered = res.data.rubros.filter((item) => item.tipo === "ingreso");

			const rubMapped = rubrosFiltered.map((item) => {
				return { value: item.id, label: item.nombre };
			});
			
			setRubros(rubMapped);
		} catch (error) {
			toast.error(error.message);
			validarSesion(error)
		}
	};

	const handleConfirmarIngreso = async () => {
		
		
		const validacion = validarCampos()
		if (validacion) {

			try {
				const res = await axios.post(`${URL_BASE}movimientos.php`, {
					idUsuario: id,
					concepto,
					categoria:rubro,
					medio,
					total,
					fecha,
				});
				
				if (res.data.codigo === 200) {
					toast.success(`Ingreso agregado correctamente. #${res.data.idMovimiento}`);
				} else {
					toast.error("Error al agregar ingreso.");
				}
			} catch (error) {
				toast.error(error.message);
				validarSesion(error)
			}
		}
	};

	const validarSesion = (error) => {
		if (error.response.status == 401){
			dispatch(setLogin(false));
			dispatch(setUserData({}));
			nav("/")
		}
	}

	const validarCampos = () => {
		if(!concepto){
			toast.error("Debe ingresar un concepto.");
			return false
		}
		if(!rubro){
			toast.error("Debe seleccionar un rubro.");
			return false
		}
		if(!medio){
			toast.error("Debe seleccionar un medio.");
			return false
		}
		if(!total){
			toast.error("Debe ingresar un total.");
			return false
		}
		if(!fecha){
			toast.error("Debe ingresar una fecha.");
			return false
		}
		return true
	}

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Agregar un ingreso
						</h1>
						<div className="space-y-4 md:space-y-6">
							<div>
								<label
									htmlFor="concepto"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Concepto
								</label>
								<textarea
									rows="3"
									name="concepto"
									id="concepto"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Descripción del ingreso"
									onChange={(e) => {
										setConcepto(e.target.value);
									}}
									value={concepto}
								/>
							</div>
							<div>
								<label
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Rubro
								</label>
								
								<Select
									defaultValue={rubro}
									placeholder="Seleccione un rubro"
									onChange={(e) => {
										setRubro(e.value);
									}}
									options={rubros}
								/>
							</div>
							<label
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Medio
							</label>

							<Select
								defaultValue={medio}
								placeholder="Seleccione un medio"
								onChange={(e) => {
									setMedio(e.value);
								}}
								options={medios}
							/>


							<div>
								<label htmlFor="total" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Total
								</label>
								<input
									type="number"
									name="total"
									id="total"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Dinero obtenido"
									onChange={(e) => {
										setTotal(e.target.value);
									}}
									value={total}
								/>
							</div>

							<div>
								<label htmlFor="fecha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									fecha
								</label>
								<input
									type="date"
									name="fecha"
									id="fecha"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required=""
									onChange={(e) => {
										setFecha(e.target.value);
									}}
									value={fecha}
								/>
							</div>

							<button
								type="button"
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								onClick={() => handleConfirmarIngreso()}
							>
								Confirmar Ingreso
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
