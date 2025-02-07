import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
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