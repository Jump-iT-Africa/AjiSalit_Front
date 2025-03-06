import { configureStore } from '@reduxjs/toolkit';
import OrderDetailsSlice from "../slices/OrderDetailsSlice.ts"

const store = configureStore({
  reducer: {
    buttons: OrderDetailsSlice
  }
});

export default store;