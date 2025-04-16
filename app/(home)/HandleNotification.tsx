import { useNotification } from "@/context/NotificationContext";
import { selectUserData } from "@/store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HandleNotification() {
    const { expoPushToken } = useNotification();
    const userData = useSelector(selectUserData);
    const API_BASE_URL = 'http://192.168.100.175:3000';

    useEffect(() => {
        console.log("heeeeeeere")
        async function updateUserToken() {
            try {
                let data = {
                    expoPushToken: expoPushToken
                }
                let token = await AsyncStorage.getItem('token')
                console.log("User date and info", userData.id, token, data)
                let response = await axios.put(`${API_BASE_URL}/user/${userData.id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log("Response is ", response.data, {tag: 'Notification'});

            } catch (e) {
                console.log("there's an error", e,  {tag: 'Notification'})
            }
        }
        updateUserToken()
    }, [expoPushToken, userData]);
    return null
}