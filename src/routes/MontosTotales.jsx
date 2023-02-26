import React, { useEffect, useState } from 'react'
import Spinner from "../components/Spinner";
import Card01 from "../components/Cards/Card01";
import BackGroundMain from '../components/BackgroundMain';
import { URL_BASE } from "../utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TfiMoney } from "react-icons/tfi";
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

export default function () {
    
    const {userData}  = useSelector((state) => state.usuario);
    const [loading, setLoading] = useState(false);
    const [rubros, setRubros] = useState([]);
    const [movimientos,setMovimientos] = useState([]);
    const [gasto,SetGasto] = useState(0);
    const [ingreso,setIngresos] = useState(0);
    const [total,SetTotal] = useState(0);
   
    useEffect(()=>{
        getRubros();
        
        
    },[])
    
    useEffect(()=>{
        getMovimientos();
    },[rubros])


    useEffect(()=>{
        SetTotal(ingreso - gasto);
    },[ingreso])

    const getRubros = async () => {
		setLoading(true)
		try {
			const res = await axios.get(`${URL_BASE}rubros.php`);
			
            setRubros(res.data.rubros);
		} catch (error) {
			toast.error(error.message);
		}
        finally{
            setLoading(false)
        }
	};



    const getMovimientos = async ()=>{
        setLoading(true);
        
        try {
            
            const res = await axios.get(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`)
            setMovimientos(res.data.movimientos)
            await FiltrarMovimientosPorTipo(res.data.movimientos,'gasto')
            await FiltrarMovimientosPorTipo(res.data.movimientos,'ingreso')
            
        } catch (error) {
            
            if (error.response.status == 401){
                nav("/")
                
            }
        }
		finally{
            setLoading(false);
        }
		
	}

    const FiltrarMovimientosPorTipo = async (movimientos,tipo) => {
		const rubrosGastos = rubros.filter((item) => item.tipo === tipo);
        
		let Gastos = 0;
        let Ingresos = 0;
		rubrosGastos.forEach((rubro) => {
			const movimientosDeRubro = movimientos.filter((movimiento) => movimiento.categoria === rubro.id);
            if (movimientosDeRubro.length > 0){
                
                if(tipo == "gasto"){
                    
                    movimientosDeRubro.map((movimiento)=>Gastos+=Math.abs(movimiento.total)) 
                }
                else
                {
                    movimientosDeRubro.map((movimiento)=>Ingresos +=movimiento.total)
                }
               
            }
           
			
		});
      
        if(tipo ==="gasto"){
            SetGasto(Gastos);
        }
        else
        {
            setIngresos(Ingresos);
        }
      
       

    }
    
    
    return (
        <div className="bg-slate-100  h-screen">
            {loading && <Spinner />}
            {!loading && (
				<div className="p-5 h-full">
					<div className="flex justify-center items-center ">
						<Card01
							title={"Ingresos"}
							description={``}
						>
                            <Box display={"flex"}>
                                <TfiMoney size={25} color="green"></TfiMoney>
                                <label className='mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50"'>{ingreso}</label>
                            </Box>
                            
						</Card01>
                        <Card01
							title={"Gastos"}
							description={``}
						>
                            <Box display={'flex'}>
                                <TfiMoney size={25} color="red"></TfiMoney>
                                <label className='mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50"'>{gasto}</label>
                            </Box>
							
						</Card01>
                        <Card01
							title={"Saldo Total"}
							description={``}
						>
							<Box display={'flex'}>
                                <TfiMoney size={25} color="blue"></TfiMoney>
                                <label className='mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50"'>{total}</label>
                            </Box>
						</Card01>
						
					</div>
				</div>
			)}
       </div>
        
    )
}
