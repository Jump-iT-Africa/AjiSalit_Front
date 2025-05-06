import { View, StyleSheet, TouchableOpacity,Text } from "react-native";
import Divider from "../ui/Devider";
import QRCode from "react-native-qrcode-svg";
import Colors from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';



export default function QrCodeInfo({uniqueId})
{

    

    console.log(uniqueId);

    const copyToClipboard = async (uniqueId) => {
        await Clipboard.setStringAsync(uniqueId);
    }

    return(
        <View className="bg-white w-[95%] mx-auto mb-6 pb-6" style={styles.qrContainer}> 
            <View >
                <View className="flex-row items-center justify-center my-7" style={styles.qrStyling}>
                <QRCode 
                    value={uniqueId}
                    size={180}
                    logo={require('@/assets/images/MoroccoLogo.png')}
                    logoSize={40}
                    logoBackgroundColor="white"
                    />
                </View>
            </View>
            <View className=" w-[90%] mx-auto">
                <View style={styles.divider} />
                    <Text style={styles.manualEntryText} className='font-tajawalregular text-center absolute bg-white left-[30%]'>أو أدخل الرمز يدويًا</Text>
                    
                    <View style={styles.idContainer}>
                        <Text style={styles.idText}>{uniqueId}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={()=>copyToClipboard(uniqueId)}>
                        <Ionicons name="copy-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            <View>
                <View></View>
                <View></View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    qrContainer:{
        borderRadius:8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        
    },
    qrStyling:{
        padding: 15,
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderColor: Colors.green,
        borderRadius: 10,
        marginBottom: 20,
       marginRight:85,
       marginLeft:85
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    manualEntryText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderWidth: 1.5,
        borderColor: Colors.gray,
        borderRadius: 50,
        padding: 0,
        paddingRight: 0,
        width: '100%',
        marginTop:8
    },
    idText: {
        flex: 1,
        fontSize: 18,
        textAlign: 'left',
        fontWeight:600,
        paddingLeft:20        
    },
    copyButton: {
        backgroundColor: Colors.green,
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
})