import React, { forwardRef } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import Colors from "@/constants/Colors";

export interface ActionSheetProps {
    children: any;
}

const ActionSheetComponent = forwardRef<ActionSheetRef, ActionSheetProps>(
    ({ children }, ref) => {
        return (
            <KeyboardAvoidingView >
                <ActionSheet 
                    ref={ref} 
                    gestureEnabled={true} 
                    closable={true} 
                    snapPoints={[90]}  
                    containerStyle={styles.container} 
                >
                    <View style={styles.content}>
                        {children}
                    </View>
                </ActionSheet>
            </KeyboardAvoidingView>
            
        );
    }
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.green, 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        height:'95%'
    },
    content: {
        padding: 20,
        backgroundColor: Colors.green, 
        width: "100%",
        height: "100%",
    },
});

export default ActionSheetComponent;
