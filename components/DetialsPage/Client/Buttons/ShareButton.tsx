import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import Viewshot from "react-native-view-shot";
import { shareAsync } from  "expo-sharing";


const ShareButton = () => {

    const ViewShotRef = useRef();

    

    return (
        <View>
        <Text>ShareButton</Text>
        </View>
    )
}

export default ShareButton