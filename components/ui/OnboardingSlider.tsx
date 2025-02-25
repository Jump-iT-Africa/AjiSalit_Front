import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Colors from '@/constants/Colors';

interface SlideItem {
  id: string;
  image: any;
  title: string;
  subtitle: string;
}
const {width, height} = Dimensions.get('window');

const Slide: React.FC<{ item: SlideItem }> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <View style={[styles.shadowContainer, { borderWidth: 6, borderColor: '#214121', borderRadius: 33 }]}>
          <Image
            source={item?.image}
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.textShadowContainer}>
          <View style={styles.textContainer} className="bg-black">
            <Text style={styles.title} className="font-tajawal">{item?.title}</Text>
            <View>
              <Text style={[styles.subtitle, { textAlign: 'center', padding: 10, color: 'white' }]} className="font-tajawal">
                {item?.subtitle}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: '100%',
    backgroundColor: Colors.primary,
    flex:1,
    alignItems:'center',

  },
  imageWrapper: {
    paddingHorizontal: 0,
    marginTop: 20,
    height: '80%',
    width: '85%',
    
    marginHorizontal: 'auto',
  },
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 25,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -80,
    width: '100%',
    height: 140,
  },
  textShadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    marginBottom: 20,
    backgroundColor: Colors.primary,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
    marginHorizontal: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
    height:160,
    textAlign:'center'
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 100,
    textAlign: 'right',
    marginBottom: 10,
    fontFamily: 'TajawalRegular'
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    textAlign: 'right',
    lineHeight: 24,
    fontWeight:100,
    fontFamily: 'TajawalRegular'
  },
});

export default Slide;