/**
 * Validation utilities
 */
export const validateFileSize = (file, maxSizeMB = 50) => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Fayl ${maxSizeMB}MB dan katta (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    };
  }
  return { valid: true };
};

export const validateFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) return { valid: true };
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Bu fayl turi qo'llab-quvvatlanmaydi: ${file.type || 'noma\'lum'}`,
    };
  }
  return { valid: true };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phone) => {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
};