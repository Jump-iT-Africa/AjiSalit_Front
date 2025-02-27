import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";


export default function DetialsPage()
{

    return(
        <>
         <TouchableOpacity onPress={handleBack}>
        <HeaderWithBack
        onPress={() => router.replace('(tabs)')}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهد الصفحة زيد الكود ديال التطبيق"
        />

      </TouchableOpacity>
            
        </>
)
}