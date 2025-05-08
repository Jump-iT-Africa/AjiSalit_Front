
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderButtonsState {
  [orderId: string]: {
    finishButtonClicked: boolean;
    pickupButtonClicked: boolean;
  }
}

const initialState = {
  orderButtons: {},
  finishButtonClicked: false,
  pickupButtonClicked: false
};

const orderDetailsSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {
    finishButtonPressed: (state, action) => {
      state.finishButtonClicked = true;
      
      const orderId = action.payload?.orderId;
      if (orderId) {
        if (!state.orderButtons[orderId]) {
          state.orderButtons[orderId] = {
            finishButtonClicked: false,
            pickupButtonClicked: false
          };
        }
        state.orderButtons[orderId].finishButtonClicked = true;
      }
    },
    
    pickupButtonPressed: (state, action) => {
      
      state.pickupButtonClicked = true;
      
      
      const orderId = action.payload?.orderId;
      if (orderId) {
        if (!state.orderButtons[orderId]) {
          state.orderButtons[orderId] = {
            finishButtonClicked: false,
            pickupButtonClicked: false
          };
        }
        state.orderButtons[orderId].pickupButtonClicked = true;
      }
    },
    
    resetButtons: (state) => {
      
      state.finishButtonClicked = false;
      state.pickupButtonClicked = false;
    },
    
    resetOrderButtons: (state, action) => {
      
      const orderId = action.payload?.orderId;
      if (orderId && state.orderButtons[orderId]) {
        state.orderButtons[orderId] = {
          finishButtonClicked: false,
          pickupButtonClicked: false
        };
      }
    },
    
    clearAllOrderButtons: (state) => {
      
      state.orderButtons = {};
    }
  }
});


export const selectOrderButtonState = (state, orderId) => {
  return state.buttons.orderButtons[orderId] || {
    finishButtonClicked: false,
    pickupButtonClicked: false
  };
};

export const { 
  finishButtonPressed, 
  pickupButtonPressed, 
  resetButtons,
  resetOrderButtons,
  clearAllOrderButtons
} = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;