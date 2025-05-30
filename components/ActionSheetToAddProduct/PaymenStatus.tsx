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

  // Status mapping: Arabic display with English backend values
  const statusOptions = [
    {
      id: 1,
      label: 'غير مدفوع',        // Arabic display
      value: 'unpaid',          // English backend value
      color: '#e84a4a',
      iconwhite: NoMoneyWhite,
      iconGreen: NoMoneyRed,
    },
    {
      id: 2,
      label: 'تسبيق',       // Arabic display
      value: 'prepayment',      // English backend value
      color: '#FFA500',
      iconwhite: GivingMoneyWhite,
      iconGreen: GivingMoneyYellow,
    },
    {
      id: 3,
      label: 'خالص',            // Arabic display
      value: 'paid',            // English backend value
      color: '#43915a',
      iconwhite: PaidWhite,
      iconGreen: PaidGreen,
    },
  ];

  const handleStatusSelect = (optionValue: string, optionLabel: string) => {
    setSelectedStatus(optionLabel); // Store Arabic label for UI state
    setShowAdvanceInput(optionValue === 'prepayment'); // Use English value for logic
    
    if (optionValue !== 'prepayment') {
      setAdvancedAmount('');
    }
    
    // Send Arabic label to parent component (for frontend state)
    onStatusChange(optionLabel, optionValue === 'prepayment' ? advancedAmount : undefined);
  };

  const handleAdvanceAmountChange = (text: string) => {
    setAdvancedAmount(text);
    
    const advanceValue = parseFloat(text) || 0;
    const totalPrice = parseFloat(currentPrice) || 0;
    
    if (totalPrice === 0 || !currentPrice) {
      setAdvanceError('يرجى إدخال المبلغ الإجمالي أولاً');
    } else if (advanceValue > totalPrice) {
      setAdvanceError('مبلغ الدفعة المقدمة لا يمكن أن يتجاوز المبلغ الإجمالي');
    } else {
      setAdvanceError('');
    }
    
    // Send Arabic label to maintain consistency
    onStatusChange(selectedStatus, text);
  };

  // Update the advance amount if the current price changes
  useEffect(() => {
    if (selectedStatus === 'تسبيق' && advancedAmount) { // Check for Arabic value
      const advanceValue = parseFloat(advancedAmount) || 0;
      const totalPrice = parseFloat(currentPrice) || 0;
      
      if (totalPrice > 0 && advanceValue > totalPrice) {
        setAdvanceError('مبلغ الدفعة المقدمة لا يمكن أن يتجاوز المبلغ الإجمالي');
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
            onPress={() => handleStatusSelect(option.value, option.label)}
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
            مبلغ الدفعة المقدمة (بالدرهم): <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            placeholder="يرجى إدخال مبلغ الدفعة المقدمة"
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