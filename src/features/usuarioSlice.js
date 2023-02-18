import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoged: false,
	userData:{
		id:0,
		apiKey:"",
	}
}

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        setLogin: (state,action) => {
            state.isLoged = action.payload;
        },
		setUserData: (state,action) => {
            state.userData = action.payload;
        },
    }
});

export const { setLogin,setUserData } = usuarioSlice.actions;
export default usuarioSlice.reducer;