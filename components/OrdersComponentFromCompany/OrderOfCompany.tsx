import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlashList } from "@shopify/flash-list";

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

const OrdersOfCompany = ({ SearchCode }: { SearchCode: string }) => {

  
  const [searchTerm, setSearchTerm] = useState(SearchCode);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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



  //hadi drtha to memoize the calculations
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    
    return orders.filter(order => 
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (type: string) => {
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

  const renderOrder = useCallback(({ item }: { item: Order }) => {
    return (
      <View>
        <View className="bg-white rounded-3xl p-4 mb-3 shadow-md border border-[#295f2b]">
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
      </View>
    );
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

export default OrdersOfCompany;