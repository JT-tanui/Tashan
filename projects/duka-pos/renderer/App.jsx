import React, { useEffect, useState } from 'react';
import SalesRegister from './ui/SalesRegister.jsx'; // Assuming SalesRegister is in src/ui/
import './styles.css'; // Import styles

// Placeholder for API calls
const api = window.api || {
  products: {
    list: async () => [ // Fallback data if IPC not ready
      { id: 101, name: 'Sample Milk 1L', sku: 'MILK-1L-SAMPLE', price: 70, stock: 15 },
      { id: 102, name: 'Sample Bread', sku: 'BRD-001-SAMPLE', price: 45, stock: 60 },
      { id: 103, name: 'Sample Eggs Dozen', sku: 'EGG-12-SAMPLE', price: 190, stock: 25 }
    ],
  },
  settings: {
    getAll: async () => ({ tax_rate: '0.16' }) // Default Tax Rate
  },
  sales: {
    create: async (saleData) => {
      console.log('Mock sales create:', saleData);
      alert(`Mock Sale Created: Total ${saleData.total.toFixed(2)} KES. (IPC call to backend needed)`);
      return { saleId: Date.now(), total: saleData.total };
    }
  }
};

export default function App(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(0.16); // Default to 0.16 (16%)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products and settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let loadedProducts = [];
        // Prefer IPC call, fallback to mock data
        if (window.api && window.api.products && window.api.products.list) {
          loadedProducts = await window.api.products.list();
        } else {
          console.warn('window.api.products.list not available, using fallback data.');
          loadedProducts = await api.products.list(); // Use mock API
        }
        setProducts(loadedProducts);

        let loadedTaxRate = 0.16;
        if (window.api && window.api.settings && window.api.settings.getAll) {
          const settings = await window.api.settings.getAll();
          if (settings && settings.tax_rate) {
            loadedTaxRate = parseFloat(settings.tax_rate);
          }
        } else {
          console.warn('window.api.settings.getAll not available, using default tax rate.');
          loadedTaxRate = await api.settings.getAll().then(s => parseFloat(s.tax_rate));
        }
        setTaxRate(loadedTaxRate);

      } catch (e) {
        console.error("Error loading data:", e);
        setError("Failed to load application data. Please ensure the backend is running.");
        // Fallback to mock data on error too
        setProducts(await api.products.list());
        setTaxRate(await api.settings.getAll().then(s => parseFloat(s.tax_rate)));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const itemIndex = prev.findIndex(item => item.id === p.id);
      if (itemIndex > -1) {
        // Increase quantity if product is already in cart
        const newCart = [...prev];
        newCart[itemIndex].quantity += 1;
        return newCart;
      } else {
        // Add new product to cart
        return [...prev, { id: p.id, name: p.name, price: p.price, quantity: 1 }];
      }
    });
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty. Add items first.");
      return;
    }

    // Mock sale data structure, real data comes from cart and settings
    const saleData = {
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        line_total: item.quantity * item.price
      })),
      payment_method: 'cash', // Default to cash, enhance later for M-Pesa
      taxRate: taxRate, // Use tax rate from settings
      discount: 0 // No discount for MVP
    };

    // Calculate total before sending (can be done in backend too, but good for UI feedback)
    let subtotal = 0;
    saleData.items.forEach(it => subtotal += it.line_total);
    const tax = +(subtotal * saleData.taxRate).toFixed(2);
    const total = +(subtotal + tax - saleData.discount).toFixed(2); // Ensure total is calculated correctly

    // Call IPC to create sale
    try {
      if (window.api && window.api.sales && window.api.sales.create) {
        const result = await window.api.sales.create({ ...saleData, total }); // Send calculated total
        alert(`Sale successful! ID: ${result.saleId}, Total: ${total.toFixed(2)} KES`);
        setCart([]); // Clear cart after successful sale
      } else {
        // Fallback to mock API if IPC is not ready
        await api.sales.create({ ...saleData, total });
        setCart([]);
      }
    } catch (e) {
      console.error("Checkout failed:", e);
      alert('Checkout failed: ' + (e?.message || e));
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading Duka POS...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Duka POS</h1>
      </header>
      <main className="flex-grow p-4">
        <SalesRegister
          products={products}
          onAdd={addToCart}
          onCheckout={checkout}
          cart={cart}
        />
      </main>
    </div>
  );
}
