import { Stack } from "expo-router";

export default function Profile() {
  return (
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'fade'
        }}>
          <Stack.Screen name="Profile"/>
        </Stack>
      
  );
}
