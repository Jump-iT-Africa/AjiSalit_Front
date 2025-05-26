import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Pressable } from 'react-native';
import MoneyIcon from '@/assets/images/money.png';
import Advance from '@/assets/images/Advanced.png';
import NoAdvance from '@/assets/images/NoAdvanced.png';
import Color from '@/constants/Colors';
import GivingMoneyYellow from '@/assets/images/createProductIcons/givingMoney-yellow.png';
import GivingMoneyWhite from '@/assets/images/createProductIcons/givingMoney-white.png';
import NoMoneyRed from '@/assets/images/createProductIcons/noMoney-red.png';
import NoMoneyWhite from '@/assets/images/createProductIcons/noMoney-white.png';
import PaidGreen from '@/assets/images/createProductIcons/paid-green.png';
import PaidWhite from '@/assets/images/createProductIcons/paid-white.png';

interface PaymentStatusProps {
  onStatusChange: (status: string, advancedAmount?: string) => void;
  currentPrice: string;
  errorMessage?: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ onStatusChange, currentPrice, errorMessage }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [advancedAmount, setAdvancedAmount] = useState('');
  const [showAdvanceInput, setShowAdvanceInput] = useState(false);
  const [advanceError, setAdvanceError] = useState('');

  const statusOptions = [
    {
      id: 1,
      label: 'غير خالص',
      color: '#e84a4a',
      iconwhite: NoMoneyWhite,
      iconGreen: NoMoneyRed,
    },
    {
      id: 2,
      label: 'تسبيق',
      color: '#FFA500',
      iconwhite: GivingMoneyWhite,
      iconGreen: GivingMoneyYellow,
    },
    {
      id: 3,
      label: 'خالص',
      color: '#43915a',
      iconwhite: PaidWhite,
      iconGreen: PaidGreen,
    },
  ];

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setShowAdvanceInput(status === 'تسبيق');
    
    if (status !== 'تسبيق') {
      setAdvancedAmount('');
    }
    
    onStatusChange(status, status === 'تسبيق' ? advancedAmount : undefined);
  };

  const handleAdvanceAmountChange = (text: string) => {
    setAdvancedAmount(text);
    
    const advanceValue = parseFloat(text) || 0;
    const totalPrice = parseFloat(currentPrice) || 0;
    
    if (totalPrice === 0 || !currentPrice) {
      setAdvanceError('يرجى إدخال المبلغ الإجمالي أولاً');
    } else if (advanceValue > totalPrice) {
      setAdvanceError('مبلغ التسبيق لا يمكن أن يتجاوز المبلغ الإجمالي');
    } else {
      setAdvanceError('');
    }
    
    onStatusChange(selectedStatus, text);
  };

  // Update the advance amount if the current price changes
  useEffect(() => {
    if (selectedStatus === 'تسبيق' && advancedAmount) {
      const advanceValue = parseFloat(advancedAmount) || 0;
      const totalPrice = parseFloat(currentPrice) || 0;
      
      if (totalPrice > 0 && advanceValue > totalPrice) {
        setAdvanceError('مبلغ التسبيق لا يمكن أن يتجاوز المبلغ الإجمالي');
      } else if (advanceValue > 0) {
        setAdvanceError('');
      }
    }
  }, [currentPrice]);

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }} >
        {statusOptions.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleStatusSelect(option.label)}
            android_ripple={{ color: option.color }}
            style={({ pressed }) => [
              {
                flex: 1,
                padding: 10,
                borderRadius: 20,
                backgroundColor: selectedStatus === option.label ? option.color : "#ffff",
                borderWidth: 1,
                borderColor: errorMessage && !selectedStatus ? 'red' : option.color,
                opacity: pressed ? 0.7 : 1
              }
            ]}
          >
            <View style={{ 
              alignItems: 'center', 
              flexDirection: 'row-reverse', 
              justifyContent: 'center',
              gap: 8
            }}>
              <Text style={{
                fontFamily: 'TajawalRegular',
                color: selectedStatus === option.label ? 'white' : option.color,
                fontSize: 16,
              }}>
                {option.label}
              </Text>
              <Image
                source={selectedStatus === option.label ? option.iconwhite : option.iconGreen}
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
              />
            </View>
          </Pressable>
        ))}
      </View>

      {errorMessage && !selectedStatus && (
        <Text style={{ color: 'red', textAlign: 'right', marginTop: 4, fontFamily: 'TajawalRegular', fontSize: 12 }}>
          {errorMessage}
        </Text>
      )}

      {showAdvanceInput && ( 
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <Text style={{ 
            textAlign: 'right', 
            color: Color.green, 
            marginBottom: 8,
            fontFamily: 'TajawalRegular',
            marginTop: 10,
            fontSize: 14
          }}>
            مبلغ التسبيق (بالدرهم): <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            placeholder="يرجى إدخال مبلغ التسبيق"
            placeholderTextColor="#888"
            value={advancedAmount}
            keyboardType="numeric"
            onChangeText={handleAdvanceAmountChange}
            style={{
              borderWidth: 1,
              borderColor: advanceError ? 'red' : Color.green,
              borderRadius: 8,
              padding: 12,
              textAlign: 'right',
              fontFamily: 'TajawalRegular',
              color: 'black',
              backgroundColor: 'white',
            }}
          />
          {advanceError ? (
            <Text style={{ color: 'red', textAlign: 'right', marginTop: 4, fontFamily: 'TajawalRegular', fontSize: 12 }}>
              {advanceError}
            </Text>
          ) : null}        
        </View>
      )}
    </View>
  );
};

export default PaymentStatus;