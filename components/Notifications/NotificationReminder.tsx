import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredOrders } from '@/store/slices/OrdersSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendDeliveryReminder } from '@/store/slices/OrdersManagment';
import * as Notifications from 'expo-notifications';

const setupNotifications = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log("Notification permission status:", existingStatus);
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("New notification permission status:", status);
      if (status !== 'granted') {
        console.log("Notification permission denied");
        return false;
      }
    }
    return true;
  } catch (error) {
    console.log("Error checking notification permissions:", error);
    return false;
  }
};

const DeliveryReminderService = () => {
  const dispatch = useDispatch();
  const filteredOrders = useSelector(selectFilteredOrders);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const token = useSelector(state => state.user.token);

  
  useEffect(() => {
    setupNotifications();
  }, []);

  
  const parseDate = (dateString) => {
    if (!dateString || dateString === 'غير محدد') return null;
    
    try {
      
      if (dateString.includes('T')) {
        return new Date(dateString);
      }
      
      
      const parts = dateString.split('/');
      if (parts.length === 3) {
        
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
      
      return null;
    } catch (error) {
      console.log('Error parsing date:', dateString, error);
      return null;
    }
  };

  
  const isDeliveryDatePassed = (order) => {
    
    if (order.rawDeliveryDate) {
      try {
        const delivery = new Date(order.rawDeliveryDate);
        if (isNaN(delivery.getTime())) {
          console.log('Invalid rawDeliveryDate:', order.rawDeliveryDate);
          return false;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const deliveryDateOnly = new Date(delivery);
        deliveryDateOnly.setHours(0, 0, 0, 0);
        
        return deliveryDateOnly <= today;
      } catch (error) {
        console.log('Error with rawDeliveryDate:', error);
        
      }
    }
    
    
    const deliveryDate = order.deliveryDate;
    if (!deliveryDate || deliveryDate === 'غير محدد') return false;
    
    try {
      const delivery = parseDate(deliveryDate);
      if (!delivery || isNaN(delivery.getTime())) {
        console.log('Invalid deliveryDate format:', deliveryDate);
        return false;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return delivery <= today;
    } catch (error) {
      console.log('Error checking delivery date:', error, deliveryDate);
      return false;
    }
  };
  
  
  const sendLocalTestNotification = async (overdueOrders) => {
    try {
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "طلبات متأخرة",
          body: `هناك ${overdueOrders.length} طلب(ات) متأخرة تحتاج إلى تأكيد`,
          data: { 
            screen: 'orders',
            orderCodes: overdueOrders.map(o => o.orderCode || o.id).join(', ')
          },
        },
        trigger: null, 
      });
      
      console.log("Local test notification scheduled");
    } catch (error) {
      console.log("Error scheduling local notification:", error);
    }
  };

  
  useEffect(() => {
    const checkOverdueOrders = async () => {
      if (!isAuthenticated || !token || !filteredOrders || !Array.isArray(filteredOrders)) {
        console.log('Prerequisites not met for checking orders');
        return;
      }
      
      try {
        
        const lastReminderCheck = await AsyncStorage.getItem('lastReminderCheck');
        const today = new Date().toDateString();
        
        // if (lastReminderCheck === today) {
        //   console.log('Already sent reminders today');
        //   return;
        // }
        
        console.log('Checking for overdue orders...');
        console.log('Total orders to check:', filteredOrders.length);
        
        
        const overdueOrders = filteredOrders.filter(order => {
          const isOverdue = isDeliveryDatePassed(order);
          const isUnfinished = !order.isFinished;
          
          return isOverdue && isUnfinished;
        });
        
        console.log('Found overdue orders:', overdueOrders.length);
        
        if (overdueOrders.length > 0) {
          console.log('Overdue orders:', overdueOrders.map(o => o.orderCode || o.id));
          
          
          console.log('Sending API notification...');
          await dispatch(sendDeliveryReminder());
          console.log('API notification request completed');
          
          
          console.log('Sending local notification...');
        //   await sendLocalTestNotification(overdueOrders);
          
          
          await AsyncStorage.setItem('lastReminderCheck', today);
          
          console.log('Reminders sent and recorded for today');
        } else {
          console.log('No overdue orders found that need reminders');
        }
        
      } catch (error) {
        console.log('Error in delivery reminder service:', error);
      }
    };
    
    
    const timer = setTimeout(() => {
      checkOverdueOrders();
    }, 3600000);
    
    return () => clearTimeout(timer);
  }, [dispatch, filteredOrders, isAuthenticated, token]);
  
  
  useEffect(() => {
    const intervalCheck = setInterval(() => {
      console.log('Running hourly reminder check...');
      
      
      if (isAuthenticated && token && filteredOrders && Array.isArray(filteredOrders)) {
        const checkOverdueOrdersInterval = async () => {
          try {
            
            const lastReminderCheck = await AsyncStorage.getItem('lastReminderCheck');
            const today = new Date().toDateString();
            
            // if (lastReminderCheck === today) {
            //   console.log('Already sent reminders today (hourly check)');
            //   return;
            // }
            
            
            console.log('Hourly check: Checking for overdue orders...');
            
            const overdueOrders = filteredOrders.filter(order => 
              isDeliveryDatePassed(order) && 
              !order.isFinished
            );
            
            if (overdueOrders.length > 0) {
              await dispatch(sendDeliveryReminder());
            //   await sendLocalTestNotification(overdueOrders);
              await AsyncStorage.setItem('lastReminderCheck', today);
              console.log('Hourly check: Sent reminders and recorded for today');
            }
          } catch (error) {
            console.log('Error in periodic reminder check:', error);
          }
        };
        
        checkOverdueOrdersInterval();
      }
    }, 3600000); 
    //3600000
    //kndir check kola sa3a oknsift lih notif
    
    return () => clearInterval(intervalCheck);
  }, [dispatch, filteredOrders, isAuthenticated, token]);

  
  return null;
};

export default DeliveryReminderService;