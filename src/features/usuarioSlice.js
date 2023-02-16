import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoged: false
}

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        setLogin: (state,action) => {
            //immer
            state.isLoged = action.payload;
        },
    }
});

export const { setLogin } = usuarioSlice.actions;
export default usuarioSlice.reducer;