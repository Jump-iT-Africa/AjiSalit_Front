import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_BASE_URL = 'https://www.ajisalit.com';

export const findOrderByid = createAsyncThunk(
    'orders/findOrderById',
    async (_, { rejectWithValue }) => {
        try {
          const token = await AsyncStorage.getItem('token');
          console.log("Using token for orders fetch:", token);
    
          if (!token) {
            return rejectWithValue('No authentication token available');
          }
          
          const response = await axios.get(`${API_BASE_URL}/order`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          return response.data;
        } catch (error) {
          console.log('Fetch orders error:', error.message);
          return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
        }
      }
)

export const fetchORderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (OrderId, {rejectWithValue, dispatch}) =>{

    try{
        console.log('this is the id of the  command', OrderId);

        const token = await AsyncStorage.getItem('token')

        if(!token){
            return rejectWithValue('No authenticated Token Available')    
        }

        if(!OrderId || typeof OrderId !== 'string'){
            return rejectWithValue('Invalid Id format');
        }

        const sanitizedId = OrderId.trim();

        const response = await axios.get(`${API_BASE_URL}/order/${sanitizedId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log('order id response:', response.data);

        //nstori l order f local storage bach ila dkhel fl offline ibarno lih fine
       

    }catch(error)
    {
        console.log('error finding the Order');
        if(error.response)
        {
            console.log('error in the responose:', error.response.data);
            console.log('error in the status:', error.response.status);
        }
    }
})




