import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

// API URL - same as in your Redux files
const API_URL = 'https://api.ajisalit.com';

// Define task name
const BACKGROUND_DELIVERY_CHECK = 'background-delivery-check';

// TEST MODE: Set to true to test with shorter intervals
const TEST_MODE = true;

// Notification times (for production mode)
const MORNING_NOTIFICATION_TIME = 10; // 10 AM
const AFTERNOON_NOTIFICATION_TIME = 17; // 5 PM

// Test mode intervals in minutes
const TEST_INTERVAL_MINUTES = 1; // Run every 3 minutes for testing

// Setup logging system
const LOG_FILE_PATH = FileSystem.documentDirectory + 'notification_logs.txt';

// Function to log messages with timestamps (both console and file)
const logMessage = async (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(`[NOTIFICATION SERVICE] ${message}`);
  
  // Log to file
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
    
    if (fileInfo.exists) {
      // Append to existing file
      await FileSystem.writeAsStringAsync(
        LOG_FILE_PATH,
        logEntry,
        { encoding: FileSystem.EncodingType.UTF8, append: true }
      );
    } else {
      // Create new file
      await FileSystem.writeAsStringAsync(
        LOG_FILE_PATH,
        logEntry,
        { encoding: FileSystem.EncodingType.UTF8 }
      );
    }
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};

