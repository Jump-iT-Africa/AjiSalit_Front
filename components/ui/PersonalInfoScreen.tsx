import React, { useState } from 'react';
import { View } from 'react-native';
import UserFormActionSheet from '../userRegister/userFormActionSheet';
import CombinedCompanyForm from '../CompanyRegister/CompanyFormActionSheet';

export default function PersonalInfoScreen({ accountType, onInputFocus }) {
  
  return (
    <View>
      {accountType === "شخص عادي" ? (
        <UserFormActionSheet onInputFocus={onInputFocus} />
      ) : (
        
        <CombinedCompanyForm onInputFocus={onInputFocus} />
      )}
    </View>
  );
}