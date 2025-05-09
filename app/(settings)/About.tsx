import { View, Text, ActivityIndicator, ScrollView, I18nManager } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteInfo, resetSiteInfo } from '@/store/slices/siteInfoReducer.js';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import { useRouter } from 'expo-router';

const About = () => {
  const dispatch = useDispatch();
  const { content, status, error } = useSelector((state) => state.siteInfo);
  const router = useRouter();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const formatArabicText = (text) => {
    if (!text) return '';
    
    const paragraphs = text.split(/\n\n+/);
    
    if (paragraphs.length === 1 && text.length > 300) {
      const formattedParagraphs = [];
      const sentences = text.split(/([.؟!،:؛])/);
      let currentParagraph = '';
      
      for (let i = 0; i < sentences.length; i += 2) {
        if (sentences[i]) {
          const sentence = sentences[i] + (sentences[i + 1] || '');
          if (currentParagraph.length + sentence.length > 300) {
            formattedParagraphs.push(currentParagraph);
            currentParagraph = sentence;
          } else {
            currentParagraph += sentence;
          }
        }
      }
      
      if (currentParagraph) {
        formattedParagraphs.push(currentParagraph);
      }
      
      return formattedParagraphs;
    }
    
    return paragraphs;
  };
  
  useEffect(() => {
    dispatch(fetchSiteInfo('about'));
    return () => {
      dispatch(resetSiteInfo());
    };
  }, [dispatch]);
  
  return (
    <View className='flex-1 items-center mt-10'>
      <View className='w-full'>
        <HeaderWithBack
          onPress={() => router.back()}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهاد الصفحة غدي تختار واش نتا شركة ولا شخص عادي"
        />
      </View>
      <Text className='font-tajawal text-2xl text-[#F52525] text-center self-center pr-4 mb-6'> 
        {content?.title === 'security' ? "الأمان" : "معلومات"}
      </Text>
      
      {status === 'loading' && (
        <ActivityIndicator size="large" color="#F52525" style={{ marginTop: 20 }} />
      )}
      
      {status === 'failed' && (
        <Text className='text-red-500 mt-4 text-right self-end pr-4'>{error}</Text>
      )}
      
      {status === 'succeeded' && content && (
        <View className='mt-4 px-4 w-full flex-1'>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            className='w-full'
          >
            <View className='w-full'>
              {Array.isArray(formatArabicText(content.content)) ? (
                formatArabicText(content.content).map((paragraph, index) => (
                  <Text 
                    key={index} 
                    className='font-tajawalregular text-[14px] mb-4 text-right w-full leading-6'
                    style={{ writingDirection: 'rtl', textAlign: 'right' }}
                  >
                    {paragraph}
                  </Text>
                ))
              ) : (
                <Text 
                  className='font-tajawalregular text-[14px] text-right w-full leading-6'
                  style={{ writingDirection: 'rtl', textAlign: 'right' }}
                >
                  {content.content}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default About;