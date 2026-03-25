import React, { useEffect, useState } from 'react';

function ProductCard({ p, onAdd }){
  return (
    <div className="border rounded p-2 m-2 w-40" style={{cursor:'pointer'}} onClick={() => onAdd(p)}>
      <div className="text-lg font-semibold">{p.name}</div>
      <div className="text-sm text-gray-600">{p.sku}</div>
      <div className="mt-2">{p.price.toFixed(2)} KES</div>
      <div className="text-xs text-gray-500">Stock: {p.stock}</div>
    </div>
  );
}

export default function SalesRegister({ products, onAdd, onCheckout, cart }){
  const [query, setQuery] = useState('');
  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()));
  const total = cart.reduce((s, it) => s + it.quantity * it.price, 0);

  return (
    <div className="p-4 grid grid-cols-12 gap-4" style={{height:'100%'}}>
      <div className="col-span-4 border rounded p-2" style={{minHeight:400}}>
        <input placeholder="Search products..." className="border rounded w-full p-2" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="flex flex-wrap mt-2" style={{maxHeight:360, overflow:'auto'}}>
          {filtered.map(p => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} />
          ))}
        </div>
      </div>
      <div className="col-span-4 border rounded p-2" style={{minHeight:400}}>
        <h3 className="text-lg font-semibold mb-2">Cart</h3>
        <div style={{maxHeight:300, overflow:'auto'}}>
          {cart.length === 0 && <div className="text-sm text-gray-500">Cart is empty. Add items to start.</div>}
          {cart.map((it, idx) => (
            <div key={idx} className="flex justify-between border-b py-1">
              <span>{it.name} x{it.quantity}</span>
              <span>{(it.quantity * it.price).toFixed(2)} KES</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-2 pt-2 flex justify-between">
          <strong>Total</strong>
          <span>{total.toFixed(2)} KES</span>
        </div>
        <button className="mt-3 w-full bg-blue-600 text-white p-2 rounded" onClick={onCheckout}>Checkout</button>
      </div>
      <div className="col-span-4 border rounded p-2" style={{minHeight:400}}>
        <h3 className="text-lg font-semibold mb-2">Details</h3>
        <div className="text-sm text-gray-700">[Day-end info, store settings, and quick actions would live here]</div>
      </div>
    </div>
  );
}
