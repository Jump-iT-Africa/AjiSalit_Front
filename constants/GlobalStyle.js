import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  androidSafeArea: {
    flex:1,
    backgroundColor: "#f2f2f2",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingBottom: 0
  },
});