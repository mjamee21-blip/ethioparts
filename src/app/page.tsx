'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { AdminDashboard } from '@/components/AdminDashboard';
import { MerchantDashboard } from '@/components/MerchantDashboard';
import { BuyerHome } from '@/components/BuyerHome';
import { BuyerCatalog } from '@/components/BuyerCatalog';
import { OrderTracking } from '@/components/OrderTracking';
import { Product } from '@/types';
import { Wrench, ShieldCheck, Heart, ShoppingCart, ArrowLeft, Store, CreditCard, Upload, CheckCircle2, Trash2, ArrowRight, Check } from 'lucide-react';

// Dedicated Inline Product Detail Page (No popup)
function ProductDetailPage({ product, onBack, onGoToCart }: { product: Product; onBack: () => void; onGoToCart: () => void }) {
  const { paymentMethods, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productPaymentMethods = paymentMethods.filter(
    pm => pm.enabled && product.enabledPaymentMethods.includes(pm.id)
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      onGoToCart();
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog / Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-80 md:h-96">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Part #{product.partNumber}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">{product.name}</h1>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Price</span>
              <div className="text-3xl font-extrabold text-amber-400">ETB {product.price.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Stock Status</span>
              <div className="text-sm font-bold text-emerald-400">{product.stock} units available</div>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Merchant Store:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-500" /> {product.merchantName}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Condition:</span>
              <span className="font-bold text-amber-400">{product.condition}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Category:</span>
              <span className="font-bold text-white">{product.category}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">Vehicle Compatibility:</div>
            <div className="flex flex-wrap gap-2">
              {product.compatibility.map((comp, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <h2 className="font-bold text-white text-sm uppercase font-mono text-amber-500">Part Description & Road Durability</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
      </div>

      {/* Accepted Payment Methods */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <h2 className="font-bold text-white text-sm uppercase font-mono text-amber-500 flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> Accepted Payment Methods for This Part ({productPaymentMethods.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {productPaymentMethods.map(pm => (
            <div key={pm.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center gap-2.5">
              <div className={`w-2.5 h-2.5 rounded-full ${pm.logoBg}`}></div>
              <span className="truncate">{pm.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add to Cart Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 font-medium">Select Quantity:</span>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2.5 text-slate-300 hover:bg-slate-800 transition text-base font-bold"
            >
              -
            </button>
            <span className="px-5 py-2.5 text-white font-bold text-base">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-2.5 text-slate-300 hover:bg-slate-800 transition text-base font-bold"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`w-full sm:w-auto px-10 py-4 rounded-xl font-extrabold text-base transition flex items-center justify-center gap-3 shadow-xl ${
            added ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" /> Added to Cart Successfully!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" /> Add to Cart (ETB {(product.price * quantity).toLocaleString()})
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Dedicated Inline Cart & Secure Checkout Page (No popup)
function CartCheckoutPage({ onBack, onOrderPlaced }: { onBack: () => void; onOrderPlaced: () => void }) {
  const { cart, removeFromCart, updateCartQuantity, paymentMethods, merchants, createOrder } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [shippingAddress, setShippingAddress] = useState('Bole Medhanealem near Edna Mall, Addis Ababa');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(paymentMethods[0]?.id || 'telebirr');
  const [receiptImage, setReceiptImage] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  const [placedOrderId, setPlacedOrderId] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const selectedPM = paymentMethods.find(p => p.id === selectedPaymentMethodId) || paymentMethods[0];

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-amber-500" />
            {step === 'cart' ? 'Shopping Cart & Items' : step === 'checkout' ? 'Ethiopian Secure Offline Checkout' : 'Order Placed Successfully'}
          </h1>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Step {step === 'cart' ? '1 of 2' : step === 'checkout' ? '2 of 2' : 'Completed'}
          </span>
        </div>

        {/* STEP 1: CART */}
        {step === 'cart' && (
          <div className="space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto" />
                <h3 className="text-white font-bold text-xl">Your shopping cart is currently empty</h3>
                <p className="text-sm text-slate-400">Browse our certified catalog of genuine auto parts for Ethiopian roads.</p>
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
                >
                  Explore Parts Catalog
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-white text-sm">{item.product.name}</h3>
                          <span className="text-xs text-amber-400 font-mono">ETB {item.product.price.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Merchant Store: {item.product.merchantName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-white font-bold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-red-400 p-2 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">ETB {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Ethiopian Express Shipping (Merkato / Bole Hub)</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-slate-800 pt-3 flex justify-between text-lg font-extrabold text-white">
                    <span>Total Amount</span>
                    <span className="text-amber-400">ETB {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 text-base"
                >
                  <span>Proceed to Secure Offline Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT METHOD */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ethiopian Delivery Address / Bus Station</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                placeholder="e.g. Bole Medhanealem near Edna Mall or Merkato bus station"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Select Ethiopian Payment Method (Top 10)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                {paymentMethods.filter(p => p.enabled).map(pm => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setSelectedPaymentMethodId(pm.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium transition flex flex-col justify-between space-y-1.5 ${
                      selectedPaymentMethodId === pm.id ? 'bg-amber-500/10 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-white truncate">{pm.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{pm.type.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedPM && (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-amber-400 text-xs uppercase font-mono flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> {selectedPM.name} Transfer Instructions
                  </h3>
                  {merchantAccount && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      Store Specific Account
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div><span className="text-slate-400">Account Name:</span> {displayAccountName}</div>
                  <div><span className="text-slate-400">Account / Phone:</span> <strong className="text-white font-mono text-sm">{displayAccountNumber}</strong></div>
                  <p className="text-slate-400 pt-1 leading-relaxed">{selectedPM.instructions}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Upload Deposit Slip / SMS Confirmation Screenshot</label>
              <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-950 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-8 h-8 text-amber-500" />
                <span className="text-xs text-slate-300 font-medium">Click to select receipt image or use default mock slip</span>
                <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, WEBP supported (Max 5MB)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="px-10 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-xl shadow-amber-500/20"
              >
                Submit Order & Upload Receipt (ETB {subtotal.toLocaleString()})
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Order Submitted Successfully!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your order ID <strong className="text-amber-400 font-mono">{placedOrderId}</strong> has been logged. Admin is reviewing your payment receipt for instant verification.
              </p>
            </div>

            <button
              onClick={onOrderPlaced}
              className="px-10 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-xl shadow-amber-500/20"
            >
              View Order Tracking & Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { currentUser, activeTab, setActiveTab } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenCart={() => setActiveTab('cart-checkout')} />

      <main className="flex-grow">
        {currentUser.role === 'admin' && activeTab === 'admin' ? (
          <AdminDashboard />
        ) : currentUser.role === 'merchant' && activeTab === 'merchant' ? (
          <MerchantDashboard />
        ) : (
          <>
            {activeTab === 'home' && (
              <BuyerHome 
                onSelectProduct={p => { setSelectedProduct(p); setActiveTab('product-detail'); }} 
                onViewCatalog={() => setActiveTab('catalog')} 
              />
            )}
            {activeTab === 'catalog' && (
              <BuyerCatalog 
                onSelectProduct={p => { setSelectedProduct(p); setActiveTab('product-detail'); }} 
              />
            )}
            {activeTab === 'product-detail' && selectedProduct && (
              <ProductDetailPage 
                product={selectedProduct} 
                onBack={() => setActiveTab('home')} 
                onGoToCart={() => setActiveTab('cart-checkout')} 
              />
            )}
            {activeTab === 'cart-checkout' && (
              <CartCheckoutPage 
                onBack={() => setActiveTab('home')} 
                onOrderPlaced={() => setActiveTab('tracking')} 
              />
            )}
            {activeTab === 'tracking' && (
              <OrderTracking />
            )}
            {activeTab === 'admin' && currentUser.role === 'admin' && (
              <AdminDashboard />
            )}
            {activeTab === 'merchant' && currentUser.role === 'merchant' && (
              <MerchantDashboard />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
                <Wrench className="w-4 h-4 font-bold" />
              </div>
              Ethio<span className="text-amber-500">Parts</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The premier multi-tenant e-commerce platform for genuine automotive spare parts across Ethiopia. Built for durability on Ethiopian roads.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs font-mono mb-3 text-amber-500">Top Payment Gateways</h4>
            <ul className="space-y-1.5">
              <li>Telebirr & M-Pesa</li>
              <li>CBE Birr & CBE Direct</li>
              <li>Awash & Bank of Abyssinia</li>
              <li>Dashen, Wegagen & Hibret Bank</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs font-mono mb-3 text-amber-500">Vehicle Compatibility</h4>
            <ul className="space-y-1.5">
              <li>Toyota Hilux, Vitz & Corolla</li>
              <li>Hyundai Tucson & Creta</li>
              <li>Isuzu NPR & NQR Commercial</li>
              <li>Bajaj RE Three-Wheelers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs font-mono mb-3 text-amber-500">Multi-Tenant Roles</h4>
            <ul className="space-y-1.5">
              <li>Admin Oversight & Commissions</li>
              <li>Merchant Inventory CRUD</li>
              <li>Buyer Catalog & Checkout</li>
              <li>Receipt Verification Queue</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <p>© 2026 EthioParts E-Commerce PLC. All rights reserved. Addis Ababa, Ethiopia.</p>
          <p className="flex items-center gap-1">
            Engineered for Ethiopian Roads with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
