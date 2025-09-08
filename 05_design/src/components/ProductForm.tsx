import { useState } from 'react';
import type { ProductCreate } from '../types';

interface Props {
  onSubmit: (data: ProductCreate) => void;
  onCancel: () => void;
  initial?: Partial<ProductCreate>;
  title: string;
}

export function ProductForm({ onSubmit, onCancel, initial, title }: Props) {
  const isEdit = Boolean(initial && Object.keys(initial).length);
  const [form, setForm] = useState<ProductCreate>({
    name: initial?.name ?? '',
    price: initial?.price ?? 0,
    description: initial?.description ?? '',
    stock: initial?.stock ?? 0,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const errors: Partial<Record<keyof ProductCreate, string>> = {};
  if (!form.name.trim()) errors.name = 'Name required';
  if (form.price <= 0) errors.price = 'Price must be > 0';
  if (form.stock < 0) errors.stock = 'Stock must be >= 0';

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  }
  function handleBlur(e: React.FocusEvent<any>) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, price: true, description: true, stock: true });
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  }

  const submitLabel = isEdit ? 'Save Changes' : 'Create Product';
  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-describedby={isEdit ? 'edit-desc' : 'create-desc'}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base2 font-normal text-ink-950 leading-snug">{title}</h3>
          <p id={isEdit ? 'edit-desc' : 'create-desc'} className="mt-1 text-xs2 text-muted">
            {isEdit ? 'Update the product information below.' : 'Fill in the details to create a new product.'}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="icon-btn" aria-label="Close dialog">✕</button>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-xs2 font-medium text-ink-950">Product Name<span className="text-destructive">*</span></label>
          <input id="name" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} className="input" placeholder="e.g. Wireless Mouse" />
          {touched.name && errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="price" className="block text-xs2 font-medium text-ink-950">Price<span className="text-destructive">*</span></label>
            <input id="price" name="price" type="number" value={form.price} onChange={handleChange} onBlur={handleBlur} className="input" placeholder="0.00" step="0.01" min={0} />
            {touched.price && errors.price && <p className="text-[10px] text-destructive mt-1">{errors.price}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="stock" className="block text-xs2 font-medium text-ink-950">Stock<span className="text-destructive">*</span></label>
            <input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} onBlur={handleBlur} className="input" placeholder="0" min={0} />
            {touched.stock && errors.stock && <p className="text-[10px] text-destructive mt-1">{errors.stock}</p>}
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="description" className="block text-xs2 font-medium text-ink-950">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} onBlur={handleBlur} className="input min-h-28" placeholder="Short marketing-friendly summary (optional)" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        <button type="submit" disabled={submitting || Object.keys(errors).length > 0} className="btn-primary min-w-[124px]">
          {submitting ? (isEdit ? 'Saving...' : 'Creating...') : submitLabel}
        </button>
      </div>
    </form>
  );
}
