import { Stack } from "expo-router";

export default function Settings() {
  return (
        <Stack screenOptions={{ 
          headerShown: false,
        }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="UpdatePassword"/>
          <Stack.Screen name="Support"/>
          <Stack.Screen name="Security"/>
          <Stack.Screen name="About"/>
        </Stack>
  );
}
