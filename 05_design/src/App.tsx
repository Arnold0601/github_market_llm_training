import { useState } from 'react';
import { Product, ProductCreate } from './types';
import { ProductCards } from './components/ProductCards';
import { ProductForm } from './components/ProductForm';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { addProduct, updateProduct, deleteProduct, addToBasket } from './api';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [basketRefreshKey, setBasketRefreshKey] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  function handleAdded(p: ProductCreate) {
    addProduct(p).then(() => {
      setShowAdd(false);
      setRefreshKey(k => k + 1);
    });
  }

  function handleUpdated(p: ProductCreate) {
    if (!selected) return;
    updateProduct(selected.id, p).then(() => {
      setShowEdit(false);
      setRefreshKey(k => k + 1);
    });
  }

  function handleDelete() {
    if (!selected) return;
    deleteProduct(selected.id).then(() => {
      setShowDelete(false);
      setSelected(null);
      setRefreshKey(k => k + 1);
    });
  }

  function handleAddToBasket(product: Product) {
    if (product.stock <= 0) {
      showToast('This product is out of stock', 'error');
      return;
    }
    
    addToBasket({ product_id: product.id, quantity: 1 }).then(() => {
      setBasketRefreshKey(k => k + 1);
      showToast('Item added to basket', 'success');
    }).catch(error => {
      // Parse error message from backend
      let errorMessage = 'Failed to add to basket';
      if (error.message.includes('400')) {
        // Extract the detailed error message from the backend
        if (error.message.includes('Only') && error.message.includes('available')) {
          errorMessage = 'Cannot add more items - insufficient stock available';
        } else if (error.message.includes('out of stock')) {
          errorMessage = 'This product is out of stock';
        } else {
          errorMessage = 'Cannot add item - stock limit reached';
        }
      }
      showToast(errorMessage, 'error');
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-ink-950">Products</h1>
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center justify-center h-[31.5px] px-4 rounded-btn bg-ink-950 text-white text-xs2 font-medium shadow-sm hover:bg-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-900/40 transition">
            <span className="-mt-px">Add Product</span>
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-10" key={refreshKey}>
        <div className="flex items-center justify-between gap-6 mb-2">
          <div className="relative w-96 h-8 hidden md:block">
            <input placeholder="Search products..." className="w-full h-full rounded-btn bg-slate-100/80 text-xs2 px-9 outline-none focus:ring-2 focus:ring-ink-900/40 placeholder:text-muted" />
            <span className="absolute left-3 top-1.5 text-muted text-xs">🔍</span>
          </div>
        </div>
        <ProductCards
          refreshKey={refreshKey}
          onSelect={p => { setSelected(p); setShowDetails(true); }}
          onView={p => { setSelected(p); setShowDetails(true); }}
          onEdit={p => { setSelected(p); setShowEdit(true); }}
          onDelete={p => { setSelected(p); setShowDelete(true); }}
          onAddToBasket={handleAddToBasket}
        />
  {/* Details section removed in favor of modal */}
      <Modal open={showDetails && !!selected} onClose={() => setShowDetails(false)} ariaLabel="Product details dialog">
        {selected && (
          <div className="w-[444px] max-w-full space-y-6">
            {/* Header + description */}
            <div className="flex items-start justify-between">
              <div className="pr-4 space-y-3 min-w-0">
                <p className="text-[16px] font-semibold leading-none tracking-tight text-ink-950">Product Details</p>
                <h2 className="text-[16px] font-semibold leading-tight text-ink-950 break-words" title={selected.name}>{selected.name}</h2>
                <p className="text-[14px] leading-relaxed text-muted break-words">{selected.description || 'No description provided.'}</p>
              </div>
              <button onClick={() => setShowDetails(false)} aria-label="Close" className="icon-btn">✕</button>
            </div>
            <div className="h-px bg-black/10" />
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[13px]">
              <div className="space-y-1">
                <div className="text-muted">Price:</div>
                <div className="font-medium text-ink-950">$ {Number(selected.price).toFixed(2)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted">Stock:</div>
                <div className={selected.stock === 0 ? 'font-medium text-destructive' : 'font-medium text-ink-950'}>{selected.stock} {selected.stock === 1 ? 'unit' : 'units'}</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="text-muted">Product ID:</div>
                <div className="font-medium text-ink-950">{selected.id}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </main>

  <Modal open={showAdd} onClose={() => setShowAdd(false)} ariaLabel="Add product dialog">
        <ProductForm title="Add Product" onSubmit={handleAdded} onCancel={() => setShowAdd(false)} />
      </Modal>

  <Modal open={showEdit} onClose={() => setShowEdit(false)} ariaLabel="Edit product dialog">
        <ProductForm title="Edit Product" initial={selected || undefined} onSubmit={handleUpdated} onCancel={() => setShowEdit(false)} />
      </Modal>

  <Modal open={showDelete} onClose={() => setShowDelete(false)} ariaLabel="Delete product confirmation dialog">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-base2 font-medium text-ink-950 leading-snug">Delete product</h3>
              <p className="text-xs2 text-muted leading-relaxed">This will permanently remove <span className="font-medium text-ink-950">{selected?.name || 'this product'}</span> and its data. This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={() => setShowDelete(false)} className="btn-outline">Cancel</button>
            <button onClick={handleDelete} className="btn-danger min-w-[96px]">Delete</button>
          </div>
        </div>
      </Modal>

      {/* Basket component in bottom left corner */}
      <Basket 
        refreshKey={basketRefreshKey} 
        onBasketUpdate={() => setRefreshKey(k => k + 1)}
        onShowToast={showToast}
      />

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-fade-in min-w-80 max-w-96 p-4 rounded-card border shadow-lg ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 ${
                toast.type === 'success' ? 'text-green-500' :
                toast.type === 'error' ? 'text-red-500' :
                toast.type === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
              }`}>
                {toast.type === 'success' ? '✓' : 
                 toast.type === 'error' ? '✕' : 
                 toast.type === 'warning' ? '⚠' : 'ℹ'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm2 leading-relaxed pr-2">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
