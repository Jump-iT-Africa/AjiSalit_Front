import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { Text } from "react-native";
import { FontProvider } from '@/components/FontProvider';



export default function App() {
  return (
    
    <FontProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.tajawalText}>أجي راه سليت</Text>
      </View>
    </FontProvider>
  );
}
