import React, { useEffect, useState } from 'react'
import axios from "axios"
import { URL_BASE } from "../utils/utils";
import BackGroundMain from '../components/BackgroundMain';
import Select from 'react-select';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function Comparativo() {
    const [loading,setLoading] = useState(true);
    const [rubros,setRubros] = useState([]);
    const [rubro,setRubro] = useState("")
    const {userData}  = useSelector((state) => state.usuario);
    const [message,setMessage] = useState("");
    useEffect(()=>{
        getRubros();
    },[])
    
    useEffect(()=>{
        if(rubro !=0){
            getMovimientos();
        }
      
    },[rubro])
    
    const getRubros = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL_BASE}rubros.php`);
			const MappedRubros = res.data.rubros.map((rubroAux) =>{return {value:rubroAux.id,label:rubroAux.nombre}})
            
            setRubros(MappedRubros);
            
            
		} catch (error) {
			toast.error(error.message);
		}
        finally{
            setLoading(false);
        }
	};

    const getMovimientos = async ()=>{
        setLoading(true);
        try {
            
            const res = await axios.get(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`)
             
            FiltrarMovimientosPorRubro(res)
        } catch (error) {
            
            if (error.response.status == 401){
                nav("/")
                
            }
        }
		finally{
            setLoading(false);
        }
		
	}


    const FiltrarMovimientosPorRubro = async (res) => {
		const movimientosDeRubro = res.data.movimientos.filter((movimiento) => movimiento.categoria === rubro);
        let UltMov = movimientosDeRubro[movimientosDeRubro.length-1];
        let PenUltMov = movimientosDeRubro[movimientosDeRubro.length-2];
        
        let Rubro = rubros.filter((rubroAux) => rubroAux.value === rubro);
        let RubroNom = Rubro[0];
        
        if(UltMov !=null && PenUltMov !=null){
            
            if(UltMov.total > PenUltMov.total){
                `${URL_BASE}rubros.php`
                setMessage(`Para el Rubro ${RubroNom.label} En la ultima compra has gastado $ ${UltMov.total - PenUltMov.total} pesos mas que la penultima.`);
            }
            else if(PenUltMov.total >UltMov.total)
            {
                setMessage(`Para el Rubro ${RubroNom.label} En la penultima compra has gastado $ ${PenUltMov.total - UltMov.total } pesos mas que la ultima.`);
              
            }
            else{
                setMessage(`Para el Rubro ${RubroNom.label} En la ultima compra has gastado lo mismo que la penultima ($${UltMov.total})`);
            }
        }
        else{
            setMessage(`Para el Rubro ${RubroNom.label} no existen 2 Compras.`);
        }	
        
		};

    return (
        <Box>
               
            <Select
            defaultValue={rubro}
            placeholder="Seleccione Rubro"
            onChange={(e)=>{setRubro(e.value)}}
            options={rubros}
            />
            
            
            <label>{message}</label>
            
            

        </Box>
        
        
        
       
        
    
      )
}
