import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menuActivo: 'LOGIN'
}

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenuActivo: (state,action) => {
            //immer
            state.menuActivo = action.payload;
        },
    }
});

export const { setMenuActivo } = menuSlice.actions;
export default menuSlice.reducer;