// Function to read logs
export const readNotificationLogs = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(LOG_FILE_PATH);
    if (fileInfo.exists) {
      return await FileSystem.readAsStringAsync(LOG_FILE_PATH);
    }
    return "No logs found";
  } catch (error) {
    console.error('Error reading log file:', error);
    return "Error reading logs: " + error.message;
  }
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => {
    await logMessage("Handling incoming notification");
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

// Function to parse date strings
const parseDate = (dateString) => {
  if (!dateString || dateString === 'غير محدد') return null;
  
  try {
    // Check if ISO format date
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
    
    // Check if DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    
    return null;
  } catch (error) {
    logMessage(`Error parsing date: ${dateString}, error: ${error}`);
    return null;
  }
};

// Function to check if delivery date has passed
const isDeliveryDatePassed = (order) => {
  // Check rawDeliveryDate first if available
  if (order.rawDeliveryDate) {
    try {
      const delivery = new Date(order.rawDeliveryDate);
      if (isNaN(delivery.getTime())) {
        logMessage(`Invalid rawDeliveryDate: ${order.rawDeliveryDate}`);
        return false;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const deliveryDateOnly = new Date(delivery);
      deliveryDateOnly.setHours(0, 0, 0, 0);
      
      return deliveryDateOnly <= today;
    } catch (error) {
      logMessage(`Error with rawDeliveryDate: ${error}`);
    }
  }
  
  // Fallback to formatted deliveryDate
  const deliveryDate = order.deliveryDate;
  if (!deliveryDate || deliveryDate === 'غير محدد') return false;
  
  try {
    const delivery = parseDate(deliveryDate);
    if (!delivery || isNaN(delivery.getTime())) {
      logMessage(`Invalid deliveryDate format: ${deliveryDate}`);
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return delivery <= today;
  } catch (error) {
    logMessage(`Error checking delivery date: ${error}, deliveryDate: ${deliveryDate}`);
    return false;
  }
};

// Function to send API notification
const sendDeliveryReminderApi = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      logMessage('No token available for API call');
      return false;
    }
    
    logMessage('Sending API reminder notification...');
    
    const response = await axios.post(
      `${API_URL}/notifications/reminder`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    logMessage(`API reminder notification sent successfully: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    logMessage(`Failed to send API reminder: ${error.message}`);
    if (error.response) {
      logMessage(`API error status: ${error.response.status}`);
      logMessage(`API error data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
};

// Check if it's time to send a notification
const isNotificationTime = () => {
  // In test mode, always return true to run every time
  if (TEST_MODE) {
    return 'test';
  }
  
  // Production mode - check for 10 AM or 5 PM
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Check if it's 10 AM (between 10:00 and 10:15)
  if (currentHour === MORNING_NOTIFICATION_TIME && currentMinute < 15) {
    return 'morning';
  }
  
  // Check if it's 5 PM (between 17:00 and 17:15)
  if (currentHour === AFTERNOON_NOTIFICATION_TIME && currentMinute < 15) {
    return 'afternoon';
  }
  
  return false;
};

// For test mode: Check if enough time has passed since last test notification
const canSendTestNotification = async () => {
  if (!TEST_MODE) return false;
  
  const lastTestCheck = await AsyncStorage.getItem('lastTestReminderCheck');
  if (!lastTestCheck) return true;
  
  const now = new Date().getTime();
  const lastCheckTime = parseInt(lastTestCheck);
  
  // Check if TEST_INTERVAL_MINUTES minutes have passed
  return (now - lastCheckTime) >= (TEST_INTERVAL_MINUTES * 60 * 1000);
};

// Define the background task
TaskManager.defineTask(BACKGROUND_DELIVERY_CHECK, async () => {
  try {
    await logMessage('Background delivery check task started');
    
    // Special handling for test mode
    if (TEST_MODE) {
      await logMessage('Running in TEST MODE');
      
      // Check if enough time has passed since the last test notification
      const canSendTest = await canSendTestNotification();
      if (!canSendTest) {
        const lastTestCheck = await AsyncStorage.getItem('lastTestReminderCheck');
        const lastTime = new Date(parseInt(lastTestCheck)).toLocaleTimeString();
        await logMessage(`Test interval (${TEST_INTERVAL_MINUTES} minutes) not elapsed since last test at ${lastTime}`);
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }
      
      await logMessage(`Test interval of ${TEST_INTERVAL_MINUTES} minutes has elapsed, proceeding with test notification`);
    } else {
      // Production mode - check if it's 10 AM or 5 PM
      const notificationPeriod = isNotificationTime();
      if (!notificationPeriod) {
        await logMessage('Not notification time (10 AM or 5 PM), exiting task');
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }
      
      await logMessage(`It's ${notificationPeriod} notification time`);
      
      // Check if we've already sent reminders for this period today
      const today = new Date().toDateString();
      const lastMorningCheck = await AsyncStorage.getItem('lastMorningReminderCheck');
      const lastAfternoonCheck = await AsyncStorage.getItem('lastAfternoonReminderCheck');
      
      if (notificationPeriod === 'morning' && lastMorningCheck === today) {
        await logMessage('Already sent morning reminders today');
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }
      
      if (notificationPeriod === 'afternoon' && lastAfternoonCheck === today) {
        await logMessage('Already sent afternoon reminders today');
        return BackgroundFetch.BackgroundFetchResult.NoData;
      }
    }
    
    // Get token to check if user is authenticated
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      await logMessage('No authentication token, skipping check');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    // Get cached orders from AsyncStorage
    const cachedOrdersJson = await AsyncStorage.getItem('cachedOrders');
    if (!cachedOrdersJson) {
      await logMessage('No cached orders found');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    const cachedOrders = JSON.parse(cachedOrdersJson);
    await logMessage(`Retrieved ${cachedOrders.length} cached orders from storage`);
    
    // Find overdue orders
    const overdueOrders = cachedOrders.filter(order => 
      isDeliveryDatePassed(order) && 
      !order.isFinished
    );
    
    await logMessage(`Found ${overdueOrders.length} overdue orders`);
    
    if (overdueOrders.length > 0) {
      // Send API notification
      await logMessage('Sending notifications for overdue orders');
      const apiSuccess = await sendDeliveryReminderApi();
      
      if (apiSuccess) {
        await logMessage('API notification sent successfully');
      } else {
        await logMessage('API notification failed, trying to send local notification');
      }
      
      // Also send a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "طلبات متأخرة",
          body: `هناك ${overdueOrders.length} طلب(ات) متأخرة تحتاج إلى تأكيد`,
          data: { 
            screen: 'orders',
            orderCodes: overdueOrders.map(o => o.orderCode || o.id).join(', ')
          },
        },
        trigger: null, // Send immediately
      });
      
      await logMessage('Local notification scheduled');
      
      // Record that we sent reminders
      if (TEST_MODE) {
        // In test mode, store timestamp for interval checking
        await AsyncStorage.setItem('lastTestReminderCheck', new Date().getTime().toString());
        await logMessage(`Test notification sent and recorded at ${new Date().toLocaleTimeString()}`);
      } else {
        // In production mode, store the date
        const today = new Date().toDateString();
        const notificationPeriod = isNotificationTime();
        
        if (notificationPeriod === 'morning') {
          await AsyncStorage.setItem('lastMorningReminderCheck', today);
          await logMessage('Morning reminder recorded for today');
        } else {
          await AsyncStorage.setItem('lastAfternoonReminderCheck', today);
          await logMessage('Afternoon reminder recorded for today');
        }
      }
      
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      await logMessage('No overdue orders found that need reminders');
      
      // In test mode, still record that we did a check
      if (TEST_MODE) {
        await AsyncStorage.setItem('lastTestReminderCheck', new Date().getTime().toString());
        await logMessage(`Test check completed at ${new Date().toLocaleTimeString()} - no overdue orders`);
      }
      
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    await logMessage(`Error in background delivery check: ${error.message}`);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Setup notifications permission
const setupNotifications = async () => {
  try {
    await logMessage('Setting up notification permissions');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    await logMessage(`Current notification permission status: ${existingStatus}`);
    
    if (existingStatus !== 'granted') {
      await logMessage('Requesting notification permissions');
      const { status } = await Notifications.requestPermissionsAsync();
      await logMessage(`New notification permission status: ${status}`);
      if (status !== 'granted') {
        await logMessage('Notification permission denied by user');
        return false;
      }
    }
    
    await logMessage('Notification permissions granted');
    return true;
  } catch (error) {
    await logMessage(`Error checking notification permissions: ${error.message}`);
    return false;
  }
};

// Register the background fetch task
const registerBackgroundFetchTask = async () => {
  try {
    await logMessage('Registering background fetch task');
    
    // First check if task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_DELIVERY_CHECK);
    await logMessage(`Background task already registered: ${isRegistered}`);
    
    if (!isRegistered) {
      // In test mode, use a shorter interval
      const interval = TEST_MODE ? 
        Math.max(60, TEST_INTERVAL_MINUTES * 60) : // Minimum 60 seconds
        900; // 15 minutes minimum for production
      
      await BackgroundFetch.registerTaskAsync(BACKGROUND_DELIVERY_CHECK, {
        minimumInterval: interval,
        stopOnTerminate: false, // continue task when app is terminated
        startOnBoot: true, // start task when device reboots
      });
      
      await logMessage(`Background fetch task registered with ${interval} second interval (${TEST_MODE ? 'TEST MODE' : 'PRODUCTION MODE'})`);
    } else {
      // Update the task to make sure it has the correct settings
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_DELIVERY_CHECK);
      await logMessage('Unregistered existing task to update settings');
      
      // In test mode, use a shorter interval
      const interval = TEST_MODE ? 
        Math.max(60, TEST_INTERVAL_MINUTES * 60) : // Minimum 60 seconds
        900; // 15 minutes minimum for production
      
      await BackgroundFetch.registerTaskAsync(BACKGROUND_DELIVERY_CHECK, {
        minimumInterval: interval,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      
      await logMessage(`Re-registered background fetch task with ${interval} second interval (${TEST_MODE ? 'TEST MODE' : 'PRODUCTION MODE'})`);
    }
    
    // Clear any previous test record to force an immediate check
    if (TEST_MODE) {
      await AsyncStorage.removeItem('lastTestReminderCheck');
      await logMessage('Cleared previous test record to allow immediate check');
    }
    
  } catch (error) {
    await logMessage(`Error registering background fetch task: ${error.message}`);
  }
};

// Helper function to get the next notification time (10 AM or 5 PM)
const getNextNotificationTime = () => {
  // In test mode, calculate based on the test interval
  if (TEST_MODE) {
    const now = new Date();
    const result = new Date(now);
    result.setMinutes(now.getMinutes() + TEST_INTERVAL_MINUTES);
    return result;
  }
  
  // Production mode - 10 AM or 5 PM logic
  const now = new Date();
  const result = new Date(now);
  
  // If before 10 AM, set to 10 AM today
  if (now.getHours() < MORNING_NOTIFICATION_TIME) {
    result.setHours(MORNING_NOTIFICATION_TIME, 0, 0, 0);
    return result;
  }
  
  // If before 5 PM, set to 5 PM today
  if (now.getHours() < AFTERNOON_NOTIFICATION_TIME) {
    result.setHours(AFTERNOON_NOTIFICATION_TIME, 0, 0, 0);
    return result;
  }
  
  // After 5 PM, set to 10 AM tomorrow
  result.setDate(result.getDate() + 1);
  result.setHours(MORNING_NOTIFICATION_TIME, 0, 0, 0);
  return result;
};

// React component that sets up the background service
const BackgroundNotificationService = () => {
  useEffect(() => {
    const setupBackgroundService = async () => {
      await logMessage('=== BackgroundNotificationService component mounted ===');
      
      // Request notification permissions
      const notificationPermissionGranted = await setupNotifications();
      
      if (notificationPermissionGranted) {
        await logMessage('Notification permissions granted, registering background task');
        
        // Register background fetch task
        await registerBackgroundFetchTask();
        
        if (TEST_MODE) {
          await logMessage('TEST MODE ACTIVE: Running check immediately');
          
          // In test mode, run the task immediately to test notifications
          await AsyncStorage.removeItem('lastTestReminderCheck');
          await logMessage('Cleared test timestamp to force immediate check');
          
          // Execute the task after a short delay to ensure everything is set up
          setTimeout(async () => {
            await logMessage('Running immediate test check...');
            try {
              const result = await BackgroundFetch.executeTaskAsync(BACKGROUND_DELIVERY_CHECK);
              await logMessage(`Immediate test check complete with result: ${result}`);
            } catch (error) {
              await logMessage(`Error running immediate test: ${error.message}`);
            }
          }, 2000);
        } else {
          // Production mode
          const notificationPeriod = isNotificationTime();
          if (notificationPeriod) {
            await logMessage(`Current time is within ${notificationPeriod} notification window`);
            
            // Check if we've already sent a notification for this period today
            const today = new Date().toDateString();
            const lastCheck = await AsyncStorage.getItem(
              notificationPeriod === 'morning' ? 'lastMorningReminderCheck' : 'lastAfternoonReminderCheck'
            );
            
            if (lastCheck !== today) {
              await logMessage('Running task manually since we are in notification window');
              await BackgroundFetch.executeTaskAsync(BACKGROUND_DELIVERY_CHECK);
            } else {
              await logMessage(`Already sent ${notificationPeriod} notification today, skipping`);
            }
          } else {
            await logMessage('Not in notification window (10 AM or 5 PM), skipping immediate check');
            
            // Log when the next check will be
            const nextTime = getNextNotificationTime();
            await logMessage(`Next scheduled notification time: ${nextTime.toLocaleString()}`);
          }
        }
      } else {
        await logMessage('Notification permissions not granted, background service will not work properly');
      }
    };
    
    setupBackgroundService();
    
    return () => {
      // We don't unregister on component unmount since we want it to continue running in background
      logMessage('BackgroundNotificationService component unmounted, but background task remains active');
    };
  }, []);
  
  return null; // This component doesn't render anything
};

// Function to manually view logs (can be called from a settings screen)
export const viewNotificationLogs = async () => {
  try {
    return await readNotificationLogs();
  } catch (error) {
    console.error('Error reading logs:', error);
    return "Error reading logs: " + error.message;
  }
};

// Function to manually trigger a check (can be used for testing)
export const manuallyTriggerCheck = async () => {
  await logMessage('Manual check triggered by user');
  
  // For manual testing, clear the last test check timestamp to force a notification
  if (TEST_MODE) {
    await AsyncStorage.removeItem('lastTestReminderCheck');
    await logMessage('Cleared last test timestamp to force notification');
  }
  
  return await BackgroundFetch.executeTaskAsync(BACKGROUND_DELIVERY_CHECK);
};

// Function to toggle test mode (for UI)
export const toggleTestMode = async (enabled) => {
  await logMessage(`Test mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  
  // Store the test mode setting
  await AsyncStorage.setItem('notificationTestMode', enabled ? 'true' : 'false');
  
  // Re-register the task with new settings
  await BackgroundFetch.unregisterTaskAsync(BACKGROUND_DELIVERY_CHECK);
  
  const interval = enabled ? 
    Math.max(60, TEST_INTERVAL_MINUTES * 60) : // Minimum 60 seconds for test mode
    900; // 15 minutes for production
  
  await BackgroundFetch.registerTaskAsync(BACKGROUND_DELIVERY_CHECK, {
    minimumInterval: interval,
    stopOnTerminate: false,
    startOnBoot: true,
  });
  
  await logMessage(`Background task re-registered with ${interval} second interval (${enabled ? 'TEST MODE' : 'PRODUCTION MODE'})`);
  
  // Clear the last check timestamp to force a new check
  if (enabled) {
    await AsyncStorage.removeItem('lastTestReminderCheck');
  }
  
  return true;
};

// Function to check if test mode is enabled
export const isTestModeEnabled = async () => {
  const testMode = await AsyncStorage.getItem('notificationTestMode');
  return testMode === 'true';
};

export default BackgroundNotificationService;