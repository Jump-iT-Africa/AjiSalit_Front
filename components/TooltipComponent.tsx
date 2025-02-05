import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { Feather } from "@expo/vector-icons";

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
  placement = "bottom",
}) => {
  return (
    <Tooltip
      isVisible={isVisible}
      content={
        <View className="p-2">
          <Text className="text-white font-tajawal">{content}</Text>
        </View>
      }
      placement={placement}
      onClose={onClose}
      backgroundColor="rgba(0,0,0,0.7)"
      contentStyle={{ backgroundColor: "transparent" }}
    >
      <TouchableOpacity onPress={onOpen}>
        <View className="bg-[#461e04b3] rounded-full w-8 h-8 flex justify-center items-center">
          <Feather name="info" size={22} color="white" />
        </View>
      </TouchableOpacity>
    </Tooltip>
  );
};

export default TooltipComponent;