import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  return (
    <View style={styles.container}>
        <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "right",
    color: "#333",
    marginBottom: 10,
  },
});
