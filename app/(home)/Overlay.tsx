import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("window");
const innerDimension = 300;

export const Overlay = () => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={[styles.overlay, styles.topOverlay]} />
      
      <View style={styles.centerRow}>
        <View style={styles.sideOverlay} />
        
        <View style={styles.scanWindow}>
          <View style={[styles.cornerMarker, styles.topLeftMarker]} />
          <View style={[styles.cornerMarker, styles.topRightMarker]} />
          <View style={[styles.cornerMarker, styles.bottomLeftMarker]} />
          <View style={[styles.cornerMarker, styles.bottomRightMarker]} />
        </View>
    
        <View style={styles.sideOverlay} />
      </View>
      
      <View style={[styles.overlay, styles.bottomOverlay]} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Colors.green,
    width: '100%',
  },
  topOverlay: {
    height: (height - innerDimension) / 2,
  },
  bottomOverlay: {
    height: (height - innerDimension) / 2,
  },
  centerRow: {
    flexDirection: 'row',
    height: innerDimension,
  },
  sideOverlay: {
    backgroundColor: Colors.green,
    width: (width - innerDimension) / 2,
  },
  scanWindow: {
    width: innerDimension,
    height: innerDimension,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: Colors.green,
    overflow: 'hidden',
  },
  cornerMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.green,
    borderRadius:0
  },
  topLeftMarker: {
    top: 0,
    left: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
  },
  topRightMarker: {
    top: 0,
    right: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
  },
  bottomLeftMarker: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderBottomLeftRadius: 0,
  },
  bottomRightMarker: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderBottomRightRadius: 0,
  },
});