// import React, { useState, useEffect } from 'react';
// import { Text, View, Platform } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [fcmToken, setFcmToken] = useState('');

//   useEffect(() => {
//     requestUserPermission();
//     const unsubscribe = messaging().onTokenRefresh(async token => {
//       setFcmToken(token);
//     });

//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('message handled in the background!', remoteMessage);
//     });

//     return unsubscribe;
//   }, []);

//   async function requestUserPermission() {
//     if (Device.isDevice) {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('Authorization status:', authStatus);
//         const token = await messaging().getToken();
//         setFcmToken(token);
//         console.log('FCM Token:', token);
//       }
//     } else {
//       alert('Must use physical device for Push Notifications');
//     }
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>FCM Token: {fcmToken}</Text>
//     </View>
//   );
// }
