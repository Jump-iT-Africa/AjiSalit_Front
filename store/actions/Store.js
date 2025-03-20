import { configureStore } from '@reduxjs/toolkit';
import OrderDetailsSlice from "../slices/OrderDetailsSlice.js"
import roleReducer from '../slices/RoleSlice.js';
import userSlice from '../slices/userSlice.js';
import ordersReducer from '../slices/OrdersSlice.js'
import CreateOrderReducer from '../slices/CreateOrder.js'
import OrdersOfClient from '../slices/OrdersOfClient.js';

const store = configureStore({
  reducer: {
    buttons: OrderDetailsSlice,
    role:roleReducer,
    user:userSlice,
    orders: ordersReducer,
    order:CreateOrderReducer,
    orderDetails: OrdersOfClient
  }
});

export default store;
