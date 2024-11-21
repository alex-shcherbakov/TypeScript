import { BaseContent } from '../types/baseContent';

export type Versioned<T extends BaseContent> = T & {
  version: number;
  previousVersions: T[];
};

export type VersioningOperations<T extends BaseContent> = {
  createNewVersion: (content: Versioned<T>) => Versioned<T>;
  getPreviousVersions: (content: Versioned<T>) => T[];
};

export const versioningOperations: VersioningOperations<BaseContent> = {
  createNewVersion(content) {
    const newVersion: Versioned<BaseContent> = {
      ...content,
      version: content.version + 1,
      previousVersions: [...content.previousVersions, { ...content }],
    };
    return newVersion;
  },
  getPreviousVersions(content) {
    return content.previousVersions;
  },
};
