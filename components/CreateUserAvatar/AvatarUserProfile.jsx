import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

export default function InitialsAvatar({ name, size = 48 }){
  const getInitials = (name) => {
    if (!name) return '??';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return name.charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return Colors.green;
    
    const colors = [
      '#F52525','#2e752f'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);

  return (
    <View 
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text 
        style={{
          color: 'white',
          fontSize: size / 2.5,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {initials}
      </Text>
    </View>
  );
};