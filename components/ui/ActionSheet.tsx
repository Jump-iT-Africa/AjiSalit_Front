import React, { forwardRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { View, StyleSheet, KeyboardAvoidingView, ViewStyle, StatusBar, Platform } from "react-native";
import Colors from "@/constants/Colors";

export interface ActionSheetProps {
    children: any;
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
}

const ActionSheetComponent = forwardRef<ActionSheetRef, ActionSheetProps>(
    ({ children, containerStyle, contentStyle }, ref) => {
        return (
            <KeyboardAvoidingView>
                <ActionSheet 
                    ref={ref} 
                    gestureEnabled={true} 
                    closable={true} 
                    snapPoints={[90]}
                    statusBarTranslucent={true}
                    drawUnderStatusBar={true}
                    overlayColor="rgba(0, 0, 0, 0.85)"
                    containerStyle={[styles.container, containerStyle]}
                    indicatorStyle={{ backgroundColor: 'white' }}
                >
                    <View style={[styles.content, contentStyle]}>
                        {children}
                    </View>
                </ActionSheet>
            </KeyboardAvoidingView>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        backgroundColor:Colors.green, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10, 
        height: '100%',
    },
    content: {
        padding: 20,
        backgroundColor: 'white', 
        width: "100%",
        height: "100%",
    },
});

export default ActionSheetComponent;