import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import { View, Text, SafeAreaView,StyleSheet, Linking } from "react-native";
import { Overlay } from "./Overlay";


export default function Scanner()
{
    return(
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
            options={{
                title:"OverView",
                headerShown:false
            }}
            />

            <CameraView 
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={({data}) =>{
                    console.log("data", data);
                    Linking.openURL(data);
                }}
            />
            <Overlay />
        </SafeAreaView>
    )
}