import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        isLoading: true,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setUserLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload;
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload;
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        }
    }
})

export const { setUserData, setUserLoading, setCurrentCity, setCurrentState, setCurrentAddress } = userSlice.actions;
export default userSlice.reducer;