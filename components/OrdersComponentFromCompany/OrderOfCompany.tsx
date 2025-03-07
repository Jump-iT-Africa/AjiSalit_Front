// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Image,
  Pressable,
  Alert,
  Modal,
  StyleSheet
} from 'react-native';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlashList } from "@shopify/flash-list";
import AjiSalit from "@/assets/images/logo.png"
import { useRouter } from 'expo-router';



interface OrderAmount {
  type: string;
  value: number | null;
  label: string;
  currency?: string;
}

interface Order {
  orderCode: string;
  status: string;
  amount: OrderAmount;
  customerName: string;
  date: string;
}

const sampleData = {
  "orders": [
    {
      "orderCode": "asd",
      "status": "pending",
      "amount": {
        "type": "paid",
        "value": null,
        "label": "خالص"
      },
      "customerName": "samawi" ,
      "date": "11/02/2025"
    },
    {
      "orderCode": "qwe",
      "status": "completed",
      "amount": {
        "type": "unpaid",
        "value": null,
        "label": "غير خالص"
      },
      "customerName": "mimoun",
      "date": "11/02/2025"
    },
    {
      "orderCode": "msd",
      "status": "pending",
      "amount": {
        "type": "installment",
        "value": 20,
        "label": "تنسيق",
        "currency": "درهم"
      },
      "customerName": "ayoub",
      "date": "11/02/2025"
    },

    {
      "orderCode": "jhf",
      "status": "pending",
      "amount": {
        "type": "paid",
        "value": null,
        "label": "خالص"
      },
      "customerName": "Mohammed ali",
      "date": "11/02/2025"
    },
    {
      "orderCode": "yetr",
      "status": "completed",
      "amount": {
        "type": "unpaid",
        "value": null,
        "label": "غير خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "kut",
      "status": "pending",
      "amount": {
        "type": "installment",
        "value": 20,
        "label": "تنسيق",
        "currency": "درهم"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "cbv",
      "status": "pending",
      "amount": {
        "type": "paid",
        "value": null,
        "label": "خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "etr",
      "status": "completed",
      "amount": {
        "type": "unpaid",
        "value": null,
        "label": "غير خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "bnbn",
      "status": "pending",
      "amount": {
        "type": "installment",
        "value": 20,
        "label": "تنسيق",
        "currency": "درهم"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "lsf",
      "status": "pending",
      "amount": {
        "type": "paid",
        "value": null,
        "label": "خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "pwp",
      "status": "completed",
      "amount": {
        "type": "unpaid",
        "value": null,
        "label": "غير خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "mmm",
      "status": "pending",
      "amount": {
        "type": "installment",
        "value": 20,
        "label": "تنسيق",
        "currency": "درهم"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "cdd",
      "status": "pending",
      "amount": {
        "type": "paid",
        "value": null,
        "label": "خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "pop",
      "status": "completed",
      "amount": {
        "type": "unpaid",
        "value": null,
        "label": "غير خالص"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
    {
      "orderCode": "lkl",
      "status": "pending",
      "amount": {
        "type": "installment",
        "value": 20,
        "label": "تنسيق",
        "currency": "درهم"
      },
      "customerName": "محمد المرجاني",
      "date": "11/02/2025"
    },
  ]
};

const OrdersOfCompany = ({ SearchCode, statusFilter = null }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(SearchCode);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentStatusFilter, setCurrentStatusFilter] = useState(statusFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setOrders(sampleData.orders || []);
        setLoading(false);
      } catch (err) {
        console.log('Error setting orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSearchTerm(SearchCode);
  }, [SearchCode]);

  useEffect(() => {
    setCurrentStatusFilter(statusFilter);
  }, [statusFilter]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (searchTerm) {
      result = result.filter(order => 
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (currentStatusFilter) {
      let typeToFilter;
      
      switch(currentStatusFilter) {
        case 'خالص':
          typeToFilter = 'paid';
          break;
        case 'غير خالص':
          typeToFilter = 'unpaid';
          break;
        case 'التسبيق':
          typeToFilter = 'installment';
          break;
        default:
          typeToFilter = null;
      }
      
      if (typeToFilter) {
        result = result.filter(order => order.amount.type === typeToFilter);
      }
    }
    
    return result;
  }, [orders, searchTerm, currentStatusFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const OrderItem = ({ item }) => {
    const [isGray, setIsGray] = useState(true);
  
    const getStatusColor = (type) => {
      switch (type) {
        case 'paid':
          return 'bg-green-500';
        case 'unpaid':
          return 'bg-red-500';
        case 'installment':
          return 'bg-orange-500';
        default:
          return 'bg-gray-500';
      }
    };

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = () => {
      setIsGray(!isGray);
      setIsConfirmed(true);
      setShowModal(false);
    };
  
    return (
      <View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => {
            console.log('Item pressed:', item.orderCode);
            router.push({
              pathname: '/DetailsPage',
              params: { id: item.orderCode }
            });
          }}
          style={{ width: '100%' }}>
          <View className="bg-white rounded-3xl p-4 mb-3 shadow-md border border-[#295f2b] flex-row-reverse justify-between items-center">
            <View>
              <View className="flex flex-row-reverse justify-between items-center mb-1">
                <View className="flex flex-row-reverse items-center">
                  <Text className="text-black mr-2 font-tajawalregular text-[14px]">رمز الطلب:</Text>
                  <Text className="font-bold text-[#295f2b]">{item.orderCode}</Text>
                </View>
              </View>
              <View className='w-full flex-row-reverse items-center mb-1'>
                <Text className="text-black mr-2 font-tajawalregular text-[14px] ml-1">المبلغ:</Text>
                <View className={`px-2 py-0 rounded-full w-auto text-start flex flex-row ${getStatusColor(item.amount.type)}`}>
                  {item.amount.value !== null && (
                    <Text className="font-bold text-white font-tajawalregular text-[9px] flex flex-row-reverse">
                      {item.amount.value} {item.amount.currency}
                    </Text>
                  )}
                  <Text className="text-white text-[9px] font-medium font-tajawalregular">
                    {item.amount.label}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row-reverse justify-between">
                <View className="flex flex-col items-end">
                  <View className='flex-row-reverse mb-1 gap-1'>
                    <Text className="text-black mr-2 font-tajawalregular text-[14px]">صاحب(ة) الطلب:</Text>
                    <Text className="text-gray-900 font-tajawalregular text-[#295f2b]">{item.customerName}</Text>
                  </View>
                  <View className='flex flex-row gap-1 mr-2'>
                    <Text className="text-black">{item.date}</Text>
                    <AntDesign name="calendar" size={15} color="#F52525" />
                  </View>
                </View>
              </View>
            </View>
            <Pressable 
              onPress={() => !isConfirmed && setShowModal(true)}
              disabled={isConfirmed}
            >
              <Image 
                source={AjiSalit}
                style={{
                  width: 36,
                  height: 36,
                  opacity: isConfirmed ? 1 : 1,
                  tintColor: isGray ? '#808080' : 'red',
                }}
                resizeMode='contain'
              />
            </Pressable>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText} className='font-tajawalregular'>واش متأكد بغي تأكد الطلب ؟</Text>
              
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.textStyle} className='font-tajawal'>نعم</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.textStyle} className='font-tajawal'>إلغاء</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderOrder = useCallback(({ item }) => {
    return <OrderItem item={item} />;
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-green-500 px-4 py-2 rounded" 
          onPress={() => setOrders(sampleData.orders || [])}
        >
          <Text className="text-white font-medium">إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredOrders.length === 0) {
    return <NoOrdersExists />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">
      <FlashList
        data={filteredOrders}
        renderItem={renderOrder}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 800 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center'
  },
  buttonConfirm: {
    backgroundColor: '#295f2b',
  },
  buttonCancel: {
    backgroundColor: '#F52525',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default OrdersOfCompany;