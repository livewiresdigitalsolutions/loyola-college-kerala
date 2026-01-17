export const validateName = (value: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(value);
};

export const validateMobile = (value: string): boolean => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(value);
};

export const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const validateAadhaar = (value: string): boolean => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(value);
};

export const validatePincode = (value: string): boolean => {
  const pincodeRegex = /^[0-9]{6}$/;
  return pincodeRegex.test(value);
};

export const validateYear = (value: string): boolean => {
  const yearRegex = /^[0-9]{4}$/;
  if (!yearRegex.test(value)) return false;
  const year = parseInt(value);
  return year >= 1950 && year <= new Date().getFullYear();
};

export const validatePercentage = (value: string): boolean => {
  const percentageRegex = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
  if (!percentageRegex.test(value)) return false;
  const num = parseFloat(value);
  return num >= 0 && num <= 100;
};

export const validateMarks = (obtained: number, max: number): boolean => {
  return obtained >= 0 && obtained <= max && max > 0;
};
