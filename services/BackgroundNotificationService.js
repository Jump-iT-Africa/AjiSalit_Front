import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { AppState, Platform } from 'react-native';

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
const TEST_INTERVAL_MINUTES = 1; // Run every 1 minute for testing

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

// Clear logs function for testing
export const clearNotificationLogs = async () => {
  try {
    await FileSystem.deleteAsync(LOG_FILE_PATH, { idempotent: true });
    await logMessage('=== Log file cleared for new test ===');
    return "Logs cleared successfully";
  } catch (error) {
    console.error('Error clearing logs:', error);
    return "Error clearing logs: " + error.message;
  }
};

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

// Function to send API notification (your database-based notification)
const sendDeliveryReminderApi = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      logMessage('No token available for API call');
      return false;
    }
    
    logMessage('Sending API reminder notification...');
    
    // Make a more detailed log of the request for debugging
    logMessage(`API Request details: 
      URL: ${API_URL}/notifications/reminder
      Token: ${token ? token.substring(0, 10) + '...' : 'null'}
    `);
    
    const response = await axios.post(
      `${API_URL}/notifications/reminder`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 15000 // 15 second timeout to prevent hanging
      }
    );
    
    logMessage(`API reminder notification sent successfully: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    logMessage(`Failed to send API reminder: ${error.message}`);
    if (error.response) {
      logMessage(`API error status: ${error.response.status}`);
      logMessage(`API error data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      logMessage(`No response received from API: ${error.request}`);
    } else {
      // Something happened in setting up the request
      logMessage(`Error setting up API request: ${error.message}`);
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

// The core notification logic that does all the checks and sends notifications
export const checkAndSendNotifications = async () => {
  try {
    await logMessage('Starting delivery check');
    
    // Special handling for test mode
    if (TEST_MODE) {
      await logMessage('Running in TEST MODE');
      
      // Check if enough time has passed since the last test notification
      const canSendTest = await canSendTestNotification();
      if (!canSendTest) {
        const lastTestCheck = await AsyncStorage.getItem('lastTestReminderCheck');
        const lastTime = new Date(parseInt(lastTestCheck)).toLocaleTimeString();
        await logMessage(`Test interval (${TEST_INTERVAL_MINUTES} minutes) not elapsed since last test at ${lastTime}`);
        return false;
      }
      
      await logMessage(`Test interval of ${TEST_INTERVAL_MINUTES} minutes has elapsed, proceeding with test notification`);
    } else {
      // Production mode - check if it's 10 AM or 5 PM
      const notificationPeriod = isNotificationTime();
      if (!notificationPeriod) {
        await logMessage('Not notification time (10 AM or 5 PM), exiting task');
        return false;
      }
      
      await logMessage(`It's ${notificationPeriod} notification time`);
      
      // Check if we've already sent reminders for this period today
      const today = new Date().toDateString();
      const lastMorningCheck = await AsyncStorage.getItem('lastMorningReminderCheck');
      const lastAfternoonCheck = await AsyncStorage.getItem('lastAfternoonReminderCheck');
      
      if (notificationPeriod === 'morning' && lastMorningCheck === today) {
        await logMessage('Already sent morning reminders today');
        return false;
      }
      
      if (notificationPeriod === 'afternoon' && lastAfternoonCheck === today) {
        await logMessage('Already sent afternoon reminders today');
        return false;
      }
    }
    
    // Get token to check if user is authenticated
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      await logMessage('No authentication token, skipping check');
      return false;
    }
    
    // Get cached orders from AsyncStorage
    const cachedOrdersJson = await AsyncStorage.getItem('cachedOrders');
    if (!cachedOrdersJson) {
      await logMessage('No cached orders found');
      return false;
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
      // Since you want to use ONLY your API notification system, not local notifications
      // We'll focus on sending the API notification
      await logMessage('Sending API notifications for overdue orders');
      const apiSuccess = await sendDeliveryReminderApi();
      
      if (apiSuccess) {
        await logMessage('API notification sent successfully');
        
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
        
        return true;
      } else {
        await logMessage('API notification failed');
        return false;
      }
    } else {
      await logMessage('No overdue orders found that need reminders');
      
      // In test mode, still record that we did a check
      if (TEST_MODE) {
        await AsyncStorage.setItem('lastTestReminderCheck', new Date().getTime().toString());
        await logMessage(`Test check completed at ${new Date().toLocaleTimeString()} - no overdue orders`);
      }
      
      return true;
    }
  } catch (error) {
    await logMessage(`Error in check and send notifications: ${error.message}`);
    return false;
  }
};

