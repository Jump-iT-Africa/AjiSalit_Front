import { View, Image, Text } from "react-native";
import NoOrders from '@/assets/images/historyNoOrders.png'
import Colors from "@/constants/Colors";


export default function NoOrdersExistsHistory()
{
    return(
        <View className="flex items-center justify-center ">
            <View className="w-80 h-80">
                <Image 
                    source={NoOrders}
                    resizeMode="contain"
                    className="w-80 "
                />
            </View>
            <View>
                <Text className="font-tajawal text-xl mt-0" style={{color:Colors.green}}>
                    لا توجد أي نتائج!
                </Text>
            </View>
        </View>
    )
}