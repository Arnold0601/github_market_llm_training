import { useState, useEffect } from 'react';
import { BasketItem } from '../types';
import { fetchBasket, updateBasketItem, removeFromBasket, clearBasket } from '../api';

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
  </svg>
);

interface Props {
  refreshKey?: number;
  onBasketUpdate?: () => void;
}

export function Basket({ refreshKey, onBasketUpdate }: Props) {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBasket = async () => {
    try {
      setLoading(true);
      const items = await fetchBasket();
      setBasketItems(items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load basket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBasket();
  }, [refreshKey]);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      await updateBasketItem(itemId, { quantity: newQuantity });
      await loadBasket();
      onBasketUpdate?.();
      setError(null); // Clear any previous errors
    } catch (err) {
      // Parse error message for better user experience
      let errorMessage = 'Failed to update item';
      if (err instanceof Error && err.message.includes('400')) {
        if (err.message.includes('Only') && err.message.includes('available')) {
          errorMessage = 'Insufficient stock available';
        } else if (err.message.includes('Cannot set quantity')) {
          errorMessage = 'Stock limit exceeded';
        }
      }
      setError(errorMessage);
      // Reload basket to reset to correct quantities
      await loadBasket();
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromBasket(itemId);
      await loadBasket();
      onBasketUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const handleClearBasket = async () => {
    try {
      await clearBasket();
      await loadBasket();
      onBasketUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear basket');
    }
  };

  const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = basketItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="fixed bottom-4 left-4 bg-white border border-black/10 rounded-card p-4 shadow-lg w-80">
        <p className="text-xs2 text-muted">Loading basket...</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-black/10 rounded-card p-4 shadow-lg w-80 max-h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm2 font-medium text-ink-950">Basket ({totalItems})</h3>
        {basketItems.length > 0 && (
          <button
            onClick={handleClearBasket}
            className="text-xs2 text-destructive hover:text-destructive/80"
          >
            Clear All
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs2 text-destructive mb-2">{error}</p>
      )}

      {basketItems.length === 0 ? (
        <p className="text-xs2 text-muted">Your basket is empty</p>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {basketItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2 border border-black/5 rounded-cardsm">
                <div className="flex-1 min-w-0">
                  <p className="text-xs2 font-medium text-ink-950 truncate">{item.product.name}</p>
                  <p className="text-xs text-muted">${item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-muted"
                  >
                    <MinusIcon />
                  </button>
                  <span className="text-xs2 font-medium min-w-[20px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-muted"
                  >
                    <PlusIcon />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-6 w-6 rounded bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center text-destructive ml-1"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-black/10 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm2 font-medium text-ink-950">Total:</span>
              <span className="text-sm2 font-semibold text-ink-950">${totalValue.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
