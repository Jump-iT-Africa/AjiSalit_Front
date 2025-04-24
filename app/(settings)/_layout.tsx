import { Stack } from "expo-router";

export default function Settings() {
  return (
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'fade'
        }}>
          <Stack.Screen name="index"/>
        </Stack>
      
  );
}
