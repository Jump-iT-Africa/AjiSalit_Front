import React, { forwardRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import Colors from "@/constants/Colors";

export interface ActionSheetProps {
  children: any;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const ActionSheetComponent = forwardRef<ActionSheetRef, ActionSheetProps>(
  ({ children, containerStyle, contentStyle }, ref) => {
    return (
      <ActionSheet
        ref={ref}
        gestureEnabled={true}
        closable={true}
        // snapPoints={[90]}
        statusBarTranslucent={true}
        drawUnderStatusBar={true}
        overlayColor="rgba(0, 0, 0, 0.85)"
        containerStyle={[styles.container, containerStyle]}
        indicatorStyle={{ backgroundColor: "white" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={[styles.content, contentStyle]}>{children}</View>
        </KeyboardAvoidingView>
      </ActionSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.green,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "100%",
  },
  content: {
    padding: 20,
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  keyboardView: {
    flex: 1,
  },
});

export default ActionSheetComponent;
