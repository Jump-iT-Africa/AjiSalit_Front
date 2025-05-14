import { useNotification } from "@/context/NotificationContext";
import { selectUserData } from "@/store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HandleNotification() {
    const userData = useSelector(selectUserData);
    const { expoPushToken } = useNotification();
    const API_BASE_URL = 'https://api.ajisalit.com';

    useEffect(() => {
        async function updateUserToken() {
            try {
                let expoToken = await AsyncStorage.getItem('notification-push')
                let token = await AsyncStorage.getItem('token')

                if(!expoToken && expoPushToken){
                    expoToken = expoPushToken
                }          
                if(expoToken && userData.id && token){
                    let data = {
                        expoPushToken: expoToken
                    }
                    console.log(`${API_BASE_URL}/user/${userData.id}`, {tag:"URL"})
                    let response = await axios.put(`${API_BASE_URL}/user/${userData.id}`, data, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(response)
                    console.log("Response is ", response.data, {tag: 'Notification'});
                }
            } catch (e) {
                console.log("there's an error", e,  {tag: 'Notification'})
            }
        }
        updateUserToken()
    }, [expoPushToken, userData]);
    return null
}