import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Warning from "@/assets/images/warning.png"

const OrdersTabs = ({ onTabChange, activeTab = 'all' }) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);

  const tabs = [
    { id: 'completed', label: 'الطلبات المتأخرة', filter: 'completed', bg: "#FF4444" }, 
    { id: 'today', label: 'طلبات اليوم', filter: 'today', bg: "#FFAE00" }, 
    { id: 'all', label: 'الطلبات القادمة', filter: 'all', bg: "#2F752F" }
  ];

  const handleTabPress = (tab) => {
    setSelectedTab(tab.id);
    onTabChange(tab.filter);
  };

  const showWarning = selectedTab === 'completed';

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
              selectedTab === tab.id && { backgroundColor: "white" }
            ]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText,
              selectedTab === tab.id && { color: tab.bg }

            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Warning only appears when "الطلبات المتأخرة" is selected */}
      {showWarning && (
        <View style={styles.warningContainer} className='shadow'>
          <View style={styles.warningIcon}>
            <Image
                source={Warning}
                resizeMode="contain"
                className='w-10 h-10'
              />
          </View>
          <Text style={styles.warningText}>
            إذا لم تتمكن من إكمال الطلب في الوقت المحدد، لا تنس تحديث تاريخ التسليم لإبقاء زبائنك على اطلاع وكسب ثقتهم دائماً.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('0%'),
    paddingVertical: hp('1%'),
    marginHorizontal: hp('1.5%')
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: wp('6%'),
    padding: wp('1%'),
    marginBottom: hp('2%'),
    backgroundColor: "#E9E9EB"
  },
  tab: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabText: {
    fontFamily: 'TajawalRegular',
    fontSize: wp('3%'),
    color: '#000',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
    fontFamily: 'TajawalRegular',

  },
  warningContainer: {
    backgroundColor: '#FFAE00',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginLeft: wp('3%'),
    marginTop: wp('1%'),
  },
  warningIconText: {
    fontSize: wp('5%'),
  },
  warningText: {
    flex: 1,
    fontFamily: 'TajawalRegular',
    fontSize: wp('2.2%'),
    color: '#000',
    textAlign: 'right',
    lineHeight: wp('5%'),
  },
});

export default OrdersTabs;