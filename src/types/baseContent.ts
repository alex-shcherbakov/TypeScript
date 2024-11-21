export interface BaseContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
}
  
export interface Article extends BaseContent {
    title: string;
    content: string;
    author: string;
    tags: string[];
}
  
export interface Product extends BaseContent {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}
  