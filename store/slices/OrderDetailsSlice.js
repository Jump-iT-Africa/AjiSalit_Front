import { createSlice, createSelector } from '@reduxjs/toolkit';

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

// ✅ FIXED: Memoized selectors that won't cause unnecessary re-renders

// Base selectors
const selectButtonsState = (state) => state.buttons;
const selectOrderButtons = (state) => state.buttons.orderButtons;

// Default button state (reuse the same object reference)
const defaultButtonState = {
  finishButtonClicked: false,
  pickupButtonClicked: false
};

// ✅ Memoized selector for specific order button state
export const selectOrderButtonState = createSelector(
  [selectOrderButtons, (state, orderId) => orderId],
  (orderButtons, orderId) => {
    return orderButtons[orderId] || defaultButtonState;
  }
);

// ✅ Additional memoized selectors for global button states
export const selectGlobalButtonStates = createSelector(
  [selectButtonsState],
  (buttonsState) => ({
    finishButtonClicked: buttonsState.finishButtonClicked,
    pickupButtonClicked: buttonsState.pickupButtonClicked
  })
);

// ✅ Memoized selector for finish button state
export const selectFinishButtonClicked = createSelector(
  [selectButtonsState],
  (buttonsState) => buttonsState.finishButtonClicked
);

// ✅ Memoized selector for pickup button state  
export const selectPickupButtonClicked = createSelector(
  [selectButtonsState],
  (buttonsState) => buttonsState.pickupButtonClicked
);

// ✅ Memoized selector to check if any order has clicked buttons
export const selectHasAnyOrderButtonClicked = createSelector(
  [selectOrderButtons],
  (orderButtons) => {
    return Object.values(orderButtons).some(
      buttonState => buttonState.finishButtonClicked || buttonState.pickupButtonClicked
    );
  }
);

export const { 
  finishButtonPressed, 
  pickupButtonPressed, 
  resetButtons,
  resetOrderButtons,
  clearAllOrderButtons
} = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;