import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import type { Product } from '../types';

interface Props {
  onSelect: (product: Product) => void;
  onAdd: () => void;
}

export function ProductTable({ onSelect, onAdd }: Props) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h2 className="text-lg font-semibold">Products</h2>
        <button onClick={onAdd} className="inline-flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500">
          + New
        </button>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
          <tr>
            <th className="text-left font-medium px-4 py-2">Name</th>
            <th className="text-left font-medium px-4 py-2">Price</th>
            <th className="text-left font-medium px-4 py-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id} className="hover:bg-indigo-50 cursor-pointer" onClick={() => onSelect(p)}>
              <td className="px-4 py-2 font-medium text-slate-800">{p.name}</td>
              <td className="px-4 py-2 text-slate-700">${p.price}</td>
              <td className="px-4 py-2 text-slate-700">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
