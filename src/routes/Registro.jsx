import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setMenuActivo } from '../features/menuSlice'

export default function Registro() {
	const dispatch = useDispatch()

	useEffect(()=>{
		dispatch(setMenuActivo('REGISTRO'))
	},[])


  return (
	<div>Registro</div>
  )
}
