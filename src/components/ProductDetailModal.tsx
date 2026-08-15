'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { X, ShieldCheck, ShoppingCart, Check, CreditCard, Store, Truck, Package } from 'lucide-react';

export const ProductDetailModal: React.FC<{ product: Product; onClose: () => void; onOpenCart: () => void }> = ({ product, onClose, onOpenCart }) => {
  const { paymentMethods, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Available payment methods for this specific product (filtered by merchant enabledPaymentMethods & global enabled)
  const productPaymentMethods = paymentMethods.filter(
    pm => pm.enabled && product.enabledPaymentMethods.includes(pm.id)
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      onClose();
      onOpenCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold">{product.partNumber}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-0.5">{product.name}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-72">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details & Specs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Price</span>
                <div className="text-2xl font-extrabold text-white">ETB {product.price.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Stock Status</span>
                <div className="text-sm font-bold text-emerald-400">{product.stock} units available</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Merchant Store:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-amber-500" /> {product.merchantName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Condition:</span>
                <span className="font-bold text-amber-400">{product.condition}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-white">{product.category}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-300">Vehicle Compatibility:</div>
              <div className="flex flex-wrap gap-1.5">
                {product.compatibility.map((comp, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-400 font-mono">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <h4 className="font-bold text-white text-xs uppercase font-mono text-amber-500">Part Description & Road Durability</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>
        </div>

        {/* Available Payment Methods for this specific product */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-white text-xs uppercase font-mono text-amber-500 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" /> Accepted Payment Methods for This Part ({productPaymentMethods.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {productPaymentMethods.map(pm => (
              <div key={pm.id} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-medium text-slate-200 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pm.logoBg}`}></div>
                <span className="truncate">{pm.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity & Add to Cart CTA */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Quantity:</span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-slate-300 hover:bg-slate-800 transition text-sm font-bold"
              >
                -
              </button>
              <span className="px-4 py-2 text-white font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3.5 py-2 text-slate-300 hover:bg-slate-800 transition text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg ${
              added ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart (ETB {(product.price * quantity).toLocaleString()})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
