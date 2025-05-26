import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  ActivityIndicator,
  Modal,
  StatusBar,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
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
      {/* Always show loading while image is loading */}
      {isLoading && (
        <View style={[style, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={Colors.red} />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      )}
      {/* Show image once loaded */}
      {(isLoading || isLoaded) && (
        <Image
          source={source}
          style={[style, { opacity: isLoaded ? 1 : 0 }]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {/* Show error state if image fails to load */}
      {hasError && (
        <View style={[style, styles.errorContainer]}>
          <Ionicons name="image-outline" size={30} color="#ccc" />
          <Text style={styles.errorText}>فشل تحميل الصورة</Text>
        </View>
      )}
    </View>
  );
};

// Fullscreen Image Modal Component using react-native-image-zoom-viewer
const FullscreenImageModal = ({ visible, onClose, images, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
      // Give a small delay to ensure modal is fully rendered
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [visible, initialIndex]);

  // Convert images array to format expected by ImageViewer
  const imageObjects = images.map((imageUrl, index) => ({
    url: imageUrl,
    // Add unique props for each image
    props: {
      resizeMode: 'contain',
      source: { uri: imageUrl }
    }
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar hidden />
      
      {isLoading ? (
        // Loading state
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 10, fontSize: 16 }}>جاري تحميل الصورة...</Text>
        </View>
      ) : (
        <ImageViewer
          imageUrls={imageObjects}
          index={currentIndex}
          onSwipeDown={onClose}
          enableSwipeDown={true}
          backgroundColor="rgba(0, 0, 0, 0.95)"
          enableImageZoom={true}
          doubleClickInterval={250}
          maxOverflow={300}
          flipThreshold={80}
          swipeDownThreshold={100}
          onChange={(index) => setCurrentIndex(index)}
          loadingRender={() => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <ActivityIndicator size="large" color="white" />
              <Text style={{ color: 'white', marginTop: 10, fontSize: 16 }}>جاري التحميل...</Text>
            </View>
          )}
          renderHeader={(currentIndex) => (
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
          renderFooter={(currentIndex) => (
            <View style={styles.footerContainer}>
              {/* <Text style={styles.counterText}>
                {currentIndex + 1} / {images.length}
              </Text> */}
            </View>
          )}
          renderIndicator={(currentIndex, allSize) => (
            <View style={styles.indicatorContainer}>
              {images.length > 1 && images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    { opacity: index === currentIndex ? 1 : 0.3 }
                  ]}
                />
              ))}
            </View>
          )}
          saveToLocalByLongPress={false}
          menuContext={{ saveToLocal: '', cancel: '' }}
          onLongPress={() => {}}
          // Smooth and responsive zoom settings
          minScale={1}
          maxScale={3}
          useNativeDriver={true}
          failImageSource={{ uri: 'https://via.placeholder.com/400x400?text=Image+Not+Found' }}
        />
      )}
    </Modal>
  );
};

const ImagesSlider = ({ images = [], preloadRange = 2 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [modalVisible, setModalVisible] = useState(false);

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

  const openModal = () => {
    console.log('Opening image modal at index:', activeIndex, 'URL:', images[activeIndex]);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
          <TouchableOpacity onPress={openModal} activeOpacity={0.9}>
            <LazyImage
              source={{ uri: images[activeIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
              isVisible={visibleImages.has(activeIndex)}
            />
          </TouchableOpacity>
                   
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

      <FullscreenImageModal
        visible={modalVisible}
        onClose={closeModal}
        images={images}
        initialIndex={activeIndex}
      />
    </>
  );
};

const { width, height } = Dimensions.get('window');
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
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
    borderRadius: 10,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  // ImageViewer Modal Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
});

export default ImagesSlider;