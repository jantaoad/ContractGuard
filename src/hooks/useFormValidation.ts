import { useState, useCallback } from 'react';
import { ValidationError, ValidationResult } from '@/utils/validationUtils';

export interface UseFormValidationOptions {
  onSubmit: (data: any) => void | Promise<void>;
  validate?: (data: any) => ValidationError[];
}

export const useFormValidation = (options: UseFormValidationOptions) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validateField = useCallback((fieldName: string, value: any) => {
    if (!options.validate) return;

    const validationErrors = options.validate({ [fieldName]: value });
    const fieldErrors = validationErrors.filter((e) => e.field === fieldName);

    setErrors((prev) => {
      const newErrors = prev.filter((e) => e.field !== fieldName);
      return [...newErrors, ...fieldErrors];
    });

    return fieldErrors.length === 0;
  }, [options]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => new Set(prev).add(name));
      validateField(name, value);
    },
    [validateField],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // Validate on change if field has been touched
      if (touched.has(name)) {
        validateField(name, value);
      }
    },
    [touched, validateField],
  );

  const validateForm = useCallback((formData: any): ValidationResult => {
    if (!options.validate) {
      return { isValid: true, errors: [] };
    }

    const validationErrors = options.validate(formData);
    setErrors(validationErrors);

    // Mark all fields as touched
    const fields = new Set(Object.keys(formData));
    setTouched(fields);

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  }, [options]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      const result = validateForm(data);

      if (result.isValid) {
        await options.onSubmit(data);
      }
    },
    [validateForm, options],
  );

  const getFieldError = useCallback(
    (fieldName: string): string | null => {
      const error = errors.find((e) => e.field === fieldName);
      return error ? error.message : null;
    },
    [errors],
  );

  const hasFieldError = useCallback(
    (fieldName: string): boolean => {
      return errors.some((e) => e.field === fieldName) && touched.has(fieldName);
    },
    [errors, touched],
  );

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => prev.filter((e) => e.field !== fieldName));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const resetForm = useCallback(() => {
    setErrors([]);
    setTouched(new Set());
  }, []);

  return {
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    hasFieldError,
    clearFieldError,
    clearAllErrors,
    resetForm,
    validateField,
    validateForm,
  };
};
