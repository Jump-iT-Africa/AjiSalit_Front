import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'fade'
          // animation: 'simple_push',
          // animation: 'slide_from_right',
        }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="AccountType" />
          <Stack.Screen name="CreatePIN" />
          <Stack.Screen name="ConfirmPIN" />
          <Stack.Screen name="OtpVerification" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="IntePassword" />
        </Stack>
      
  );
}
