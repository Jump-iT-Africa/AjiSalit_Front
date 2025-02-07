import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle:{display:"none"}
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          tabBarLabel: 'Home',
        }}
      />
    </Tabs>
  );
}