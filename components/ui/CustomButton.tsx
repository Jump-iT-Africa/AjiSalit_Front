import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface CustomButtonProps{
    onPress: ()=> void,
    title: string,
    textStyles?:string,
    containerStyles?:string
}


const CustomButton = ({onPress, title, textStyles = "", containerStyles =""}:CustomButtonProps) => {
  return (
    <TouchableOpacity 
        activeOpacity={0.7} 
        className={`bg-[#F52525] rounded-full min-h-[62px] justify-center items-center text-white ${containerStyles}  `}
        onPress={onPress}
        >
        <Text className={`font-semibold text-lg text-white  font-tajawalregular mt-1 ${textStyles}  `}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton