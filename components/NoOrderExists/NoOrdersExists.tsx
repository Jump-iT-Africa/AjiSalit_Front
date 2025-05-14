import { View, Image, Text,Dimensions } from "react-native";
import NoOrders from '@/assets/images/NoORders.png'
import Colors from "@/constants/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function NoOrdersExists()
{
    const { width, height } = Dimensions.get('window');
    const isSmallScreen = height < 700;
    return(
        <View style={{ 
            display:'flex',
            alignItems: 'center', 
            justifyContent: 'center', 
            marginTop: isSmallScreen ? hp('-2%') : hp('5%')
        }}>
            <View style={{ 
                width: wp('100%'), 
                height: hp('35%'),
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Image 
                    source={NoOrders}
                    resizeMode="contain"
                    style={{
                        width: isSmallScreen ? wp('70%') : wp('80%'),
                        height: isSmallScreen ? hp('30%') : hp('35%')
                    }}
                />
            </View>
            <View style={{ 
                marginTop: isSmallScreen ? hp('0%') : hp('2%')
            }}>
            <Text style={{
                    fontFamily: 'Tajawal',
                    fontSize: wp('5%'),
                    color: Colors.green,
                    textAlign: 'center'
                }}>
                    لا توجد أي نتائج!
                </Text>
            </View>
        </View>
    )
}