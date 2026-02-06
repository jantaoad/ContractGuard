/**
 * Form Validation Utilities
 * Provides reusable validation functions for all form types
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

// Password validation
export const validatePassword = (password: string, minLength: number = 6): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }

  // Optional: Add complexity requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
  //   return 'Password must contain uppercase, lowercase, and numbers';
  // }

  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }

  if (name.length > 100) {
    return 'Name must be less than 100 characters';
  }

  return null;
};

// File validation
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {},
): string | null => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  } = options;

  if (!file) {
    return 'File is required';
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `File is too large. Maximum allowed size is ${maxSizeMB}MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const typesList = allowedTypes
      .map((t) => {
        if (t === 'application/pdf') return 'PDF';
        if (t === 'text/plain') return 'TXT';
        if (t.includes('wordprocessingml')) return 'DOCX';
        return t;
      })
      .join(', ');
    return `Invalid file type. Allowed types: ${typesList}`;
  }

  // Check file name
  if (file.name.length > 255) {
    return 'File name is too long';
  }

  return null;
};

// Form field validation helper
export interface FormField {
  name: string;
  value: any;
  required?: boolean;
  validate?: (value: any) => string | null;
}

export const validateFormFields = (fields: FormField[]): ValidationResult => {
  const errors: ValidationError[] = [];

  fields.forEach((field) => {
    // Check required
    if (field.required && !field.value) {
      errors.push({
        field: field.name,
        message: `${field.name} is required`,
      });
      return;
    }

    // Run custom validation
    if (field.validate && field.value) {
      const error = field.validate(field.value);
      if (error) {
        errors.push({
          field: field.name,
          message: error,
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validation for signup form
export const validateSignupForm = (email: string, password: string, name: string) => {
  const errors: ValidationError[] = [];

  const nameError = validateName(name);
  if (nameError) errors.push({ field: 'name', message: nameError });

  const emailError = validateEmail(email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validation for login form
export const validateLoginForm = (email: string, password: string) => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get error message for a specific field
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
};

// Check if field has error
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((e) => e.field === fieldName);
};
