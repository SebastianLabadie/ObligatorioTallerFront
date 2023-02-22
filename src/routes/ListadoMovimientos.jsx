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

export default function ListadoMovimientos() {

const {userData}  = useSelector((state) => state.usuario);
const [Movimientos,setMovimientos] = useState([]);
const [TipoMovimiento,setTipoMovimiento] = useState("Todos");
const [isReload,setReload] = useState(false);
const [loading, setLoading] = useState(true);



const TiposMovimiento = [
    {value: 'Todos',label: 'Todos'},
	{ value: "Gasto", label: "Gasto" },
	{ value: "Ingreso", label: "Ingreso" }
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
    console.log(userData.id);
    getMovimientos();
    
}, []);


  useEffect(() => {
		getMovimientos();
		
	}, [isReload]);
    
    

    useEffect(() => {
		console.log(selectionModel)
		
	}, [selectionModel]);


    useEffect(() => {
		getMovimientos()
		
	}, [TipoMovimiento]);

    const getMovimientos = async ()=>{
        setLoading(true);
        try {
            console.log(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`)
            const res = await axios.get(`${URL_BASE}movimientos.php?idUsuario=${userData.id}`)
            console.log(res.data)
            const depMapped = res.data.movimientos.map((movimiento)=>{return {id:movimiento.id,concepto:movimiento.concepto,categoria:movimiento.categoria,medio:movimiento.medio,total:movimiento.total}})  
            
            if(TipoMovimiento =='Gasto'){
                const movFilter = depMapped.filter(dp => dp.total < 0)
                setMovimientos(movFilter)
                return
            }
            
            if(TipoMovimiento =='Ingreso'){
                const movFilter = depMapped.filter(dp => dp.total > 0)
                setMovimientos(movFilter)
                return
            }
            

            setMovimientos(depMapped)
        } catch (error) {
            console.log(error)
        }
		finally{
            setLoading(false);
        }
		
	}


    const EliminarMovimiento = async()=>{

        try {
            
            
            const res = await axios.delete(`${URL_BASE}movimientos.php?`,{data:{idMovimiento:selectionModel[0]}})
            console.log(res.data)
            if (res.data.codigo === 200) {
				
				
				toast.success("Movimiento eliminado correctamente")
                setReload(!isReload)
            }
            
        } catch (error) {
            toast.error(error.response.data.mensaje)
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
