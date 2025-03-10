// @ts-nocheck

import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { NavigationContainer } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import HomePage from "./index"; 
import OrderHistory from "./OrderHistory";
import ScannerPage from "./Scanner";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import ActionSheetToAddProduct from '@/components/ActionSheetToAddProduct/ActionSheetToAddProduct';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsPage from './DetailsPage';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



const Stack = createStackNavigator();

function MainTabs() {
  const role = useSelector((state) => state.role.role); 
  
  const actionSheetRef = useRef(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const _renderIcon = (routeName, selectedTab) => {
    if (routeName === 'الرئيسية') {
      return (
        <View style={styles.tabContent}>
          <Entypo
            name="home"
            size={24}
            color={routeName === selectedTab ? '#2e752f' : 'gray'}
          />
          <Text style={[
            styles.tabText,
            { color: routeName === selectedTab ? '#2e752f' : 'gray' }
          ]} className='font-tajawalregular'>
            الرئيسية
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.tabContent}>
          <AntDesign
            name="clockcircle"
            size={24}
            color={routeName === selectedTab ? '#2e752f' : 'gray'}
          />
          <Text style={[
            styles.tabText,
            { color: routeName === selectedTab ? '#2e752f' : 'gray' }
          ]} className='font-tajawalregular'>
            المحفوظات
          </Text>
        </View>
      );
    }
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }:any) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  const handleCloseActionSheet = () => {
    setIsSheetVisible(false);
  };

  return (
    <>
      <CurvedBottomBarExpo.Navigator
        type="UP"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={80}
        circleWidth={30}
        bgColor="white"
        initialRouteName="الرئيسية"
        borderTopLeftRight
        screenOptions={{
          headerShown: false
        }}
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (role === 'company') {
                  setIsSheetVisible(true);
                  actionSheetRef.current?.show();
                } else {
                  navigate('Scanner');
                }
              }}
            >
              {role === 'company' ? (
                <FontAwesome6 name="plus" size={24} color="white" />
              ) : (
                <MaterialCommunityIcons name="qrcode-scan" size={29} color="white" />
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
        width={Dimensions.get('window').width}
        borderColor="green"
        borderWidth={1}
        id="main-navigator"
      >
        <CurvedBottomBarExpo.Screen
          name="الرئيسية"
          position="RIGHT"
          component={HomePage} 
        />
        <CurvedBottomBarExpo.Screen
          name="المحفوظات"
          component={OrderHistory}
          position="LEFT"
        />
      </CurvedBottomBarExpo.Navigator>
      <ActionSheetToAddProduct 
        ref={actionSheetRef}
        isVisible={isSheetVisible}
        onClose={handleCloseActionSheet}
      />
    </>
  );
}

function IndexWithBottomNav({ navigation, route }) {
  return (
    <MainTabs initialRouteName="الرئيسية" />
  );
}

export default function HomeLayouts() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Scanner" component={ScannerPage} />
      <Stack.Screen name="DetailsPage" component={DetailsPage} />
      <Stack.Screen name="index" component={IndexWithBottomNav} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    paddingTop: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden'
  },
  btnCircleUp: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E23744',
    bottom: 25,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center'
  }
});