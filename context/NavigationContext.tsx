import React, { createContext, useState, useContext } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [lastRefreshedScreen, setLastRefreshedScreen] = useState(null);

  const refreshScreen = (screenName) => {
    setLastRefreshedScreen({ name: screenName, timestamp: Date.now() });
  };

  return (
    <NavigationContext.Provider value={{ lastRefreshedScreen, refreshScreen }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);