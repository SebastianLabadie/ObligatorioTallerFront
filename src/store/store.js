import {configureStore} from "@reduxjs/toolkit";
// import contadorReducer from "../features/contadorSlice";
import usuarioSlice from "../features/usuarioSlice";

export const store = configureStore({
    reducer:{
        usuario:usuarioSlice,
    }
});