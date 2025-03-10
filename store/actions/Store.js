import { configureStore } from '@reduxjs/toolkit';
import OrderDetailsSlice from "../slices/OrderDetailsSlice.js"
import roleReducer from '../slices/RoleSlice.js';

const store = configureStore({
  reducer: {
    buttons: OrderDetailsSlice,
    role:roleReducer
  }
});

export default store;