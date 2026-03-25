import React, { useEffect, useState } from 'react';
import SalesRegister from './ui/SalesRegister.jsx';

export default function App(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(0.16);

  // Load products and settings on mount
  useEffect(() => {
    // Try IPC call to list products
    const load = async () => {
      try {
        const prod = await window.api.products.list();
        if (Array.isArray(prod)) {
          setProducts(prod);
        } else {
          // Fallback to sample data
          setProducts([
            { id:1, name:'Milk 1L', sku:'MILK-1L', price: 120, stock: 20 },
            { id:2, name:'Bread', sku:'BRD-001', price: 40, stock: 50 },
            { id:3, name:'Eggs Dozen', sku:'EGG-12', price: 180, stock: 30 }
          ]);
        }
      } catch (e) {
        // Fallback sample
        setProducts([
          { id:1, name:'Milk 1L', sku:'MILK-1L', price: 120, stock: 20 },
          { id:2, name:'Bread', sku:'BRD-001', price: 40, stock: 50 },
          { id:3, name:'Eggs Dozen', sku:'EGG-12', price: 180, stock: 30 }
        ]);
      }
    };
    load();

    // Load tax rate from settings (optional)
    const loadSettings = async () => {
      try {
        const s = await window.api.settings.getAll();
        if (s && s.tax_rate) {
          setTaxRate(parseFloat(s.tax_rate));
        }
      } catch (e) {
        // ignore, keep default
      }
    };
    loadSettings();
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const found = prev.find(x => x.id === p.id);
      if (found) {
        return prev.map(x => x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x);
      } else {
        return [...prev, { id: p.id, name: p.name, price: p.price, quantity: 1 }];
      }
    });
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    const items = cart.map(c => ({ product_id: c.id, quantity: c.quantity, unit_price: c.price }));
    try {
      const res = await window.api.sales.create({ items, payment_method: 'cash', taxRate, discount: 0 });
      alert(`Sale created: ID ${res.saleId}, Total ${res.total} KES`);
      setCart([]);
    } catch (e) {
      alert('Checkout failed: ' + (e?.message || e));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white border-b">
        <h1 className="text-xl font-semibold">Duka POS</h1>
      </header>
      <main className="p-4">
        <SalesRegister products={products} onAdd={addToCart} onCheckout={checkout} cart={cart} />
      </main>
    </div>
  );
}
