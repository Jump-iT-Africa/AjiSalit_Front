import { createSlice } from '@reduxjs/toolkit';


//role han ya ima client ya company

const roleSlice = createSlice({
  name: 'role',
  initialState: { role: 'client' }, 
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload; 
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
