import { View, Image, Text } from "react-native";
import NoOrders from '@/assets/images/NoORders.png'
import Colors from "@/constants/Colors";


export default function NoOrdersExists()
{
    return(
        <View className="flex items-center justify-center mt-20">
            <View>
                <Image source={NoOrders}
                className="w-40 h-40"
                />
            </View>
            <View>
                <Text className="font-tajawal text-xl mt-2" style={{color:Colors.green}}>
                    لا توجد أي نتائج!
                </Text>
            </View>
        </View>
    )
}