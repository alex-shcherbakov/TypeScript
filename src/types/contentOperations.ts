import { BaseContent } from './baseContent';

export type ContentOperations<T extends BaseContent> = {
  create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => T;
  update: (id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>) => T;
  delete: (id: string) => boolean;
  get: (id: string) => T | null;
  list: (filters?: Partial<T>) => T[];
};
