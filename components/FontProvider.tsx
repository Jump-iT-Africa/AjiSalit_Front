import React, { createContext, useContext } from "react";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

type FontContextType = {
  fontsLoaded: boolean;
};

const FontContext = createContext<FontContextType>({ fontsLoaded: false });

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = useFonts({
    Tajawal: require('../assets/fonts/Tajawal.ttf'),
    TajawalRegular: require('../assets/fonts/TajawalRegular.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontsContext = () => useContext(FontContext);