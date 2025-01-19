import { Slot } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  return (
    <ToastProvider
      placement="top"
      duration={4000}
      animationType="slide-in"
      successColor="green"
      dangerColor="red"
      warningColor="orange"
      normalColor="gray"
    >
      <Slot />
    </ToastProvider>
  );
}