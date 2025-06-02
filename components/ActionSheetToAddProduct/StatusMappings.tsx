

export const statusMappings = {
  situation: {
    toBackend: {
      'خالص': 'paid',
      'غير مدفوع': 'unpaid', 
      'تسبيق': 'prepayment'
    },
    toFrontend: {
      'paid': 'خالص',
      'unpaid': 'غير مدفوع',
      'prepayment': 'تسبيق'
    }
  },
  
  status: {
    toBackend: {
      'قيد التنفيذ': 'inProgress',
      'منتهي': 'finished',
      'تم التسليم': 'delivered'
    },
    toFrontend: {
      'inProgress': 'قيد التنفيذ',
      'finished': 'منتهي', 
      'delivered': 'تم التسليم'
    }
  }
};


export const convertToBackendFormat = (value, field) => {
  console.log('=== convertToBackendFormat DEBUG ===');
  console.log('Input value:', JSON.stringify(value));
  console.log('Input field:', field);
  console.log('typeof value:', typeof value);
  console.log('value.length:', value?.length);
  
  
  if (!value) {
    console.log('Value is falsy, returning:', value);
    return value;
  }
  
  
  if (!statusMappings[field]) {
    console.log('Field not found in statusMappings, available fields:', Object.keys(statusMappings));
    return value;
  }
  
  
  if (!statusMappings[field].toBackend) {
    console.log('toBackend not found for field:', field);
    return value;
  }
  
  console.log('Available mappings for field:', Object.keys(statusMappings[field].toBackend));
  
  
  const result = statusMappings[field].toBackend[value];
  console.log('Mapping result:', result);
  console.log('typeof result:', typeof result);
  
  if (!result) {
    console.log('No mapping found, returning original value:', value);
    
    
    console.log('=== DEBUGGING KEY MATCHING ===');
    Object.keys(statusMappings[field].toBackend).forEach(key => {
      console.log(`Key: "${key}" (length: ${key.length}) vs Value: "${value}" (length: ${value.length})`);
      console.log(`Are they equal? ${key === value}`);
      console.log(`Key charCodes:`, key.split('').map(c => c.charCodeAt(0)));
      console.log(`Value charCodes:`, value.split('').map(c => c.charCodeAt(0)));
    });
    
    return value;
  }
  
  console.log('Successfully converted:', value, '->', result);
  return result;
};

export const convertToFrontendFormat = (value, field) => {
  if (!value || !statusMappings[field]) return value;
  return statusMappings[field].toFrontend[value] || value;
};


export const prepareOrderDataForBackend = (formData) => {
  console.log('=== prepareOrderDataForBackend DEBUG ===');
  console.log('Input formData:', JSON.stringify(formData, null, 2));
  
  const convertedSituation = convertToBackendFormat(formData.situation, 'situation');
  const convertedStatus = convertToBackendFormat(formData.status, 'status');
  
  console.log('Original situation:', formData.situation);
  console.log('Converted situation:', convertedSituation);
  console.log('Original status:', formData.status);
  console.log('Converted status:', convertedStatus);
  
  const result = {
    ...formData,
    situation: convertedSituation,
    status: convertedStatus
  };
  
  console.log('Final converted formData:', JSON.stringify(result, null, 2));
  return result;
};


export const testConversion = () => {
  console.log('=== TESTING CONVERSIONS ===');
  
  
  const testValues = ['خالص', 'غير مدفوع', 'تسبيق'];
  
  testValues.forEach(value => {
    console.log(`\n--- Testing: ${value} ---`);
    const converted = convertToBackendFormat(value, 'situation');
    console.log(`Result: ${value} -> ${converted}`);
  });
  
  
  console.log('\n=== SPECIFIC TEST FOR تسبيق ===');
  const result = convertToBackendFormat('تسبيق', 'situation');
  console.log('Direct test of تسبيق:', result);
  console.log('Should be: prepayment');
  console.log('Is equal to prepayment?', result === 'prepayment');
  
  
  console.log('\n=== DIRECT OBJECT ACCESS TEST ===');
  console.log('statusMappings.situation.toBackend:', statusMappings.situation.toBackend);
  console.log('Direct access to تسبيق:', statusMappings.situation.toBackend['تسبيق']);
};