// Setup the task definition - this is just for potential use in production builds
// but we don't rely on it working in Expo Go
try {
  TaskManager.defineTask(BACKGROUND_DELIVERY_CHECK, async () => {
    await logMessage('Background task executed via TaskManager');
    await checkAndSendNotifications();
  });
} catch (error) {
  console.log('Error defining task:', error);
}

// Setup notifications permission
const setupNotifications = async () => {
  try {
    await logMessage('Setting up notification permissions');
    
    if (Platform.OS === 'ios') {
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
    }
    
    await logMessage('Notification setup complete');
    return true;
  } catch (error) {
    await logMessage(`Error in notification setup: ${error.message}`);
    return false;
  }
};

// Try to register the background task
const registerBackgroundTask = async () => {
  try {
    await logMessage('Attempting to register background task');
    
    // First check if task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_DELIVERY_CHECK);
    await logMessage(`Background task already registered: ${isRegistered}`);
    
    // In Expo Go, background tasks won't work, so we'll mainly rely on the foreground timer
    // But we'll try to register anyway for standalone builds
    if (!isRegistered) {
      try {
        // Try using TaskManager directly - this may not work in Expo Go
        await TaskManager.registerTaskAsync(BACKGROUND_DELIVERY_CHECK, {
          requiredNetworkType: TaskManager.TaskNetworkType.ANY,
          requiresCharging: false,
          requiresDeviceIdle: false,
        });
        
        await logMessage('Background task registered successfully');
      } catch (error) {
        await logMessage(`Error registering background task: ${error.message}`);
        await logMessage('Will use foreground timer as fallback');
      }
    }
    
    // Clear any previous test record to force an immediate check
    if (TEST_MODE) {
      await AsyncStorage.removeItem('lastTestReminderCheck');
      await logMessage('Cleared previous test record to allow immediate check');
    }
    
  } catch (error) {
    await logMessage(`Error in registerBackgroundTask: ${error.message}`);
  }
};

// React component that sets up the notification service
const BackgroundNotificationService = () => {
  const timerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  
  // Function to run the interval check when the app is in foreground
  const setupIntervalCheck = () => {
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Set up a new timer
    const intervalTime = TEST_MODE ? 
      TEST_INTERVAL_MINUTES * 60 * 1000 : // Test mode - check every minute
      5 * 60 * 1000; // Production - check every 5 minutes when app is open
    
    logMessage(`Setting up foreground interval check every ${intervalTime / 1000} seconds`);
    
    timerRef.current = setInterval(async () => {
      await logMessage('Running foreground interval check');
      await checkAndSendNotifications();
    }, intervalTime);
  };
  
  useEffect(() => {
    const setupService = async () => {
      await logMessage('=== BackgroundNotificationService component mounted ===');
      await logMessage(`Platform: ${Platform.OS}, Version: ${Platform.Version}`);
      
      // Set up permissions and try to register background task
      await setupNotifications();
      await registerBackgroundTask();
      
      // Set up the foreground interval check
      setupIntervalCheck();
      
      // Run an immediate check
      setTimeout(async () => {
        await logMessage('Running immediate check...');
        await checkAndSendNotifications();
      }, 2000);
    };
    
    setupService();
    
    // Handle app state changes
    const handleAppStateChange = nextAppState => {
      logMessage(`App state changed from ${appStateRef.current} to ${nextAppState}`);
      appStateRef.current = nextAppState;
      
      if (nextAppState === 'active') {
        // App came to foreground - set up interval
        setupIntervalCheck();
        
        // Also run a check immediately when app comes to foreground
        checkAndSendNotifications();
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background - clear interval to save battery
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };
    
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Cleanup function
    return () => {
      logMessage('BackgroundNotificationService component unmounting');
      
      // Clear any timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Remove app state subscription
      subscription.remove();
    };
  }, []);
  
  return null; // This component doesn't render anything
};

// Function to manually trigger a check (can be used for testing)
export const manuallyTriggerCheck = async () => {
  await logMessage('Manual check triggered by user');
  
  // For manual testing, clear the last test check timestamp to force a notification
  if (TEST_MODE) {
    await AsyncStorage.removeItem('lastTestReminderCheck');
    await logMessage('Cleared last test timestamp to force notification');
  }
  
  const result = await checkAndSendNotifications();
  await logMessage(`Manual check completed with result: ${result}`);
  return result;
};

// Function to toggle test mode (for UI)
export const toggleTestMode = async (enabled) => {
  await logMessage(`Test mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  
  // Store the test mode setting
  await AsyncStorage.setItem('notificationTestMode', enabled ? 'true' : 'false');
  
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