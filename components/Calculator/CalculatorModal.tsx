import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Color from '@/constants/Colors';

const CalculatorModal = ({ visible, onClose, onConfirm }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const { width } = Dimensions.get('window');
  const buttonSize = width * 0.18;

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperator);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleConfirm = () => {
    onConfirm(display);
    clear();
    onClose();
  };

  const handleClose = () => {
    clear();
    onClose();
  };

  const Button = ({ onPress, title, color = '#333', backgroundColor = '#f0f0f0', flex = 1 }) => (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, width: buttonSize, height: buttonSize },
        flex === 2 && { width: buttonSize * 2 + 10 }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.calculatorContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>حاسبة</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Display */}
          <View style={styles.displayContainer}>
            <Text style={styles.displayText}>{display}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Row 1 */}
            <View style={styles.row}>
              <Button title="C" onPress={clear} backgroundColor="#ff6b6b" color="white" />
              <Button title="÷" onPress={() => inputOperator('÷')} backgroundColor={Color.green} color="white" />
              <Button title="×" onPress={() => inputOperator('×')} backgroundColor={Color.green} color="white" />
              <Button title="⌫" onPress={() => {
                if (display.length > 1) {
                  setDisplay(display.slice(0, -1));
                } else {
                  setDisplay('0');
                }
              }} backgroundColor="#ff9500" color="white" />
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <Button title="7" onPress={() => inputNumber(7)} />
              <Button title="8" onPress={() => inputNumber(8)} />
              <Button title="9" onPress={() => inputNumber(9)} />
              <Button title="-" onPress={() => inputOperator('-')} backgroundColor={Color.green} color="white" />
            </View>

            {/* Row 3 */}
            <View style={styles.row}>
              <Button title="4" onPress={() => inputNumber(4)} />
              <Button title="5" onPress={() => inputNumber(5)} />
              <Button title="6" onPress={() => inputNumber(6)} />
              <Button title="+" onPress={() => inputOperator('+')} backgroundColor={Color.green} color="white" />
            </View>

            {/* Row 4 */}
            <View style={styles.row}>
              <Button title="1" onPress={() => inputNumber(1)} />
              <Button title="2" onPress={() => inputNumber(2)} />
              <Button title="3" onPress={() => inputNumber(3)} />
              <Button title="=" onPress={performCalculation} backgroundColor="#4CAF50" color="white" />
            </View>

            {/* Row 5 */}
            <View style={styles.row}>
              <Button title="0" onPress={() => inputNumber(0)} flex={2} />
              <Button title="." onPress={inputDecimal} />
              <Button title="✓" onPress={handleConfirm} backgroundColor={Color.green} color="white" />
            </View>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>اضغط ✓ لتأكيد المبلغ</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal',
    color: '#333',
  },
  displayContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  displayText: {
    fontSize: 32,
    fontFamily: 'TajawalRegular',
    color: '#333',
    textAlign: 'right',
  },
  buttonContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'TajawalRegular',
    fontWeight: '600',
  },
  footer: {
    marginTop: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'TajawalRegular',
    color: '#666',
  },
});

export default CalculatorModal;