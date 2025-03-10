import { View, Text, Image } from 'react-native';
import React from 'react';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import AjiSalit from "@/assets/images/logo.png"

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
    customerName?: string;
    CompanyName?: string;
    date: string;
    previousDate?: string; 
    isEdited?: boolean;    
  }

const getColorTheme = (order: Order) => {
  if (order.CompanyName === "خياط") {
    return {
      primary: "purple-500",      
      secondary: "purple-100",    
      icon: "cut",              
      iconColor: "#ae52d4"      
    };
  } else if (order.CompanyName === "صيدلية") {
    return {
      primary: "green-500",
      secondary: "green-100", 
      icon: "pills",
      iconColor: "#4caf50"
    };
  } else {
    return {
      primary: "blue-500",
      secondary: "blue-100",
      icon: "tshirt",
      iconColor: "#2196f3"
    };
  }
};

const OrderCard = ({ item }: { item: Order }) => {
  const theme = getColorTheme(item);
  
  const companyOrCustomer = item.CompanyName || (item.customerName || "");
  
  return (
    <View className={`bg-white rounded-xl mb-4 overflow-hidden shadow-sm border-t-4 border-${theme.primary} w-[100%]`}>
      <View className="flex-row items-end justify-end space-x-2 p-4 border-b border-gray-100">
        <View className='flex-row-reverse items-center justify-between w-full'>
            <View className='flex-row items-end justify-end space-x-2'>
                <View className="flex items-end ">
                    <Text className={`text-lg font-bold text-${theme.primary} font-tajawal`}>{companyOrCustomer}</Text>
                    <Text className="text-black text-sm ">#{item.orderCode.substring(0, 7)}</Text>
                </View>
                <View className={`w-11 h-11 rounded bg-${theme.secondary} items-center justify-center`}>
                    <FontAwesome5 name={theme.icon} size={20} color={theme.iconColor} />
                </View>
            </View>
            <View>
                <Image 
                    source={AjiSalit}
                    style={{
                    width: 36,
                    height: 36,
                    }}
                    resizeMode='contain'
                />
            </View>
        </View>
      </View>

      <View className="flex-row justify-between p-2">
        <View className="flex-1">
          <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
            <Text className=" text-gray-600 mb-1 font-tajawalregular ">الباقي</Text>
            <Text className="text-base font-bold font-tajawal text-[13px]">100 درهم</Text>
          </View>
        </View>

        <View className="flex-1">
          <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
            <Text className=" text-cyan-500 mb-1 font-tajawalregular font-[12px]">التنسيق</Text>
            <Text className="text-base font-bold font-tajawal text-[13px]">50 درهم</Text>
          </View>
        </View>

        <View className="flex-1">
          <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
            <Text className=" text-gray-600 mb-1 font-tajawalregular text-[13px]">المبلغ الإجمالي</Text>
            <Text className="text-base font-bold font-tajawal text-[13px]">150 درهم</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center p-3 mt-1 mx-2 bg-gray-100 border border-gray-300 border-1 rounded-lg mb-2">
        <View className="flex-row items-center">
          <Text className=" text-cyan-500 mr-1 font-tajawalregular text-[10px] mt-0">سجل التعديلات</Text>
          <Ionicons name="information-circle-outline" size={18} color="#00bcd4" />
        </View>
        
        <View className="flex-row items-center">
            {item.CompanyName === "خياط" && (
                <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full mt-1 mr-1">
                    <Text className="text-sm text-amber-500 mr-1 font-tajawalregular text-[8px] ">تم التعديل</Text>
                    <MaterialIcons name="edit" size={16} color="#ffb300" />
                </View>
            )}
            <View>
                <Text className="text-sm text-black mr-2 font-tajawalregular mt-2">{item.date}</Text>
                {item.isEdited && item.previousDate && (
                    <Text className="text-sm text-gray-400 mr-2 font-tajawalregular line-through">{item.previousDate}</Text>
                )}
            </View>
            <View className={`bg-${theme.secondary} p-2 rounded-lg`}>
                <MaterialIcons name="calendar-today" size={18} color={theme.iconColor} />
            </View>
        </View>
      </View>
    </View>
  );
};

const OrdersOfClient = () => {
  const Orders = {
    "orders": [
      {
        "orderCode": "as123JSad",
        "status": "pending",
        "amount": {
          "type": "paid",
          "value": null,
          "label": "خالص"
        },
        "CompanyName": "خياط",
        "date": "11/02/2025",
        'isEdited': true,
        "previousDate": "10/02/2025", 
      },
      {
        "orderCode": "032Dksadd",
        "status": "completed",
        "amount": {
          "type": "unpaid",
          "value": null,
          "label": "غير خالص"
        },
        "CompanyName": "صيدلية",
        "date": "11/02/2025"
      },
      {
        "orderCode": "mdasd33sd",
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
        "orderCode": "jh2312sadf",
        "status": "pending",
        "amount": {
          "type": "paid",
          "value": null,
          "label": "خالص"
        },
        "CompanyName": "مصبنة ملابس",
        "date": "11/02/2025"
      },
    ]
  };

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <FlashList
        showsVerticalScrollIndicator={false}
        data={Orders.orders}
        renderItem={({ item }) => <OrderCard item={item} />}
        keyExtractor={item => item.orderCode}
        ListFooterComponent={<View style={{ height: 800 }} />}

      />
    </View>
  );
};

export default OrdersOfClient;