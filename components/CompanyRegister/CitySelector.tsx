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
  TouchableWithoutFeedback
} from "react-native";
import ActionSheetComponent from "@/components/ui/ActionSheet";
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
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedCity, setSelectedCity] = useState(initialValue);
  const [minimumCharsReached, setMinimumCharsReached] = useState(false);
  
  const actionSheetRef = useRef(null);
  const searchTimeout = useRef(null);
  const MIN_CHARS = 4;

  // Dismiss keyboard when filtered cities are populated
  useEffect(() => {
    if (filteredCities.length > 0) {
      Keyboard.dismiss();
    }
  }, [filteredCities]);

  const openActionSheet = () => {
    setIsSheetVisible(true);
    actionSheetRef.current?.show();
    setSearchText("");
    setFilteredCities([]);
    setNotFound(false);
    setHasStartedTyping(false);
    setMinimumCharsReached(false);
  };

  const closeActionSheet = () => {
    actionSheetRef.current?.hide();
    setIsSheetVisible(false);
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
      if (text.trim() === "") {
        setFilteredCities([]);
        setIsSearching(false);
        setHasStartedTyping(false);
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
    Keyboard.dismiss(); // Explicitly dismiss keyboard
    setSelectedCity(city.names.ar);
    onCitySelect(city);
    closeActionSheet();
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => selectCity(item)}
      className="border-b border-gray-200 p-3"
      activeOpacity={0.7} // Make it more responsive
    >
      <Text className="text-right font-tajawal text-[16px] text-gray-800">
        {item.names.ar}
      </Text>
      <Text className="text-right font-tajawalregular text-[12px] text-gray-500">
        {item.regionName}
      </Text>
    </TouchableOpacity>
  );

  const InitialSearchState = () => (
    <View className="flex-1 items-center ">
      <Text className="text-center font-tajawalregular text-[#2e752f]">
        قلب على مدينتك
      </Text>
      <Image
        source={require('@/assets/images/searchLeon.png')}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
    </View>
  );

  const MinimumCharsMessage = () => (
    <View className="flex-1 items-center ">
      <Text className="text-center font-tajawalregular text-[#2e752f]">
        قلب على مدينتك
      </Text>
      <Image
        source={require('@/assets/images/searchLeon.png')}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View className="mb-3">
      <Text
        className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
        style={{ color: Color.green }}
      >
        المدينة: <Text className="text-red-500">*</Text>
      </Text>
      
      <TouchableOpacity
        onPress={openActionSheet}
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

      <ActionSheetComponent
        ref={actionSheetRef}
        containerStyle={{ height: "70%", backgroundColor: "white" }}
        gestureEnabled={true}
        closeOnTouchBackdrop={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <View className="flex-row justify-between items-center -mt-4">
              <View style={{ width: 24 }} />
            </View>
            
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

            {isSearching ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={Color.green} />
              </View>
            ) : notFound && minimumCharsReached ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-center font-tajawal text-red-500">
                  لم يتم العثور على هذه المدينة
                </Text>
              </View>
            ) : !hasStartedTyping ? (
              <InitialSearchState />
            ) : hasStartedTyping && !minimumCharsReached ? (
              <MinimumCharsMessage />
            ) : (
              <FlatList
                data={filteredCities}
                renderItem={renderCityItem}
                keyExtractor={(item, index) => `city-${index}`}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled" // This helps with keyboard handling
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
            )}
          </View>
        </TouchableWithoutFeedback>
      </ActionSheetComponent>
    </View>
  );
};

export default CitySelector;