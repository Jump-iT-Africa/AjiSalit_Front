import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import CustomButton from './CustomButton';
import Color from '@/constants/Colors';
import Divider from "@/components/ui/Devider";
import UserFormActionSheet from '../userRegister/userFormActionSheet';
import CompanyFormActionSheet from '../compaanyRegister/CompanyFormActionSheet';
import CompanyDetailsForm from '../compaanyRegister/CompanyDetailsForm';

export default function PersonalInfoScreen(accountType: any) {
    const [step, setStep] = useState(1);

    return (
        <View>
            {accountType.accountType === "شخص عادي" ? (
                <UserFormActionSheet />
            ) : (
                step === 1 ? (
                    <CompanyFormActionSheet goToNextStep={() => setStep(2)} />
                ) : (
                    <CompanyDetailsForm goToPreviousStep={() => setStep(1)} />
                )
            )}
        </View>
    );
}
