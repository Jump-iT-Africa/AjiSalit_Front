import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredExpiredOrdersCount, setTabFilter } from '@/store/slices/OrdersSlice.js'; 
import Warning from "@/assets/images/warning.png"

const com.mansorytvproo.app = ({ onTabChange, activeTab = 'completed' }) => {
  const dispatch = useDispatch();
  
  // Get the count of filtered expired orders
  const expiredOrdersCount = useSelector(selectFilteredExpiredOrdersCount);
  
  // Get the current tab filter from Redux to stay in sync
  const currentTabFilter = useSelector(state => state.orders.tabFilter);
  
  // Use Redux state as the source of truth for selected tab
  const [selectedTab, setSelectedTab] = useState(currentTabFilter || activeTab);
  
  const tabs = [
    { id: 'all', label: 'الطلبات القادمة', filter: 'all', bg: "#2F752F" },
    { id: 'today', label: 'طلبات اليوم', filter: 'today', bg: "#FFAE00" },
    { id: 'completed', label: 'الطلبات المتأخرة', filter: 'completed', bg: "#FF4444" }
  ];

  // Initialize the tab filter in Redux when component mounts
  useEffect(() => {
    console.log('🎯 com.mansorytvproo.app mounted with activeTab:', activeTab);
    console.log('🎯 Current Redux tabFilter:', currentTabFilter);
    
    // If Redux state doesn't match the activeTab prop, update Redux
    if (currentTabFilter !== activeTab) {
      console.log('🔄 Syncing Redux tabFilter with activeTab prop');
      dispatch(setTabFilter(activeTab));
      setSelectedTab(activeTab); // Also update local state
    } else {
      // Make sure local state matches Redux state
      setSelectedTab(currentTabFilter);
    }
    
    // Also call the callback to ensure parent is in sync
    onTabChange(activeTab);
  }, [activeTab, dispatch, onTabChange]);

  // Keep local state in sync with Redux state
  useEffect(() => {
    if (currentTabFilter && currentTabFilter !== selectedTab) {
      console.log('🔄 Syncing selectedTab with Redux tabFilter:', currentTabFilter);
      setSelectedTab(currentTabFilter);
    }
  }, [currentTabFilter]);

  const handleTabPress = (tab) => {
    console.log('🎯 Tab pressed:', tab.id, 'filter:', tab.filter);
    
    setSelectedTab(tab.id);
    
    // Update Redux state
    dispatch(setTabFilter(tab.filter));
    
    // Call parent callback
    onTabChange(tab.filter);
  };

  console.log('🎯 com.mansorytvproo.app state:', {
    selectedTab,
    activeTab,
    currentTabFilter,
    expiredOrdersCount
  });
  
  // Show warning only if completed tab is selected AND there are expired orders
  const showWarning = selectedTab === 'completed' && expiredOrdersCount > 0;

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

export default com.mansorytvproo.app;