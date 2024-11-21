import { Role, Permission } from '../types/rolePermissions';
import { BaseContent } from '../types/baseContent';

export type AccessControl<T extends BaseContent> = {
  getPermissions: (role: Role) => Permission;
  canPerform: (
    role: Role,
    operation: keyof Permission,
    content?: T
  ) => boolean;
};
