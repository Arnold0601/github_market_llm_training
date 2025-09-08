import { Product, ProductCreate, BasketItem, BasketItemCreate, BasketItemUpdate } from './types';

const API_URL = 'http://localhost:8000';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products/`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function addProduct(product: ProductCreate): Promise<Product> {
  const res = await fetch(`${API_URL}/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return res.json();
}

export async function updateProduct(id: number, product: Partial<ProductCreate>): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}

// Basket API functions
export async function addToBasket(item: BasketItemCreate): Promise<BasketItem> {
  const res = await fetch(`${API_URL}/basket/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add to basket');
  return res.json();
}

export async function fetchBasket(): Promise<BasketItem[]> {
  const res = await fetch(`${API_URL}/basket/`);
  if (!res.ok) throw new Error('Failed to fetch basket');
  return res.json();
}

export async function updateBasketItem(id: number, update: BasketItemUpdate): Promise<BasketItem> {
  const res = await fetch(`${API_URL}/basket/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error('Failed to update basket item');
  return res.json();
}

export async function removeFromBasket(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/basket/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove from basket');
}

export async function clearBasket(): Promise<void> {
  const res = await fetch(`${API_URL}/basket/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear basket');
}
