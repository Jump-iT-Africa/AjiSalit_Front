import { View, Text, ActivityIndicator, ScrollView, I18nManager } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteInfo, resetSiteInfo } from '@/store/slices/siteInfoReducer.js';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

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

  const isHTML = (str) => {
    if (!str) return false;
    return /<[a-z][\s\S]*>/i.test(str);
  };
  
  const wrapHtml = (htmlContent) => {
    return `
      <!DOCTYPE html>
      <html dir="${I18nManager.isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body {
            font-family: System;
            padding: 0;
            margin: 0;
            direction: ${I18nManager.isRTL ? 'rtl' : 'ltr'};
          }
          p {
            margin-bottom: 15px;
            line-height: 1.5;
            text-align: right;
            direction: ${I18nManager.isRTL ? 'rtl' : 'ltr'};
          }
        </style>
      </head>
      <body style="font-family:'monospace'">
        ${htmlContent}
      </body>
      </html>
    `;
  };
  
  useEffect(() => {
    dispatch(fetchSiteInfo('about'));
    return () => {
      dispatch(resetSiteInfo());
    };
  }, [dispatch]);
  
  // Debug what's happening
  console.log('Content:', content);
  console.log('Is HTML?', content?.content ? isHTML(content.content) : 'No content yet');
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }} className='mt-10'>
      <View className='w-full'>
        <HeaderWithBack
          onPress={() => router.back()}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهاد الصفحة غدي تختار واش نتا شركة ولا شخص عادي"
        />
      </View>
      <Text className='font-tajawal text-2xl text-[#F52525] text-center self-center pr-4 mb-6'> 
        {"من نحن"}
      </Text>
      
      {status === 'loading' && (
        <ActivityIndicator size="large" color="#F52525" style={{ marginTop: 20 }} />
      )}
      
      {status === 'failed' && (
        <Text className='text-red-500 mt-4 text-right self-end pr-4'>{error}</Text>
      )}
      
      {status === 'succeeded' && content && (
        <View style={{ flex: 1 }} className='mx-4'>
          {isHTML(content.content) ? (
            <WebView
              originWhitelist={['*']}
              source={{ html: wrapHtml(content.content) }}
              style={{ flex: 1 }}
              scalesPageToFit={false}
              className='font-tajawalregular'
            />
          ) : (
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {Array.isArray(formatArabicText(content.content)) ? (
                formatArabicText(content.content).map((paragraph, index) => (
                  <Text key={index} style={{ marginBottom: 15, textAlign: 'right', lineHeight: 24,fontFamily:"Tajawal" }} className='font-tajawalregular'>
                    {paragraph}
                  </Text>
                ))
              ) : (
                <Text style={{ textAlign: 'right', lineHeight: 24, fontFamily:"Tajawal" }} className='font-tajawal'>
                  {content.content}
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default About;