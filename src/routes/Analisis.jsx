import React, { useEffect, useState } from "react";
import BackGroundMain from "../components/BackgroundMain";
import Card01 from "../components/Cards/Card01";
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { URL_BASE } from "../utils/utils";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const arrayColores = [
	"rgba(255, 99, 132, 0.2)",
	"rgba(54, 162, 235, 0.2)",
	"rgba(255, 206, 86, 0.2)",
	"rgba(75, 192, 192, 0.2)",
	"rgba(153, 102, 255, 0.2)",
	"rgba(255, 159, 64, 0.2)",
];

const arrayMeses = [
	{ value: 1, label: "Enero" },
	{ value: 2, label: "Febrero" },
	{ value: 3, label: "Marzo" },
	{ value: 4, label: "Abril" },
	{ value: 5, label: "Mayo" },
	{ value: 6, label: "Junio" },
	{ value: 7, label: "Julio" },
	{ value: 8, label: "Agosto" },
	{ value: 9, label: "Septiembre" },
	{ value: 10, label: "Octubre" },
	{ value: 11, label: "Noviembre" },
	{ value: 12, label: "Diciembre" },
];

const options = {
	indexAxis: "y",
	elements: {
		bar: {
			borderWidth: 2,
		},
	},
	responsive: true,
	plugins: {
		legend: {
			position: "right",
		},
		title: {
			display: false,
			text: "",
		},
	},
};

