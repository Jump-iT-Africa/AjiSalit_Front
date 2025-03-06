import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import MoneyIcon from '@/assets/images/money.png';
import Advance from '@/assets/images/Advanced.png';
import NoAdvance from '@/assets/images/NoAdvanced.png';
import Color from '@/constants/Colors';



interface PaymentStatusProps {
  onStatusChange: (status: string, advanceAmount?: string) => void;
  currentPrice: string;
}
const PaymentStatus: React.FC<PaymentStatusProps> = ({ onStatusChange, currentPrice }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [showAdvanceInput, setShowAdvanceInput] = useState(false);
  const [AdvanceError , setAdvanceError] = useState('')
  const statusOptions = [
    {
      id: 3,
      label: 'غير خالص',
      color: '#e84a4a',
      icon: NoAdvance
    },
    {
      id: 2,
      label: 'تسبيق',
      color: '#FFA500',
      icon: Advance
    },
    {
      id: 1,
      label: 'خالص',
      color: '#43915a',
      icon: MoneyIcon
    },
  ];

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setShowAdvanceInput(status === 'تسبيق');
    
    if (status !== 'تسبيق') {
      setAdvanceAmount('');
    }
    
    onStatusChange(status, status === 'تسبيق' ? advanceAmount : undefined);
  };

  const handleAdvanceAmountChange = (text: string) => {
    setAdvanceAmount(text);
    const advanceValue = parseFloat(text) || 0;
    const totalPrice = parseFloat(currentPrice) || 0;
    console.log('current',currentPrice);
    console.log('advance',advanceValue);
    if (advanceValue <= totalPrice || !currentPrice) {
      onStatusChange(selectedStatus, text);
    } else {
      setAdvanceError('مبلغ التسبيق لا يمكن أن يتجاوز المبلغ الإجمالي');
      onStatusChange(selectedStatus, currentPrice);
    }
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleStatusSelect(option.label)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 20,
              backgroundColor: selectedStatus === option.label ? option.color : "#ffff",
              borderWidth: 1,
              borderColor: option.color,
            }}
          >
            <View style={{ 
              alignItems: 'center', 
              flexDirection: 'row-reverse', 
              justifyContent: 'space-evenly'
            }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: 'TajawalRegular',
                color: selectedStatus === option.label ? 'white' : option.color,
                fontSize: 18,
                marginBottom: 0
              }}>
                {option.label}
              </Text>
              <Image
                source={option.icon}
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {showAdvanceInput && (
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          <Text style={{ 
            textAlign: 'right', 
            color: Color.green, 
            marginBottom: 8,
            fontFamily: 'TajawalRegular',
            marginTop:10
          }}>
            مبلغ التسبيق (بالدرهم): <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            placeholder="يرجى إدخال مبلغ التسبيق"
            placeholderTextColor="#888"
            value={advanceAmount}
            keyboardType="numeric"
            onChangeText={handleAdvanceAmountChange}
            style={{
              borderWidth: 1,
              borderColor: parseFloat(advanceAmount) > parseFloat(currentPrice) ? 'red' : Color.green,
              borderRadius: 8,
              padding: 12,
              textAlign: 'right',
              fontFamily: 'TajawalRegular',
              color: 'black',
              backgroundColor: 'white',
            }}
          />
            {parseFloat(advanceAmount) > parseFloat(currentPrice) && (
              <Text style={{ color: 'red', textAlign: 'right', marginTop: 4, fontFamily: 'TajawalRegular', fontSize:12 }}>
                مبلغ التسبيق لا يمكن أن يتجاوز المبلغ الإجمالي
              </Text>
            )}        
        </View>
      )}
    </View>
  );
};

export default PaymentStatus;