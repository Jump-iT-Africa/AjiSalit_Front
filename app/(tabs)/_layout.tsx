import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarStyle:{display:"none"}
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          tabBarLabel: 'Home',
        }}
      />
    </Stack>
  );
}