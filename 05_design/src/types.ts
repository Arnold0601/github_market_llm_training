export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
}

export interface ProductCreate {
  name: string;
  price: number;
  description?: string;
  stock: number;
}

export interface BasketItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface BasketItemCreate {
  product_id: number;
  quantity?: number;
}

export interface BasketItemUpdate {
  quantity: number;
}
