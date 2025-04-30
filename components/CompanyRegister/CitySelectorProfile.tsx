import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

const CitySelector = ({ 
  onCitySelect, 
  initialValue = '', 
  errors = {}, 
  isSubmitted = false, 
  regionsAndCities = []
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    // Extract all cities from regions
    const cities = [];
    regionsAndCities.forEach(region => {
      region.cities.forEach(city => {
        cities.push({
          id: city.id,
          names: city.names,
          regionId: region.id,
          regionName: region.names.ar
        });
      });
    });
    
    setAllCities(cities);
    setFilteredCities(cities);

    // Set initial value if provided
    if (initialValue) {
      setSelectedCity(initialValue);
    }
  }, [regionsAndCities, initialValue]);

  const handleSearch = (text) => {
    setSearchText(text);
    
    if (text.trim() === '') {
      setFilteredCities(allCities);
      return;
    }
    
    const filtered = allCities.filter(city => 
      city.names.ar.toLowerCase().includes(text.toLowerCase()) ||
      city.regionName.toLowerCase().includes(text.toLowerCase())
    );
    
    setFilteredCities(filtered);
  };

  const selectCity = (city) => {
    setSelectedCity(city.names.ar);
    onCitySelect(city);
    setModalVisible(false);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label} className="font-tajawalregular text-[#2e752f]">المدينة</Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={[
          styles.selector,
          errors.city && isSubmitted ? styles.errorBorder : null
        ]}
        className={`border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular shadow`}
      >
        <View style={styles.selectorContent}>
          <Feather name="chevron-down" size={20} color="#777" style={styles.icon} />
          <Text style={styles.selectedText} className="font-tajawalregular">
            {selectedCity || 'اختر المدينة'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {errors.city && isSubmitted && (
        <Text style={styles.errorText} className="font-tajawalregular">
          {errors.city}
        </Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={22} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle} className="font-tajawal">اختر المدينة</Text>
            </View>
            
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#777" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="البحث عن مدينة..."
                value={searchText}
                onChangeText={handleSearch}
                placeholderTextColor="#999"
                className="font-tajawalregular"
                textAlign="right"
              />
            </View>
            
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.cityItem}
                  onPress={() => selectCity(item)}
                >
                  <Text style={styles.cityName} className="font-tajawalregular">
                    {item.names.ar}
                  </Text>
                  <Text style={styles.regionName} className="font-tajawalregular">
                    {item.regionName}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText} className="font-tajawalregular">
                    لا توجد مدن مطابقة للبحث
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2e752f',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#2e752f',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  errorBorder: {
    borderColor: '#F52525',
  },
  selectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  errorText: {
    color: '#F52525',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e752f',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cityName: {
    fontSize: 16,
    color: '#333',
  },
  regionName: {
    fontSize: 14,
    color: '#777',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});

export default CitySelector;