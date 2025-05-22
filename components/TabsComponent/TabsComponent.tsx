import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const OrdersTabs = ({ onTabChange, activeTab = 'all' }) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);

  const tabs = [
    { id: 'completed', label: 'الطلبات المتأخرة', filter: 'completed' },
    { id: 'today', label: 'طلبات اليوم', filter: 'today' },
    { id: 'all', label: 'جميع الطلبات', filter: 'all' }
  ];

  const handleTabPress = (tab) => {
    setSelectedTab(tab.id);
    onTabChange(tab.filter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab
            ]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.warningContainer}>
        <View style={styles.warningIcon}>
          <Text style={styles.warningIconText}>⚠️</Text>
        </View>
        <Text style={styles.warningText}>
          إذا لم تتمكن من إكمال الطلب في الوقت المحدد، لا تنس تحديث تاريخ التسليم لإبقاء زبائنك على اطلاع وكسب ثقتهم دائماً.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },
  tabsContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#f3f4f6',
    borderRadius: wp('6%'),
    padding: wp('1%'),
    marginBottom: hp('2%'),
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
    backgroundColor: '#FD8900',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontFamily: 'TajawalRegular',
    fontSize: wp('3.5%'),
    color: '#6b7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
    fontFamily: 'Tajawal',
    fontWeight: '600',
  },
  warningContainer: {
    backgroundColor: '#FEF3CD',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FD8900',
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
    fontSize: wp('3.2%'),
    color: '#92400e',
    textAlign: 'right',
    lineHeight: wp('5%'),
  },
});

export default OrdersTabs;