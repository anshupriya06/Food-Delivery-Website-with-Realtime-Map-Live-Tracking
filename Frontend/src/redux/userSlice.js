import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    isLoading: true,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
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
    },
    setShopsInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItems = action.payload;
      const existingItem = state.cartItems.find(i => i.id === cartItems.id);
      if (existingItem) {
        existingItem.quantity += cartItems.quantity;
      } else {
        state.cartItems.push(cartItems);
      }
    },
  },
});

export const {
  setUserData,
  setUserLoading,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopsInMyCity,
  setItemsInMyCity,
    addToCart,
} = userSlice.actions;
export default userSlice.reducer;
