'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, ShoppingCart, CreditCard, Upload, CheckCircle2, ShieldCheck, Trash2, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC<{ isOpen: boolean; onClose: () => void; onOrderPlaced: () => void }> = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, removeFromCart, updateCartQuantity, paymentMethods, merchants, createOrder } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [shippingAddress, setShippingAddress] = useState('Bole Medhanealem near Edna Mall, Addis Ababa');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(paymentMethods[0]?.id || 'telebirr');
  const [receiptImage, setReceiptImage] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const selectedPM = paymentMethods.find(p => p.id === selectedPaymentMethodId) || paymentMethods[0];

  // Find merchant for the first item in cart to get store-specific payment account if configured
  const firstItemMerchantId = cart[0]?.product.merchantId;
  const merchant = merchants.find(m => m.id === firstItemMerchantId);
  const merchantAccount = merchant?.paymentAccounts?.[selectedPaymentMethodId];

  const displayAccountNumber = merchantAccount?.accountNumber || selectedPM?.accountNumber;
  const displayAccountName = merchantAccount?.accountName || selectedPM?.accountName;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const order = createOrder(shippingAddress, selectedPaymentMethodId, receiptImage);
    setPlacedOrderId(order.id);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            {step === 'cart' ? 'Shopping Cart' : step === 'checkout' ? 'Ethiopian Secure Checkout' : 'Order Placed Successfully!'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART */}
        {step === 'cart' && (
          <div className="space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-white font-bold text-lg">Your cart is empty</h3>
                <p className="text-xs text-slate-400">Add some genuine auto parts from the catalog to proceed.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                        <div>
                          <h4 className="font-bold text-white text-xs line-clamp-1">{item.product.name}</h4>
                          <span className="text-[11px] text-amber-400 font-mono">ETB {item.product.price.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block">Sold by: {item.product.merchantName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-slate-300 hover:bg-slate-800 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-white font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-slate-300 hover:bg-slate-800 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">ETB {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Ethiopian Express Shipping (Merkato / Bole)</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-extrabold text-white">
                    <span>Total Amount</span>
                    <span className="text-amber-400">ETB {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT METHOD */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ethiopian Delivery Address / Bus Station</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                placeholder="e.g. Bole Medhanealem near Edna Mall or Merkato bus station"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Top 10 Payment Gateway Selection (Globally enabled by Admin & allowed by merchant product) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Select Ethiopian Payment Method (Globally Enabled)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {paymentMethods.filter(p => p.enabled).map(pm => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setSelectedPaymentMethodId(pm.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition flex flex-col justify-between space-y-1 ${
                      selectedPaymentMethodId === pm.id ? 'bg-amber-500/10 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-white truncate">{pm.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{pm.type.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Instructions & Merchant-Specific Account Details */}
            {selectedPM && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-400 text-xs uppercase font-mono flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> {selectedPM.name} Transfer Instructions
                  </h4>
                  {merchantAccount && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      Store Specific Account
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <div><span className="text-slate-400">Account Name:</span> {displayAccountName}</div>
                  <div><span className="text-slate-400">Account / Phone:</span> <strong className="text-white font-mono text-sm">{displayAccountNumber}</strong></div>
                  <p className="text-slate-400 pt-1 leading-relaxed">{selectedPM.instructions}</p>
                </div>
              </div>
            )}

            {/* Receipt Upload Simulator */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Upload Deposit Slip / SMS Confirmation Screenshot</label>
              <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 text-center bg-slate-950 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-6 h-6 text-amber-500" />
                <span className="text-xs text-slate-300 font-medium">Click to select receipt image or use default mock slip</span>
                <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, WEBP supported (Max 5MB)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
              >
                Submit Order & Upload Receipt (ETB {subtotal.toLocaleString()})
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Order Submitted Successfully!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your order ID <strong className="text-amber-400 font-mono">{placedOrderId}</strong> has been logged. Admin is reviewing your payment receipt for instant verification.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOrderPlaced();
              }}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
            >
              View Order Tracking & Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
