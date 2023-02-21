import React, { useState,useEffect } from 'react'
import BackgroundMain from '../components/BackgroundMain'
import axios from "axios"
import { URL_BASE } from "../utils/utils";
import Select from 'react-select';





export default function ListadoMovimientos() {

const [Movimientos,setMovimientos] = useState([]);
const[TipoMovimiento,setTipoMovimiento] = useState("");
const TiposMovimiento = [
	{ value: "Gasto", label: "Gasto" },
	{ value: "Ingreso", label: "Ingreso" }
];

useEffect(() => {
		getMovimientos();
		
	}, []);

    const getMovimientos = async ()=>{
		console.log('first')
		if (1 > 0){
			
			try {
				const res = await axios.get(`${URL_BASE}movimientos.php?idUsuario=3`)
				console.log(res.data)
                 setMovimientos(res.data.movimientos)
			} catch (error) {
				console.log(error)
			}
		}
		
	}

  return (
   <BackgroundMain Tittle={"Listado Movimientos"} 
   Body={
    // <Select
    //     defaultValue={TipoMovimiento}
    //     placeholder="Seleccione Movimiento"
    //     onChange={(e)=>{setTipoMovimiento(e.value)}}
    //     options={TiposMovimiento}
    // />
    <ul>
        {Movimientos.map(movimiento =><li>{movimiento.concepto} / {movimiento.categoria} / {movimiento.medio} / {movimiento.total}</li>)}
      
    </ul>


   }
   
   ></BackgroundMain>

   
  )
}
