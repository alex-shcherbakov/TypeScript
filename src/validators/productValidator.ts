import { Product } from '../types/baseContent';
import { Validator } from '../types/validators';

export const productValidator: Validator<Product> = {
  validate(data) {
    const errors: string[] = [];
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required.');
    }
    if (data.price <= 0) {
      errors.push('Price must be greater than 0.');
    }
    if (data.stock < 0) {
      errors.push('Stock cannot be negative.');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};
