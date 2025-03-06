import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const ImagesSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = [
    require('@/assets/images/product2.avif'),
    require('@/assets/images/product3.jpg'),
    require('@/assets/images/product4.jpg'),
    require('@/assets/images/product5.jpg'),
    require('@/assets/images/product2.avif'),
  ];
  
  const nextImage = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const selectImage = (index) => {
    setActiveIndex(index);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={images[activeIndex]} 
          style={styles.mainImage} 
          resizeMode="cover"
        />
        
        <TouchableOpacity 
          style={[styles.navButton, styles.leftButton]} 
          onPress={prevImage}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.rightButton]} 
          onPress={nextImage}
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.thumbnailStrip}
      >
        {images.map((image, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => selectImage(index)}
            style={[
              styles.thumbnailContainer,
              activeIndex === index && styles.activeThumbnail
            ]}
          >
            <Image 
              source={image} 
              style={styles.thumbnail} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
 
  imageContainer: {
    width: '100%',
    height: width * 0.8, 
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,

  },
  mainImage: {
    paddingLeft:10,
    paddingRight:10,
    paddingTop:20,
    borderRadius:10,
    width: '100%',
    height: '100%',
    
  },
  navButton: {
    position: 'absolute',
    backgroundColor: Colors.red,
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    top: '55%',
    marginTop: -20,
    marginLeft:4,
    marginRight:4,
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  thumbnailStrip: {
    padding: 10,
    
  },
  thumbnailContainer: {
    width: 85,
    height: 85,
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    
  },
  activeThumbnail: {
    borderColor: '#FF4646',
    
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius:3,
  },
});

export default ImagesSlider;