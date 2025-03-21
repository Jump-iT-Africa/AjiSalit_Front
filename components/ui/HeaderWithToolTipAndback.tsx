import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TooltipComponent from './TooltipComponent';

interface HeaderWithBackProps {
  tooltipVisible: boolean;
  setTooltipVisible: (visible: boolean) => void;
  content: string;
  onPress: () => void;
}

const HeaderWithBack: React.FC<HeaderWithBackProps> = ({
  tooltipVisible,
  setTooltipVisible,
  content,
  onPress
}) => {
  const router = useRouter();

  const containerClassName = Platform.OS === 'ios' 
    ? "flex-row justify-between mx-5 mt-4" 
    : "flex-row justify-between mx-0 mt-14";

  return (
    <View className={containerClassName}>
      <TouchableOpacity onPress={onPress}>
        <View className="bg-[#461e04b3] rounded-full w-8 h-8 flex justify-center items-center">
          <Feather name="chevron-left" size={22} color="white" />
        </View>
      </TouchableOpacity>
      <TooltipComponent
        isVisible={tooltipVisible}
        onClose={() => setTooltipVisible(false)}
        onOpen={() => setTooltipVisible(true)}
        content={content}
        placement="bottom"
      />
    </View>
  );
};

export default HeaderWithBack;