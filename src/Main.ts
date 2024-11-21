import { Article } from './types/baseContent';
import { articleValidator } from './validators/articleValidator';
import { versioningOperations } from './versioning/versioningOperations';

const article: Article = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'Article Title',
  content: 'This is some content.',
  author: 'Author Name',
  tags: ['tag1', 'tag2'],
  status: 'draft',
};

const validationResult = articleValidator.validate(article);
console.log('Article Validation:', validationResult);

const updatedArticle = versioningOperations.createNewVersion({
  ...article,
  version: 1,
  previousVersions: [],
});
console.log('Updated Article Version:', updatedArticle);
