import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

type TooltipComponentProps = {
  isVisible: boolean;
  onClose: () => void;
  onOpen: () => void;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
};

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  isVisible,
  onClose,
  onOpen,
  content,
  placement = "top",
}) => {
  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        <View style={styles.iconContainer}>
          <Feather name="info" size={22} color="white" style={styles.icon} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <View style={[styles.tooltipContainer, getPlacementStyle("top")]}>
            <Text style={styles.tooltipText}>{content}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// Helper function to position the tooltip based on placement
const getPlacementStyle = (placement: string) => {
  switch (placement) {
    case "top":
      return { top: height * 0.12 };
    case "bottom":
      return { top: height * 0.7 };
    case "left":
      return { left: width * 0.3 };
    case "right":
      return { left: width * 0.7 };
    default:
      return { top: height * 0.7 };
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#461e04b3',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {

    backgroundColor: 'red',
    borderRadius: 8,
    padding: 12,
    maxHeight:height * 0.8,
    position: 'absolute',
  },
  tooltipText: {
    color: 'white',
    fontFamily: 'Tajawal',
    textAlign: 'center',
  }
});

export default TooltipComponent;