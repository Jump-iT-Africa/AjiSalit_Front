import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const LazyImage = ({ source, style, resizeMode, isVisible, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isVisible && !isLoaded && !isLoading && !hasError) {
      setIsLoading(true);
    }
  }, [isVisible, isLoaded, isLoading, hasError]);

  const handleLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!isVisible) {
    return <View style={[style, styles.placeholder]} />;
  }

  return (
    <View style={style}>
      {isLoading && (
        <View style={[style, styles.loadingContainer]}>
          <ActivityIndicator size="small" color={Colors.red} />
        </View>
      )}
      {(isLoading || isLoaded) && (
        <Image
          source={source}
          style={[style, { opacity: isLoaded ? 1 : 0 }]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {hasError && (
        <View style={[style, styles.errorContainer]}>
          <Ionicons name="image-outline" size={24} color="#ccc" />
        </View>
      )}
    </View>
  );
};

const ImagesSlider = ({ images = [], preloadRange = 2 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState(new Set());

  // Early return if no images provided
  if (!images || images.length === 0) {
    return null;
  }

  // Calculate which images should be loaded based on current position and preload range
  const updateVisibleImages = useCallback((currentIndex) => {
    const newVisibleImages = new Set();
    
    // Always load current image
    newVisibleImages.add(currentIndex);
    
    // Load images within preload range
    for (let i = 1; i <= preloadRange; i++) {
      // Previous images
      const prevIndex = (currentIndex - i + images.length) % images.length;
      newVisibleImages.add(prevIndex);
      
      // Next images
      const nextIndex = (currentIndex + i) % images.length;
      newVisibleImages.add(nextIndex);
    }
    
    setVisibleImages(newVisibleImages);
  }, [images.length, preloadRange]);

  // Update visible images when active index changes
  useEffect(() => {
    updateVisibleImages(activeIndex);
  }, [activeIndex, updateVisibleImages]);

  // Initialize visible images on mount
  useEffect(() => {
    updateVisibleImages(0);
  }, [updateVisibleImages]);

  const nextImage = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
  };

  const prevImage = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      return newIndex;
    });
  };

  const selectImage = (index) => {
    setActiveIndex(index);
  };

  // Check if thumbnail should be visible (load thumbnails around active area)
  const isThumbnailVisible = (index) => {
    const distance = Math.min(
      Math.abs(index - activeIndex),
      Math.abs(index - activeIndex + images.length),
      Math.abs(index - activeIndex - images.length)
    );
    return distance <= preloadRange + 2; // Load a bit more thumbnails for smooth scrolling
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <LazyImage
            source={{ uri: images[activeIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
            isVisible={visibleImages.has(activeIndex)}
          />
                   
          {images.length > 1 && (
            <>
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
            </>
          )}
        </View>
                 
        {images.length > 1 && (
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
                <LazyImage
                  source={{ uri: image }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                  isVisible={isThumbnailVisible(index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
  },
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
    // elevation: 2,
  },
  mainImage: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 20,
    borderRadius: 10,
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
    marginLeft: 4,
    marginRight: 4,
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
    borderRadius: 3,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default ImagesSlider;