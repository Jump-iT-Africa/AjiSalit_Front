import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Keyboard,
  Modal,
  ScrollView
} from "react-native";
import Color from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';

const CitySelector = ({ 
  onCitySelect, 
  initialValue = "", 
  errors = {}, 
  isSubmitted = false,
  regionsAndCities 
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [minimumCharsReached, setMinimumCharsReached] = useState(false);
  const [selectedCity, setSelectedCity] = useState(initialValue);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const searchTimeout = useRef(null);
  const MIN_CHARS = 4;

  const openBottomSheet = () => {
    console.log("Opening modal");
    setIsModalVisible(true);
    setSearchText("");
    setFilteredCities([]);
    setNotFound(false);
    setHasStartedTyping(false);
    setMinimumCharsReached(false);
  };

  const closeBottomSheet = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    
    const hasMinChars = text.trim().length >= MIN_CHARS;
    setMinimumCharsReached(hasMinChars);
    
    if (text.trim() !== "") {
      setHasStartedTyping(true);
    } else {
      setHasStartedTyping(false);
      setFilteredCities([]);
      setIsSearching(false);
      return;
    }
    
    if (!hasMinChars) {
      setFilteredCities([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setNotFound(false);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (!regionsAndCities || !regionsAndCities.cities || !regionsAndCities.cities.data) {
        console.error("Cities data is not available");
        setIsSearching(false);
        return;
      }
      
      const lowerCaseText = text.toLowerCase();
      
      const matchedCities = regionsAndCities.cities.data.filter(city => {
        return (
          city.names.ar.toLowerCase().includes(lowerCaseText) ||
          city.names.en.toLowerCase().includes(lowerCaseText) ||
          city.names.fr.toLowerCase().includes(lowerCaseText)
        );
      });
      
      const citiesWithRegions = matchedCities.map(city => {
        const region = regionsAndCities.regions.data.find(r => r.id === city.region_id);
        return {
          ...city,
          regionName: region ? region.names.ar : ""
        };
      });
      
      setFilteredCities(citiesWithRegions);
      setNotFound(citiesWithRegions.length === 0);
      setIsSearching(false);
    }, 500);
  };

  const selectCity = (city) => {
    Keyboard.dismiss();
    setSelectedCity(city.names.ar);
    onCitySelect(city);
    setIsModalVisible(false);  // Close the modal after selection
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => selectCity(item)}
      className="border-b border-gray-200 p-3"
      activeOpacity={0.7}
    >
      <Text className="text-right font-tajawal text-[16px] text-gray-800">
        {item.names.ar}
      </Text>
      <Text className="text-right font-tajawalregular text-[12px] text-gray-500">
        {item.regionName}
      </Text>
    </TouchableOpacity>
  );

  const SearchStateDisplay = ({ message, showImage = true }) => (
    <View className="flex-1 items-center  py-4">
      <Text className="text-center font-tajawalregular text-[#2e752f] mb-4">
        {message}
      </Text>
      {showImage && (
        <Image
          source={require('@/assets/images/searchLeon.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      )}
    </View>
  );

  const getContentToDisplay = () => {
    if (isSearching) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Color.green} />
        </View>
      );
    } 
    
    if (notFound && minimumCharsReached) {
      return <SearchStateDisplay message="لم يتم العثور على هذه المدينة" />;
    } 
    
    if (!hasStartedTyping) {
      return <SearchStateDisplay message="قلب على مدينتك" />;
    } 
    
    if (hasStartedTyping && !minimumCharsReached) {
      return <SearchStateDisplay message="اكتب على الأقل 4 أحرف للبحث" />;
    }
    
    return (
      <FlatList
        data={filteredCities}
        renderItem={renderCityItem}
        keyExtractor={(item, index) => `city-${index}`}
        contentContainerStyle={{ paddingBottom: 20, minHeight: 200, width: '100%' }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          hasStartedTyping && minimumCharsReached && !isSearching ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-center font-tajawal text-gray-500">
                اكتب اسم المدينة للبحث
              </Text>
            </View>
          ) : null
        }
      />
    );
  };

  return ( 
    <View className="mb-3">
      <Text
        className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
        style={{ color: Color.green }}
      >
        المدينة: <Text className="text-red-500">*</Text>
      </Text>
      
      <TouchableOpacity
        onPress={openBottomSheet}
        className={`border ${
          errors.city && isSubmitted ? "border-red-500" : "border-[#2e752f]"
        } rounded-lg p-3 bg-white flex-row justify-between items-center`}
      >
        <AntDesign name="down" size={16} color="#888" />
        <Text
          className={`text-right flex-1 font-tajawal ${
            selectedCity ? "text-black" : "text-gray-400"
          }`}
        >
          {selectedCity || "اختر مدينتك"}
        </Text>
      </TouchableOpacity>
  
      {errors.city && isSubmitted ? (
        <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[10px]">
          {errors.city}
        </Text>
      ) : null}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(7, 114, 9, 0.44)' }}
          activeOpacity={1}
          onPress={closeBottomSheet}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: '80%',
              padding: 16
            }}
          >
            <View style={{ 
              width: 60, 
              height: 5, 
              backgroundColor: Color.green, 
              borderRadius: 5, 
              alignSelf: 'center',
              marginBottom: 10
            }} />
            
            <View className="flex-1">
              <View className="flex-row items-center mb-4 rounded-full border-gray-300 p-2 bg-[#2e752f]">
                <View className="ml-2">
                  <Feather name="search" size={24} color="white" />
                </View>

                <TextInput
                  className="flex-1 text-right font-tajawal pr-2 text-white"
                  placeholder="ابحث..."
                  placeholderTextColor="white"
                  value={searchText}
                  onChangeText={handleSearch}
                  autoFocus={true}
                />
              </View>

              {getContentToDisplay()}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CitySelector;