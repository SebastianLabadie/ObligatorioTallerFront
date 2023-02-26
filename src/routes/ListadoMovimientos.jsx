import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import BackgroundMain from '../components/BackgroundMain'
import axios from "axios"
import { URL_BASE } from "../utils/utils";
import { DataGrid} from '@mui/x-data-grid';
import Select from 'react-select';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import Spinner from '../components/Spinner';
import { Link, useNavigate } from "react-router-dom";
import { setLogin, setUserData } from '../features/usuarioSlice';

export default function ListadoMovimientos() {

const {userData}  = useSelector((state) => state.usuario);
const [Movimientos,setMovimientos] = useState([]);
const [TipoMovimiento,setTipoMovimiento] = useState("Todos");
const [isReload,setReload] = useState(false);
const [loading, setLoading] = useState(true);
const [rubros, setRubros] = useState([]);

const nav = useNavigate()
const dispatch = useDispatch();

const TiposMovimiento = [
    {value: 'Todos',label: 'Todos'},
	{ value: "gasto", label: "Gasto" },
	{ value: "ingreso", label: "Ingreso" }
];

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'concepto', headerName: 'Concepto', width: 150 },
    {field: 'categoria', headerName: 'Categoria',type: 'number',width: 90},
    { field: 'medio', headerName: 'Medio', width: 100 },
    { field: 'total', headerName: 'Total', width: 70 },
  ];
  
  const [selectionModel, setSelectionModel] = React.useState([]);
  
  useEffect(() => {
    getRubros();
    getMovimientos();
    
}, []);


  useEffect(() => {
		getMovimientos();
		
	}, [isReload]);
    
    

    useEffect(() => {
		getMovimientos()
		
	}, [TipoMovimiento]);

    const getRubros = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL_BASE}rubros.php`);
			
            setRubros(res.data.rubros);
		} catch (error) {
			toast.error(error.message);
			validarSesion(error)
		}
        finally{
            setLoading(false);
        }
	};



    const getMovimientos = async ()=>{
        setLoading(true);
        try {
            
            const res = await axios.get(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`)
            
            const depMapped = res.data.movimientos.map((movimiento)=>{return {id:movimiento.id,concepto:movimiento.concepto,categoria:movimiento.categoria,medio:movimiento.medio,total:movimiento.total}})  
            
            if(TipoMovimiento =='gasto'){
                await FiltrarMovimientosPorTipo(depMapped,TipoMovimiento)
                
                return
            }
            
            if(TipoMovimiento =='ingreso'){
                await FiltrarMovimientosPorTipo(depMapped,TipoMovimiento)
                
                return
            }
            

            setMovimientos(depMapped)
        } catch (error) {
            
			validarSesion(error)
        }
		finally{
            setLoading(false);
        }
		
	}

    const FiltrarMovimientosPorTipo = async (depMapped,tipo) => {
		const rubrosGastos = rubros.filter((item) => item.tipo === tipo);
		
        const MovientosFiltered = [];
		rubrosGastos.forEach((rubro) => {
			const movimientosDeRubro = depMapped.filter((movimiento) => movimiento.categoria === rubro.id);
            if (movimientosDeRubro.length > 0){
                movimientosDeRubro.map((movimiento)=>MovientosFiltered.push(movimiento)) 
            }
           
			
		});
      
        setMovimientos(MovientosFiltered);

    }
    



    const EliminarMovimiento = async()=>{

        try {
            
            
            const res = await axios.delete(`${URL_BASE}movimientos.php?`,{data:{idMovimiento:selectionModel[0]}})
            
            if (res.data.codigo === 200) {
				
				
				toast.success("Movimiento eliminado correctamente")
                setReload(!isReload)
            }
            
        } catch (error) {
            toast.error(error.response.data.mensaje)
			validarSesion(error)
        }

    }

	const validarSesion = (error) => {
		if (error.response.status == 401){
			dispatch(setLogin(false));
			dispatch(setUserData({}));
			nav("/")
		}
	}

  return (


        <BackgroundMain Tittle={"Listado De Movimientos"}Body={
     
            <Box sx={{ height: 600, width: '100%' }}>
                <Box mb={2}>
                    <Select
                        defaultValue={TipoMovimiento}
                        placeholder="Seleccione Tipo Movimiento"
                        onChange={(e)=>{setTipoMovimiento(e.value)}}
                        options={TiposMovimiento}
                    />
        
                    <Box mt={2}>
                        <button
                            type="button"
                            className="text-white bg-red-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            onClick={() => EliminarMovimiento()}
                        >
                            Eliminar Gasto
                        </button>
                    </Box>
                    
                </Box>
             {loading ? <Spinner/>:
             <DataGrid
                rows={Movimientos}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableMultipleSelection={true}
                onSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                  }}
                selectionModel={selectionModel}
                experimentalFeatures={{ newEditingApi: true }}
              />}
              
            </Box>
        
           } ></BackgroundMain>

   
)
   
  
}
