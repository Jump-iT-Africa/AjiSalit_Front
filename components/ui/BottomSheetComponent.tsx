import React, { forwardRef, useImperativeHandle, useRef, useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import Color from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export interface BottomSheetComponentProps {
  children: React.ReactNode;
  containerStyle?: any;
  contentStyle?: any;
  closeOnTouchBackdrop?: boolean;
  closeOnPressBack?: boolean;
  gestureEnabled?: boolean;
  customHeight?: number | string;
  scrollable?: boolean;
  onDismiss?: () => void; // New prop for dismiss callback
}

export interface BottomSheetComponentRef {
  show: () => void;
  hide: () => void;
}

const BottomSheetComponent = forwardRef<BottomSheetComponentRef, BottomSheetComponentProps>(
  ({ 
    children, 
    containerStyle, 
    contentStyle, 
    closeOnTouchBackdrop = true, 
    closeOnPressBack = true, 
    gestureEnabled = true, 
    customHeight,
    scrollable = true,
    onDismiss
  }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const windowHeight = Dimensions.get('window').height;
    const [isOpen, setIsOpen] = useState(false);
    
    
    const snapPoints = useMemo(() => {
      let height;

      if (!customHeight) {
        height = '70%';
      } else {
        height = customHeight;
      }

      
      if (typeof height === 'string' && height.includes('%')) {
        const percentage = parseInt(height.replace('%', ''), 10);
        return [`${percentage}%`];
      }

      
      return [height];
    }, [customHeight]);

    
    useImperativeHandle(ref, () => ({
      show: () => {
        bottomSheetModalRef.current?.present();
        setIsOpen(true);
      },
      hide: () => {
        bottomSheetModalRef.current?.dismiss();
        setIsOpen(false);
        if (onDismiss) onDismiss(); // Call onDismiss when hiding
      }
    }));

    
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (closeOnPressBack && isOpen) {
            bottomSheetModalRef.current?.dismiss();
            setIsOpen(false);
            if (onDismiss) onDismiss(); // Call onDismiss when back button is pressed
            return true;
          }
          return false;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [closeOnPressBack, isOpen, onDismiss])
    );

    
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          enableTouchThrough={!closeOnTouchBackdrop}
          pressBehavior={closeOnTouchBackdrop ? "close" : "none"}
        />
      ),
      [closeOnTouchBackdrop]
    );

    
    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        setIsOpen(false);
        if (onDismiss) onDismiss(); // Call onDismiss when sheet is closed
      }
    }, [onDismiss]);

    const ContentComponent = scrollable ? BottomSheetScrollView : View;


    return (
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={closeOnTouchBackdrop}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={styles.indicator}
            backgroundStyle={[styles.container, containerStyle]}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            enableHandlePanningGesture={gestureEnabled}
            enableOverDrag={false}
            enableContentPanningGesture={gestureEnabled}
          >
            <ContentComponent 
              style={[styles.contentContainer, contentStyle]}
              contentContainerStyle={scrollable ? styles.scrollContent : undefined}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ContentComponent>
          </BottomSheetModal>
        </BottomSheetModalProvider>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.green,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: Color.green,
    width: 60,
    height: 5,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  }
});

export default BottomSheetComponent;