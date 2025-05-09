// siteInfoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL = 'https://www.ajisalit.com';

export const fetchSiteInfo = createAsyncThunk(
  'siteInfo/fetchSiteInfo',
  async (title, { rejectWithValue }) => {
    try {
      console.log('this is the comming title', title);
      const token = await AsyncStorage.getItem('token');



      const response = await axios.get(`${BASE_URL}/siteinfo/${title}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      

      console.log("this is the response data",response.data);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An unknown error occurred'
      );
    }
  }
);

const siteInfoSlice = createSlice({
  name: 'siteInfo',
  initialState: {
    content: null,
    status: 'idle', 
    error: null,
  },
  reducers: {
    resetSiteInfo: (state) => {
      state.content = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSiteInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.content = action.payload;
      })
      .addCase(fetchSiteInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetSiteInfo } = siteInfoSlice.actions;
export default siteInfoSlice.reducer;