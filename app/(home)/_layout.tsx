// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Platform
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import HomePage from "./index"; 
import OrderHistory from "./OrderHistory";
import ScannerPage from "./Scanner";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import ActionSheetToAddProduct from '@/components/ActionSheetToAddProduct/ActionSheetToAddProduct';
import DetailsPage from './DetailsPage';
import { useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { selectUserRole, selectUserData, fetchCurrentUserData } from "@/store/slices/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from "expo-router";
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '@/constants/Colors';
const AppStack = createStackNavigator();



function MainTabs() {
  const dispatch = useDispatch();
  const role = useSelector(selectUserRole);
  const userData = useSelector(selectUserData);
  
  const actionSheetRef = useRef(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [pocketValue, setPocketValue] = useState(0);
  
  const getLatestPocketValue = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user');
      if (userDataStr) {
        const parsedData = JSON.parse(userDataStr);
        if (parsedData && parsedData.pocket !== undefined) {
          console.log("Fresh pocket value from AsyncStorage:", parsedData.pocket);
          setPocketValue(parsedData.pocket);
          return parsedData.pocket;
        }
      }
      
      if (userData && userData.pocket !== undefined) {
        console.log("Using pocket value from Redux:", userData.pocket);
        setPocketValue(userData.pocket);
        return userData.pocket;
      }
      
      return 0;
    } catch (error) {
      console.error("Error getting pocket value:", error);
      return 0;
    }
  };
  
  useEffect(() => {
    const init = async () => {
      await getLatestPocketValue();
      
      dispatch(fetchCurrentUserData());
    };
    
    init();
  }, [dispatch]);
  
  useEffect(() => {
    if (userData && userData.pocket !== undefined) {
      console.log("Updating pocket value from Redux:", userData.pocket);
      setPocketValue(userData.pocket);
    }
  }, [userData]);
  
  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        await getLatestPocketValue();
        dispatch(fetchCurrentUserData());
      };
      
      refreshData();
      return () => {};
    }, [dispatch])
  );

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

  const handleCloseActionSheet = async () => {
    setIsSheetVisible(false);
    
    await getLatestPocketValue();
    dispatch(fetchCurrentUserData());
  };

  console.log("Current pocket value in MainTabs:", pocketValue);
  
  const isButtonDisabled = role === 'company' && pocketValue <= 0;

  return (
    <>
      <CurvedBottomBarExpo.Navigator
        type="UP"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={80}
        bgColor="white"
        initialRouteName="الرئيسية"
        borderTopLeftRight
        screenOptions={{
          headerShown: false
        }}
        renderCircle={({ selectedTab, navigate }) => (
          // <Animated.View style={[
          //   styles.btnCircleUp,
          //   isButtonDisabled ? styles.disabledButton : {}
          // ]}>
          <Animated.View style={[
            styles.btnCircleUp,
            ]}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (role === 'company') {
                  // Get the latest pocket value before checking
                  const currentPocket = await getLatestPocketValue();
                  
                  // Check pocket value before showing action sheet
                  if (currentPocket <= 0) {
                    Alert.alert(
                      "رصيد غير كافي",
                      "رصيدك 0 درهم، لن تتمكن من إنشاء طلبات جديدة. يرجى شحن الرصيد.",
                      [{ text: "حسنا", style: "cancel" }]
                    );
                  } else {
                    setIsSheetVisible(true);
                    actionSheetRef.current?.show();
                  }
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
        borderColor="transparent"
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
const Container = Platform.OS === 'android' 
    ? props => <SafeAreaView style={styles.androidSafeArea} edges={['top']} {...props} />
    : props => <View style={{flex: 1}} {...props} />;


export default function HomeLayouts() {
  return (
    <Container>
      <AppStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <AppStack.Screen name="MainTabs" component={MainTabs} />
        <AppStack.Screen name="Scanner" component={ScannerPage} />
        <AppStack.Screen name="DetailsPage" component={DetailsPage} />
        <AppStack.Screen name="index" component={IndexWithBottomNav} />
      </AppStack.Navigator>

    </Container>

  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOffset:{
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
    overflow: 'hidden',
    borderRadius: 0,
    
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
  disabledButton: {
    backgroundColor: '#999999',  // Gray color to indicate disabled state
    opacity: 0.7,
    
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
    textAlign: 'center',
  },
  androidSafeArea: {
    flex:1,
    backgroundColor: Colors.AppGray,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingBottom: Platform.OS === "android" ? 30 : -0,
  },
});