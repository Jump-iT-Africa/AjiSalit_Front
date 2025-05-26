import { View, Text, ActivityIndicator, ScrollView, I18nManager, Dimensions, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteInfo, resetSiteInfo } from '@/store/slices/siteInfoReducer.js';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

const Security = () => {
  const dispatch = useDispatch();
  const { content, status, error } = useSelector((state) => state.siteInfo);
  const router = useRouter();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const isHTML = (str) => {
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
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  };
  
  useEffect(() => {
    dispatch(fetchSiteInfo('security'));
    return () => {
      dispatch(resetSiteInfo());
    };
  }, [dispatch]);
  
  const platform = Platform.OS === "ios" ? "pt-12" : "pt-0"


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }} className={`${platform}`}>
      <HeaderWithBack
        onPress={() => router.back()}
        tooltipVisible={tooltipVisible}
        setTooltipVisible={setTooltipVisible}
        content="فهاد الصفحة غدي تختار واش نتا شركة ولا شخص عادي"
      />
      
      <Text style={{ fontSize: 24,  textAlign: 'center', margin: 10 }} className='font-tajawal text-[#F52525]'>
        {content?.title === 'security' ? "الأمان" : "معلومات"}
      </Text>
      
      {status === 'loading' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2e752f" />
        </View>
      )}
      
      {status === 'failed' && (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
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
                  <Text key={index} style={{ marginBottom: 15, textAlign: 'right', lineHeight: 24 }} className='font-tajawalregular'>
                    {paragraph}
                  </Text>
                ))
              ) : (
                <Text style={{ textAlign: 'right', lineHeight: 24 }}>
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

export default Security;