export type ValidationResult = {
    isValid: boolean;
    errors?: string[];
};
  
export type Validator<T> = {
    validate: (data: T) => ValidationResult;
}; 