import { Article } from '../types/baseContent';
import { Validator } from '../types/validators';

export const articleValidator: Validator<Article> = {
  validate(data) {
    const errors: string[] = [];
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required.');
    }
    if (!data.content || data.content.trim().length < 50) {
      errors.push('Content must be at least 50 characters long.');
    }
    if (!data.author || data.author.trim().length === 0) {
      errors.push('Author is required.');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};
