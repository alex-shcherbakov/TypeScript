import { Validator } from '../types/validators';

export const compositeValidator = <T>(validators: Validator<T>[]): Validator<T> => {
  return {
    validate(data) {
      const results = validators.map((validator) => validator.validate(data));
      const allErrors = results.flatMap((result) => result.errors || []);
      return {
        isValid: allErrors.length === 0,
        errors: allErrors.length > 0 ? allErrors : undefined,
      };
    },
  };
};
