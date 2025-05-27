
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const API_BASE_URL = 'https://api.ajisalit.com';


import AsyncStorage from '@react-native-async-storage/async-storage';




export const fetchUserData = async () => {
  try {
    
    const token = await AsyncStorage.getItem('token');
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios.get(`${API_BASE_URL}/user/`, config);
    console.log("sssss",response);
    
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
      await AsyncStorage.setItem('token', response.data.token)      
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
   
        console.log('this is number to be verified', phoneData);
        
    const response = await axios.post(`${API_BASE_URL}/user/verifyNumber`, phoneData);
    
    if (response.data.isExist === true && response.data.statusCode === 409) {
      throw {
        response: {
          data: response.data
        }
      };
    }
    
    console.log('this is response data',response.data);
    
    return response.data;
  } catch(error) {
    console.log('Error in Verifying', error.response?.data || error.message);
    throw error;
  }
}


export const updateUser = async (UserId, credentials) => {
  try {
    console.log('Updating user via JSON, User ID:', UserId);
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    console.log('Token available:', !!token);
    
    // Map profileImage to image for backend compatibility
    const formData = { ...credentials };
    
    // IMPORTANT: Change profileImage to image
    if (formData.profileImage) {
      formData.image = formData.profileImage;
      delete formData.profileImage; // Remove the old field
      console.log('Mapped profileImage to image field for backend');
    }
    
    // Log image type for debugging
    if (formData.image) {
      console.log('Image type:', formData.image.startsWith('data:') ? 'base64' : 'other');
      console.log('Image size (chars):', formData.image.length);
      console.log('Image preview:', formData.image.substring(0, 50) + '...');
    }
    
    console.log('Sending data fields:', Object.keys(formData));
    
    const response = await axios.put(`${API_BASE_URL}/user/${UserId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 45000, // 45 seconds for base64 upload
    });
    
    console.log('API response for user update (JSON):', response.status);
    console.log('Updated user image field:', response.data.image ? 'Image saved' : 'No image');
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

// Also update the FormData version
export const updateUserWithImage = async (UserId, credentials) => {
  try {
    console.log('Updating user via FormData, User ID:', UserId);
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    // If the image is base64, fall back to JSON approach
    if (credentials.profileImage && credentials.profileImage.startsWith('data:')) {
      console.log('Image is base64, falling back to JSON approach');
      return await updateUser(UserId, credentials);
    }
    
    const formData = new FormData();
    
    // Add all text fields to FormData
    if (credentials.Fname) formData.append('Fname', credentials.Fname);
    if (credentials.Lname) formData.append('Lname', credentials.Lname);
    if (credentials.companyName) formData.append('companyName', credentials.companyName);
    if (credentials.phoneNumber) formData.append('phoneNumber', credentials.phoneNumber);
    if (credentials.field) formData.append('field', credentials.field);
    if (credentials.city) formData.append('city', credentials.city);
    
    // Handle profile image (only for local files)
    // IMPORTANT: Use 'image' field name for backend
    if (credentials.profileImage && !credentials.profileImage.startsWith('http') && !credentials.profileImage.startsWith('data:')) {
      try {
        // Clean URI
        let cleanUri = credentials.profileImage;
        if (typeof credentials.profileImage === 'string') {
          cleanUri = credentials.profileImage.replace(/^Optional\("(.+)"\)$/, '$1');
          cleanUri = cleanUri.replace(/^"|"$/g, '');
        }
        
        // Ensure it's a file:// URI
        if (!cleanUri.startsWith('file://') && cleanUri.startsWith('/')) {
          cleanUri = 'file://' + cleanUri;
        }
        
        // Compress the image
        const compressedUri = await compressProfileImage(cleanUri);
        
        // Get file extension
        const fileExtension = compressedUri.split('.').pop().toLowerCase();
        const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        
        // Create image object for FormData
        const imageFile = {
          uri: compressedUri,
          type: mimeType,
          name: `profile_${UserId}.${fileExtension}`,
        };
        
        formData.append('image', imageFile);
        console.log('Profile image added to FormData as "image" field');
      } catch (imageError) {
        console.error('Error processing profile image:', imageError);
      }
    }
    
    console.log('FormData prepared, making request...');
    
    const response = await axios.put(`${API_BASE_URL}/user/${UserId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Profile update progress: ${percentCompleted}%`);
      },
    });
    
    console.log('API response for user update (FormData):', response.status);
    console.log('Updated user image field:', response.data.image ? 'Image saved' : 'No image');
    return response.data;
  } catch (error) {
    console.log('Error in updateUserWithImage API call:', error);
    if (error.response) {
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
    }
    throw error;
  }
};


const compressProfileImage = async (uri, quality = 0.6, maxWidth = 400) => {
  try {
    console.log(`Compressing profile image: ${uri.substring(0, 50)}...`);
    
    
    if (uri.startsWith('data:')) {
      console.log('Skipping compression for base64 image');
      return uri;
    }
    
    
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      console.log('Skipping compression for web URL');
      return uri;
    }
    
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }
    
    const originalSizeKB = (fileInfo.size / 1024);
    console.log(`Original profile image size: ${originalSizeKB.toFixed(2)} KB`);
    
    
    if (originalSizeKB < 200) {
      console.log('Image already small enough, skipping compression');
      return uri;
    }
    
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { 
        compress: quality, 
        format: SaveFormat.JPEG
      }
    );
    
    const compressedInfo = await FileSystem.getInfoAsync(manipResult.uri);
    const compressedSizeKB = (compressedInfo.size / 1024);
    console.log(`Compressed profile image size: ${compressedSizeKB.toFixed(2)} KB`);
    
    return manipResult.uri;
  } catch (error) {
    console.error("Error compressing profile image:", error);
    return uri; 
  }
};




export const GetUserCommands = async () => {
  try{
    const response = await axios.get(`${API_BASE_URL}/order`);


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