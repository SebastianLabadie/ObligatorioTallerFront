import {configureStore} from "@reduxjs/toolkit";
// import contadorReducer from "../features/contadorSlice";
import usuarioSlice from "../features/usuarioSlice";
import menuSlice from "../features/menuSlice";

export const store = configureStore({
    reducer:{
        usuario:usuarioSlice,
		menu:menuSlice
    }
});