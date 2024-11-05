type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description?: string;
};
type Electronics = BaseProduct & {
    category: 'electronics';
    warrantyPeriod: number;
    brand: string;
};
type Clothing = BaseProduct & {
    category: 'clothing';
    size: string;
    material: string;
};
type Book = BaseProduct & {
    category: 'book';
    author: string;
    genre: string;
};

// функція для пошуку товару за id
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    if (!Array.isArray(products) || typeof id !== "number") {
        throw new Error("Некоректні вхідні дані для findProduct");
    }
    return products.find(product => product.id === id);
};

// функція для фільтрації товарів за ціною
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    if (!Array.isArray(products) || typeof maxPrice !== "number") {
        throw new Error("Некоректні вхідні дані для filterByPrice");
    }
    return products.filter(product => product.price <= maxPrice);
};

type CartItem<T> = {
    product: T;
    quantity: number;
};

// функція для додавання товару в кошик
const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (!Array.isArray(cart) || typeof product !== "object" || typeof quantity !== "number") {
        throw new Error("Некоректні вхідні дані для addToCart");
    }

    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }
    return cart;
};

// функція для підрахунку загальної вартості кошика
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    if (!Array.isArray(cart)) {
        throw new Error("Некоректні вхідні дані для calculateTotal");
    }
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const electronics: Electronics[] = [
    {
      id: 1,
      name: "Телефон",
      price: 10000,
      category: 'electronics',
      warrantyPeriod: 24,
      brand: "BrandX"
    },
    {
      id: 2,
      name: "Ноутбук",
      price: 25000,
      category: 'electronics',
      warrantyPeriod: 12,
      brand: "BrandY"
    }
]; 

const clothing: Clothing[] = [
    {
      id: 3,
      name: "Футболка",
      price: 500,
      category: 'clothing',
      size: "M",
      material: "Cotton"
    },
    {
      id: 4,
      name: "Джинси",
      price: 1500,
      category: 'clothing',
      size: "L",
      material: "Denim"
    }
];

const books: Book[] = [
    {
      id: 5,
      name: "Роман",
      price: 300,
      category: 'book',
      author: "Автор А",
      genre: "Fiction"
    },
    {
      id: 6,
      name: "Наукова книга",
      price: 1200,
      category: 'book',
      author: "Автор Б",
      genre: "Science"
    }
];
  
// тестую функції
const phone = findProduct(electronics, 1);
console.log("Знайдений товар:", phone);

let cart: CartItem<Electronics | Clothing | Book>[] = [];
cart = addToCart(cart, electronics[0], 1);  
cart = addToCart(cart, clothing[1], 2);     

const total = calculateTotal(cart);
console.log(`Загальна вартість кошика: ${total}`);

const affordableElectronics = filterByPrice(electronics, 15000);
console.log("Доступна електроніка:", affordableElectronics);