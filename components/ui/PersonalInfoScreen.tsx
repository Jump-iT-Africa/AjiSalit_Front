import React, { useState } from 'react';
import { View } from 'react-native';
import UserFormActionSheet from '../userRegister/userFormActionSheet';
import CombinedCompanyForm from '../CompanyRegister/CompanyFormActionSheet';

export default function PersonalInfoScreen(accountType: any) {
    const [step, setStep] = useState(1);

    return (
        <View>
            {accountType.accountType === "شخص عادي" ? (
                <UserFormActionSheet />
            ) : 
                <CombinedCompanyForm />
            }
        </View>
    );
}
