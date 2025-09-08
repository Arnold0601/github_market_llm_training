import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { Product } from '../types';

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.375 2.625a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.375-9.375Z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
  </svg>
);

import { PlusIcon } from './icons';

interface Props {
  onSelect: (p: Product) => void;
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onAddToBasket: (p: Product) => void;
  refreshKey?: number;
}

export function ProductCards({ onSelect, onView, onEdit, onDelete, onAddToBasket, refreshKey }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts().then(setProducts).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <p className="text-xs2 text-muted">Loading...</p>;
  if (error) return <p className="text-xs2 text-destructive">{error}</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(p => (
        <div
          key={p.id}
          className="bg-white border border-black/10 rounded-card p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-ink-900/40"
          tabIndex={0}
          onClick={() => onSelect(p)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(p); } }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm2 font-medium leading-tight text-ink-950 line-clamp-2 flex-1 pr-2">{p.name}</h4>
              <button 
                type="button" 
                aria-label="Add to basket" 
                onClick={e => { e.stopPropagation(); onAddToBasket(p); }} 
                className="btn-primary h-6 w-6 p-0 justify-center flex-shrink-0"
              >
                <PlusIcon />
              </button>
            </div>
            <p className="text-xs2 leading-relaxed text-muted mb-6 line-clamp-4">{p.description || 'No description provided.'}</p>
            <div className="mt-auto flex items-center justify-between text-xs2 text-muted">
              <span className="font-semibold text-ink-950 text-sm2">${p.price}</span>
              <span>Stock: {p.stock}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2 pt-2 border-t border-black/10">
            <button type="button" aria-label="View product" onClick={e => { e.stopPropagation(); onView(p); }} className="btn-outline flex-1 h-8 justify-center gap-2"><EyeIcon /> <span>View</span></button>
            <button type="button" aria-label="Edit product" onClick={e => { e.stopPropagation(); onEdit(p); }} className="btn-outline flex-1 h-8 justify-center gap-2"><EditIcon /> <span>Edit</span></button>
            <button type="button" aria-label="Delete product" onClick={e => { e.stopPropagation(); onDelete(p); }} className="btn-danger h-8 px-3"><TrashIcon /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
