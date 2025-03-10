// @ts-nocheck

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderDetailsState {
  finishButtonClicked: boolean;
  pickupButtonClicked: boolean;
}

const initialState: OrderDetailsState = {
  finishButtonClicked: false,
  pickupButtonClicked: false
};

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    finishButtonPressed: (state) => {
      state.finishButtonClicked = true;
    },
    pickupButtonPressed: (state) => {
      state.pickupButtonClicked = true;
    },
    resetButtons: (state) => {
      state.finishButtonClicked = false;
      state.pickupButtonClicked = false;
    }
  }
});

export const { finishButtonPressed, pickupButtonPressed, resetButtons } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;