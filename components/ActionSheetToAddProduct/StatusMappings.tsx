// statusMappings.js - Complete working version
// Copy this entire content and replace your statusMappings.js file

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

// Debug version of convertToBackendFormat with extensive logging
export const convertToBackendFormat = (value, field) => {
  console.log('=== convertToBackendFormat DEBUG ===');
  console.log('Input value:', JSON.stringify(value));
  console.log('Input field:', field);
  console.log('typeof value:', typeof value);
  console.log('value.length:', value?.length);
  
  // Check if value is falsy
  if (!value) {
    console.log('Value is falsy, returning:', value);
    return value;
  }
  
  // Check if field exists in statusMappings
  if (!statusMappings[field]) {
    console.log('Field not found in statusMappings, available fields:', Object.keys(statusMappings));
    return value;
  }
  
  // Check if toBackend exists for this field
  if (!statusMappings[field].toBackend) {
    console.log('toBackend not found for field:', field);
    return value;
  }
  
  console.log('Available mappings for field:', Object.keys(statusMappings[field].toBackend));
  
  // Try to get the result
  const result = statusMappings[field].toBackend[value];
  console.log('Mapping result:', result);
  console.log('typeof result:', typeof result);
  
  if (!result) {
    console.log('No mapping found, returning original value:', value);
    
    // Debug: Check if any key matches by iterating
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

// Debug version of prepareOrderDataForBackend
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

// Test function to verify mappings work
export const testConversion = () => {
  console.log('=== TESTING CONVERSIONS ===');
  
  // Test each Arabic value
  const testValues = ['خالص', 'غير مدفوع', 'تسبيق'];
  
  testValues.forEach(value => {
    console.log(`\n--- Testing: ${value} ---`);
    const converted = convertToBackendFormat(value, 'situation');
    console.log(`Result: ${value} -> ${converted}`);
  });
  
  // Test the specific problematic value
  console.log('\n=== SPECIFIC TEST FOR تسبيق ===');
  const result = convertToBackendFormat('تسبيق', 'situation');
  console.log('Direct test of تسبيق:', result);
  console.log('Should be: prepayment');
  console.log('Is equal to prepayment?', result === 'prepayment');
  
  // Test object access directly
  console.log('\n=== DIRECT OBJECT ACCESS TEST ===');
  console.log('statusMappings.situation.toBackend:', statusMappings.situation.toBackend);
  console.log('Direct access to تسبيق:', statusMappings.situation.toBackend['تسبيق']);
};