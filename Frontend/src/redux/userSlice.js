import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    
    initialState: {
        userData: null,
        city: null,
        isLoading: true,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setUserLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setCity: (state, action) => {
            state.city = action.payload;
        }
    }
})

export const { setUserData, setUserLoading, setCity } = userSlice.actions;
export default userSlice.reducer;