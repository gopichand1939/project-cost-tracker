import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import itemsReducer from "./itemsSlice";
import otherCostsReducer from "./otherCostsSlice";

// Configure the Redux store with all slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
  },
});