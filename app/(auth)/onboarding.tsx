import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import Slide from "@/components/ui/OnboardingSlider";
import Colors from '@/constants/Colors';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/images/onboarding1.png'),
    title: 'اكتشف جوهر سهولة الاستخدام!',
    subtitle: 'اكتشف جوهر سهولة الاستخدام مع واجهتنا التي تمنحك تحكمًا بديهيًا وتفاعلات سلسة بكل سهولة.',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding2.png'),
    title: 'تعاونوا لتحقيق النجاح!',
    subtitle: 'استعدوا لإطلاق إمكانياتكم وشاهدوا قوة العمل الجماعي بينما ننطلق معًا في هذا المشروع الاستثنائي.',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding3.png'),
    title: 'إنشاء المهام بسهولة!',
    subtitle: 'أضف المهام بسرعة، حدد المواعيد النهائية، وأضف الوصف بسهولة باستخدام تطبيق إدارة المهام الخاص بنا ..',
  },
];

const OnboardingScreen = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: Colors.white,
                  width: 80,
                },
              ]}
            />
          ))}
        </View>
  
        <View style={styles.buttonContainer}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={styles.buttonWrapper}>
              {/* Login button */}
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => router.replace('register')}>
                <Text style={[styles.loginBtnText, { fontFamily: 'Tajawal' }]}>
                  تسجيل دخول
                </Text>
              </TouchableOpacity>
  
              {/* Create account text */}
              <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: 'Tajawal' }}>
                  لا تمتلك حساب؟{' '}
                  <Text 
                    style={{ textDecorationLine: 'underline', fontFamily: 'Tajawal' }}
                    onPress={() => router.push('login')}>
                    قم بإنشاء حساب
                  </Text>
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.nextBtn}>
                <Text style={[styles.nextBtnText, { fontFamily: 'Tajawal' }]}>
                  التالي
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.skipBtn]}
                onPress={skip}>
                <Text style={[styles.skipBtnText, { fontFamily: 'Tajawal' }]}>
                  تخطي
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        bounces={false}
        data={slides}
        renderItem={({item}) => <Slide item={item} />}
        style={styles.flatList}
      />
      <Footer />
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  flatList: {
    flex: 1,
    fontFamily: 'tajawal',
  },
  footer: {
    height: height * 0.25,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 5,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonWrapper: {
    height: 100,
  },
  navigationButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  skipBtn: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F52525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtnText: {
    color: Colors.white,
    fontWeight: 100,
    fontSize: 15,
    fontFamily: 'Tajawal',
  },
  nextBtnText: {
    color: Colors.white,
    fontWeight: 100,
    fontSize: 15,
    fontFamily: 'Tajawal',
  },
  loginBtn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: Colors.white,
    fontWeight: 100,
    fontSize: 15,
    fontFamily: 'Tajawal',

  }
});

export default OnboardingScreen;