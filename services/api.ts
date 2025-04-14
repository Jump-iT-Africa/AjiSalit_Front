// @ts-nocheck

import axios from 'axios';

const API_BASE_URL = 'https://www.ajisalit.com';
// const API_BASE_URL = 'http://192.168.100.170:3000';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserToDB = async (userData) => {
    try {
      console.log('Attempting to connect to:', `${API_BASE_URL}/user/register`);
      console.log('With payload:', JSON.stringify(userData));
      const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
      
      if (response.data && response.data.token) {
      console.log('shshs2');
        await AsyncStorage.setItem("token", response.data.token);
      }
      
      if (response.data && response.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      } else if (response.data && !response.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      }
      console.log('bigresponse', response);
      
      return response.data;
    } catch (error) {
      console.log('Error in saveUserToDB:', error.response?.data || error.message);
      throw error;
    }
  };


  export const loginUser = async (credentials) => {
    try {
      console.log('Login attempt with this password:', credentials);
      console.log('Password length:', credentials.password?.length || 0);
          
      const response = await axios.post(`${API_BASE_URL}/user/login`, credentials);
      console.log('Login response:', response.data);
          
      return {
        token: response.data.token,
        user: response.data.user || response.data.userinfo || response.data
      };
    } catch (error) {
      console.log('Error in loginUser:', error.response?.data || error.message);
      throw error;
    }
  };

export const verifyNumber = async (phoneData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
        
    const response = await axios.post(`${API_BASE_URL}/user/verifyNumber`, phoneData, config);
    
    if (response.data.isExist === false && response.data.statusCode === 409) {
      throw {
        response: {
          data: response.data
        }
      };
    }
    
    return response.data;
  } catch(error) {
    console.log('Error in Verifying', error.response?.data || error.message);
    throw error;
  }
}




export const GetUserCommands = async () => {
  try{
    const response = await axios.get(`${API_BASE_URL}/order`);
    console.log(response);
    console.log(response.data);

    return response.data
  }catch(err)
  {
    console.log(err);
    throw err;
  }
}

