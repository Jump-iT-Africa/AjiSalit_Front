//@ts-nocheck

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export interface SearchBarProps {
  onSearch: (text: string) => void;
  onFilter: (filters: FilterOptions) => void;
  placeholder?: string;
}

export interface FilterOptions {
  status: string | null;
}

const SearchBar = ({ onSearch, onFilter, placeholder = "بحث..." }: SearchBarProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };
  
  const applyFilters = () => {
    onFilter({ status: selectedStatus });
    setModalVisible(false);
  };
  
  const clearFilters = () => {
    setSelectedStatus(null);
    onFilter({ status: null });
    setModalVisible(false);
  };
  
  return (
    <View className="bg-gray-100 mt-2">
      <View className="flex-row items-center bg-white rounded-full px-2.5 h-[50px] shadow-sm border-[#2e752f] border-[1.5px]">
       
        {/* <TouchableOpacity 
          className="p-1 bg-[#2e752f] rounded-full"
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity> */}
        
        <TextInput
          className="flex-1 text-base px-2.5 text-gray-700 items-center placeholder:-mt-2 font-medium"
          placeholder={placeholder}
          placeholderTextColor="#999"
          textAlign="right"
          value={searchText}
          onChangeText={handleSearch}
        />
        
        <TouchableOpacity className="p-2">
          <AntDesign name="search1" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>تصفية الطلبات</Text>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>حالة الدفع:</Text>
              
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedStatus === 'paid' && styles.filterOptionSelected
                  ]}
                  onPress={() => setSelectedStatus('paid')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatus === 'paid' && styles.filterOptionTextSelected
                    ]}
                  >
                    paid
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedStatus === 'تسبيق' && styles.filterOptionSelected
                  ]}
                  onPress={() => setSelectedStatus('تسبيق')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatus === 'تسبيق' && styles.filterOptionTextSelected
                    ]}
                  >
                    تسبيق
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    selectedStatus === 'unpaid' && styles.filterOptionSelected
                  ]}
                  onPress={() => setSelectedStatus('unpaid')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatus === 'unpaid' && styles.filterOptionTextSelected
                    ]}
                  >
                    غير paid
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClear]}
                onPress={clearFilters}
              >
                <Text style={styles.buttonClearText}>مسح الفلاتر</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.buttonApply]}
                onPress={applyFilters}
              >
                <Text style={styles.buttonApplyText}>تطبيق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'TajawalRegular',
    color: '#2e752f',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'TajawalRegular',
    color: '#333',
    textAlign: 'right',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  filterOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#2e752f',
    borderColor: '#2e752f',
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'TajawalRegular',
    color: '#666',
    textAlign: 'center',
  },
  filterOptionTextSelected: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 25,
    padding: 12,
    elevation: 2,
    width: '48%',
  },
  buttonApply: {
    backgroundColor: '#2e752f',
  },
  buttonClear: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonApplyText: {
    color: 'white',
    fontFamily: 'TajawalRegular',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonClearText: {
    color: '#666',
    fontFamily: 'TajawalRegular',
    textAlign: 'center',
  },
});

export default SearchBar;