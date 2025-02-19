import React from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { NavigationContainer } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import IndexPage from "./index";
import SavesPage from "./Saves";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ActionSheetToAddProduct from "@/components/ActionSheetToAddProduct/ActionSheetToAddProduct"

export default function HomeLayouts() {


  



  const _renderIcon = (routeName: string, selectedTab: string) => {
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

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
      <CurvedBottomBarExpo.Navigator
        type="UP"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={80}
        circleWidth={0}
        bgColor="white"
        initialRouteName="الرئيسية"
        screenOptions={{
          headerShown: false
        }}
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert('Click Action')}
            >
              <FontAwesome6 name="plus" size={24} color="white" />

            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
        
      >
        <CurvedBottomBarExpo.Screen
          name="الرئيسية"
          position="RIGHT"
          component={IndexPage}
        />
        <CurvedBottomBarExpo.Screen
          name="المحفوظات"
          component={SavesPage}
          position="LEFT"
        />
      </CurvedBottomBarExpo.Navigator>
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
    paddingBottom: 5,
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