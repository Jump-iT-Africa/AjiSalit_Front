// @ts-nocheck

import axios from 'axios';

const API_BASE_URL = 'https://www.ajisalit.com';
// const API_BASE_URL = 'http://192.168.100.170:3000';

import AsyncStorage from '@react-native-async-storage/async-storage';




export const fetchUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
        
    const response = await axios.get(`${API_BASE_URL}/user/`, config);
      console.log('this is updated info of user',  response.data);
      
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




export const saveUserToDB = async (userData) => {
  try {
    console.log('Attempting to connect to:', `${API_BASE_URL}/user/register`);
    console.log('With payload:', JSON.stringify(userData));
    
    const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
    
    console.log('API Response:', JSON.stringify(response.data));
    
    const userToStore = response.data.user;
    
    if (response.data && response.data.token) {
      await AsyncStorage.setItem("token", response.data.token);
    }
    
    if (userToStore) {
      await AsyncStorage.setItem("user", JSON.stringify(userToStore));
      console.log('this is id of the user ', JSON.stringify(userToStore.id));
      await AsyncStorage.setItem('userId',JSON.stringify(userToStore.id))
      await AsyncStorage.setItem("isAuthenticated", "true");
    }
    
    return response.data;
  } catch (error) {
    console.log('Error in saveUserToDB:', error.response?.data || error.message);
    throw error;
  }
};



export const loginUser = async (credentials) => {
  try {
    console.log('Login attempt with this info:', credentials);
    console.log('Password length:', credentials.password?.length || 0);
        
    const response = await axios.post(`${API_BASE_URL}/user/login`, credentials);
    
    if (response.data) {
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      console.log('this is id of user', JSON.stringify(response.data.user.id));
      
      await AsyncStorage.setItem("userId", JSON.stringify(response.data.user.id));
      console.log('Setting auth state after login');
      await AsyncStorage.setItem("isAuthenticated", "true");
      console.log('Auth state set');
    }
    
    return {
      token: response.data.token,
      user: response.data.user
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

export const updateUser = async (UserId, credentials) => {
  try {
    console.log('this is user id:', UserId);
    const token = await AsyncStorage.getItem('token');
    
    console.log('here is my token', token);
    
    const formData = { ...credentials };
    
    const response = await axios.put(`${API_BASE_URL}/user/${UserId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('API response for user update:', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.log('Error in updateUser API call:', error);
    if (error.response) {
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
    }
    throw error;
  }
};

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


export const updatePasswordService = async (passwordData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    
    console.log('here is data to update', passwordData);
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.patch(
      `${API_BASE_URL}/user/password`, 
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Password update success:', response.data);
    return response.data;
  } catch (error) {
    console.log('Password update service error:', error.response?.data);
    throw error;
  }
};