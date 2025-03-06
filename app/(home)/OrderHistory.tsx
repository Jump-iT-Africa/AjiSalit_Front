import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';


const sampleData = {
  "orders": [
    {
      "orderCode": "asd123jkjk",
      "customerName": "samawi",
    },
    {
      "orderCode": "qweAS11123",
      "customerName": "mimoun",
    },
    {
      "orderCode": "msd1231XAS",
      "customerName": "ayoub",
    },
    {
      "orderCode": "jh111DDDf",
      "customerName": "Mohammed ali",
    },
    {
      "orderCode": "yetrEEE1231",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "ku3QWQWQt",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "cbvQQQ1213",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "etrWWW2322",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "bnbnDDDWW11",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "lsfKKK999",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "pwpNNNN99",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "mmmNNJ9999",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "cLKNK99dd",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "pIOIIII9op",
      "customerName": "محمد المرجاني",
    },
    {
      "orderCode": "l778BBJkl",
      "customerName": "محمد المرجاني",
    },
  ]
};

interface OrderHistory {
  orderCode: string;
  customerName: string;
}

export default function OrderHistory() {
  const router = useRouter();
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setHistory(sampleData.orders || []);
        setLoading(false);
      } catch (err) {
        console.log('Error setting history Orders:', err);
        setError('Failed to load History Orders');
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderOrderItem = ({ item }: { item: OrderHistory }) => {
    return (
      <View className={`mb-3 px-3`}>
        <TouchableOpacity 
          className={`bg-white rounded-2xl p-4 flex-row-reverse justify-beeen items-center shadow`}
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: '/DetailsPage',
              params: { id: item.orderCode }
            })
          }}
        >

          <View className="w-full flex-row-reverse items-end">
            <View className={`w-[50px] h-[50px] rounded-lg bg-green-100 justify-center items-center`}>
                <Octicons name="archive" size={24} color="#295f2b" />
            </View>
            <View className="flex-col items-end justify-center pr-4">
                <Text className={`text-base font-bold text-[#E23744] mb-2`}>{item.orderCode}</Text>
                <View className={`flex-1 items-end px-3 flex-row-reverse text-sm`}>
                    <Text className={`text-sm text-gray-500`}>صاحب(ة) الطلب:</Text>
                    <Text className={`text-base text-[#295f2b] font-semibold`}>{item.customerName}</Text>
                </View>
            </View>
          </View>
          

          {/* <View className={`items-end`}>
            <TouchableOpacity className={`p-1`}>
              <Ionicons name="trash-outline" size={24} color="#F52525" />
            </TouchableOpacity>
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#295f2b" />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center`}>
        <Text className={`text-[#F52525] mb-4`}>{error}</Text>
        <TouchableOpacity 
          className={`bg-[#295f2b] py-2 px-4 rounded-lg`}
          onPress={() => {
            setLoading(true);
            setHistory(sampleData.orders || []);
            setLoading(false);
          }}
        >
          <Text className={`text-white font-medium`}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-gray-100 p-9`}>
      <FlashList
        data={history}
        renderItem={renderOrderItem}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View className={`h-[100px]`} />}
      />
    </SafeAreaView>
  );
}