export default function Analisis() {
	const { userData } = useSelector((state) => state.usuario);
	const [loading, setLoading] = useState(true);
	const [dataIngresoRubros, setDataIngresoRubros] = useState({});
	const [totalIngresos, setTotalIngresos] = useState(0);
	const [dataGastosRubros, setDataGastosRubros] = useState({});
	const [totalGastos, setTotalGastos] = useState(0);
	const [rubros, setRubros] = useState([]);
	const [dataGastosEvolucion, setDataGastosEvolucion] = useState({});

	useEffect(() => {
		console.log(userData.id);
		getRubros();
	}, []);

	useEffect(() => {
		getMovimientos();
	}, [rubros]);

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
			await calcularChartIngresoRubros(res);
			await calcularChartGastosRubros(res);
			calcularChartGastosEvolicion(res);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const calcularChartIngresoRubros = async (res) => {
		console.log(`rubros `, rubros);
		const rubrosIngreso = rubros.filter((item) => item.tipo === "ingreso");
		const rubrosIngresoLabel = rubrosIngreso.map((item) => item.nombre);

		let movimientosIngresoRubros = [];
		let totalIngresos = 0;
		rubrosIngreso.forEach((rubro) => {
			const movimientosDeRubro = res.data.movimientos.filter((movimiento) => movimiento.categoria === rubro.id);
			const totalMovimientosDeRubro = movimientosDeRubro.reduce(
				(acumulador, movimiento) => acumulador + movimiento.total,
				0
			);
			totalIngresos += totalMovimientosDeRubro;
			movimientosIngresoRubros.push(totalMovimientosDeRubro);
		});

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

		setTotalIngresos(totalIngresos);
	};

	const calcularChartGastosRubros = async (res) => {
		console.log(`rubros `, rubros);
		const rubrosGastos = rubros.filter((item) => item.tipo === "gasto");
		const rubrosGastosLabel = rubrosGastos.map((item) => item.nombre);

		let movimientosGastosRubros = [];
		let totalGastos = 0;
		rubrosGastos.forEach((rubro) => {
			const movimientosDeRubro = res.data.movimientos.filter((movimiento) => movimiento.categoria === rubro.id);
			const totalMovimientosDeRubro = movimientosDeRubro.reduce(
				(acumulador, movimiento) => acumulador + movimiento.total,
				0
			);
			totalGastos += totalMovimientosDeRubro;
			movimientosGastosRubros.push(totalMovimientosDeRubro);
		});

		setDataGastosRubros({
			labels: rubrosGastosLabel,
			datasets: [
				{
					label: "Monto",
					data: movimientosGastosRubros,
					backgroundColor: arrayColores,
					borderColor: arrayColores,
					borderWidth: 1,
				},
			],
		});

		setTotalGastos(totalGastos);
	};

	const calcularChartGastosEvolicion = (res) => {
		const rubrosGastos = rubros.filter((item) => item.tipo === "gasto").map((item) => item.id);

		console.log(`rubrosGastos `, rubrosGastos);

		const movimientosGastos = res.data.movimientos.filter((movimiento) => rubrosGastos.includes(movimiento.categoria));

		console.log(`movimientosGastos `, movimientosGastos);

		const date = new Date();
		const anioActual = date.getFullYear();
		const anioPasado = anioActual - 1;

		const movimientosGastosPorMesAActual = [];
		arrayMeses.forEach((mes, index) => {
			const movimientosDeMes = movimientosGastos.filter((movimiento) => {
				const fecha = new Date(movimiento.fecha);
				//console.log(`month ${fecha.getMonth()} mes.value ${mes.value} year ${fecha.getFullYear()} anioActual ${anioActual}  `)
				return fecha.getMonth() + 1 == mes.value && fecha.getFullYear() == anioActual;
			});
			const totalMovimientosDeMes = movimientosDeMes.reduce((acumulador, movimiento) => acumulador + movimiento.total, 0);
			movimientosGastosPorMesAActual.push(totalMovimientosDeMes);
		});

		const movimientosGastosPorMesAPasado = [];

		arrayMeses.forEach((mes, index) => {
			const movimientosDeMes = movimientosGastos.filter((movimiento) => {
				const fecha = new Date(movimiento.fecha);
				//console.log(`month ${fecha.getMonth()} mes.value ${mes.value} year ${fecha.getFullYear()} anioActual ${anioActual}  `)
				return fecha.getMonth() + 1 == mes.value && fecha.getFullYear() == anioPasado;
			});
			const totalMovimientosDeMes = movimientosDeMes.reduce((acumulador, movimiento) => acumulador + movimiento.total, 0);
			movimientosGastosPorMesAPasado.push(totalMovimientosDeMes);
		});

		console.log(`movimientosGastosPorMesAActual ${movimientosGastosPorMesAActual}`);
		console.log(`movimientosGastosPorMesAPasado ${movimientosGastosPorMesAPasado}`);

		const labels = arrayMeses.map((item) => item.label);

		setDataGastosEvolucion({
			labels,
			datasets: [
				{
					label: "Gastos " + anioActual,
					data: labels.map((el,idx)=>movimientosGastosPorMesAActual[idx]),
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)",
				},
				{
					label: "Gastos " + anioPasado,
					data: labels.map((el,idx)=>movimientosGastosPorMesAPasado[idx]),
					borderColor: "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)",
				},
			],
		});
	};

	return (
		<div className="bg-slate-100 ">
			
			{loading && <Spinner />}
			{!loading && (
				<div className="p-5">
					<div className="flex justify-center items-center">
						<Card01
							title={"Ingresos por rubro"}
							description={`Grafico del total de ingresos(monto) agrupados por rubro.`}
						>
							<Pie data={dataIngresoRubros} />
							<strong>Total: ${totalIngresos}</strong>
						</Card01>
						<Card01
							title={"Gastos por rubro"}
							description={`Grafico del total de gastos(monto) agrupados por rubro.`}
						>
							<Pie data={dataGastosRubros} />
							<strong>Total: ${totalGastos}</strong>
						</Card01>
						
					</div>
					<div className="flex justify-center items-center mt-5">
						<Card01 title={"Gastos evolutivos"} description={`Grafico de gastos por mes para el usuario para el año en curso y el anterior.`}  maxWidth="max-w-800">
								<Bar options={options} data={dataGastosEvolucion} />
						</Card01>
					</div>
				</div>
			)}
		</div>
	);
}
