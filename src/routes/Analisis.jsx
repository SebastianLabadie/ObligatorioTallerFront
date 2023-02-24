import React, { useEffect, useState } from "react";
import BackGroundMain from "../components/BackgroundMain";
import Card01 from "../components/Cards/Card01";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { URL_BASE } from "../utils/utils";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const arrayColores = [
	"rgba(255, 99, 132, 0.2)",
	"rgba(54, 162, 235, 0.2)",
	"rgba(255, 206, 86, 0.2)",
	"rgba(75, 192, 192, 0.2)",
	"rgba(153, 102, 255, 0.2)",
	"rgba(255, 159, 64, 0.2)",
];

export const data = {
	labels: ["Alimentacion", "Conbustible", "Educacion"],
	datasets: [
		{
			label: "Monto",
			data: [12, 19, 3],
			backgroundColor: arrayColores,
			borderColor: arrayColores,
			borderWidth: 1,
		},
	],
};

export default function Analisis() {
	const { userData } = useSelector((state) => state.usuario);
	const [loading, setLoading] = useState(true);
	const [dataIngresoRubros, setDataIngresoRubros] = useState({});
	const [totalIngresos, setTotalIngresos] = useState(0)
	const [rubros, setRubros] = useState([]);

	useEffect(() => {
		console.log(userData.id);
		getRubros();
		getMovimientos();
	}, []);

	const getRubros = async () => {
		console.log(`axios ${axios.defaults.headers.common["apiKey"]}`);
		console.log(`${URL_BASE}rubros.php`);
		try {
			const res = await axios.get(`${URL_BASE}rubros.php`);
			console.log(res.data);
			const rubrosFiltered = res.data.rubros.filter((item) => item.tipo === "ingreso");

			// const rubMapped = rubrosFiltered.map((item) => {
			// 	return { value: item.id, label: item.nombre };
			// });
			// console.log(`dep ${JSON.stringify(rubMapped)}`);
			setRubros(res.data.rubros);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const getMovimientos = async () => {
		setLoading(true);
		try {
			console.log(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`);
			const res = await axios.get(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`);
			console.log(res.data);

			const rubrosIngreso = rubros.filter((item) => item.tipo === "ingreso");
			const rubrosIngresoLabel = rubrosIngreso.map((item) => item.nombre);
			console.log(`rubrosIngreso `, rubrosIngreso)

			let movimientosIngresoRubros = [];
			let totalIngresos = 0;
			rubrosIngreso.forEach((rubro) => {
				const movimientosDeRubro= res.data.movimientos.filter((movimiento) => movimiento.categoria === rubro.id)
				const totalMovimientosDeRubro = movimientosDeRubro.reduce((acumulador, movimiento) => acumulador + movimiento.total , 0)
				totalIngresos += totalMovimientosDeRubro;
				movimientosIngresoRubros.push(
					totalMovimientosDeRubro
				);
			})
			console.log(`movimientosIngresoRubros `, movimientosIngresoRubros);

			setDataIngresoRubros({
				labels: rubrosIngresoLabel,
				datasets: [
					{
						label: "Monto",
						data: movimientosIngresoRubros,
						backgroundColor: arrayColores,
						borderColor: arrayColores,
						borderWidth: 1,
					},
				],
			});
			setTotalIngresos(totalIngresos)
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <Spinner />}
			{!loading && (
				<div>
					<Card01
						title={"Ingresos por rubro"}
						description={`Grafico del total de ingresos(monto) agrupados por rubro.`}
					>
						<Pie data={dataIngresoRubros} />
						<strong>Total: ${totalIngresos}</strong>
					</Card01>
				</div>
			)}
		</div>
	);
}
