import React, { useEffect } from "react";
import { View } from "react-native";
import FinishedButton from "./Buttons/FinishedButton";
import PickUpButton from "./Buttons/PickUpButton";
import { useSelector, useDispatch } from 'react-redux';
import { fetchORderById } from '@/store/slices/OrdersManagment';

export default function DoneAndPickUp({orderData}) {
    const dispatch = useDispatch();
    
    const currentOrder = useSelector(state => state.orders.currentOrder);
    const loading = useSelector(state => state.orders.loading);
    
    useEffect(() => {
        if (orderData?.id) {
            dispatch(fetchORderById(orderData.id));
        }
    }, [dispatch, orderData?.id]);
    
    const displayData = currentOrder && currentOrder.id === orderData?.id 
        ? currentOrder 
        : orderData;
    
    return (
        <View className="bg-gray-100 border-t border-gray-200 w-full py-5 pb-5 px-4">
            <View className="flex-row justify-between items-center space-x-2">
                <PickUpButton
                    orderData={displayData}
                />
                <FinishedButton
                    orderData={displayData}
                />
            </View>
        </View>
    );
}