'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Store, Package, Plus, DollarSign, Clock, CheckCircle2, XCircle, Truck, CreditCard, Edit, Trash2, X, Check, Phone, Settings, AlertCircle } from 'lucide-react';
import { Product, Order } from '@/types';

export const MerchantDashboard: React.FC = () => {
  const { 
    currentUser, 
    merchants, 
    products, 
    orders, 
    paymentMethods, 
    adminCommissionPaymentMethodId,
    payOrderCommission,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateFulfillmentStatus, 
    updateMerchantPaymentAccount, 
    verifyOrderReceipt 
  } = useApp();

  const merchant = merchants.find(m => m.id === currentUser.merchantId) || merchants[0];
  const merchantProducts = products.filter(p => p.merchantId === merchant.id);
  const merchantOrders = orders.filter(o => o.items.some(item => item.merchantId === merchant.id));

  const adminPM = paymentMethods.find(p => p.id === adminCommissionPaymentMethodId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<{ orderId: string; imageUrl: string; buyerName: string; totalAmount: number; paymentMethod: string } | null>(null);

  // Form state for product CRUD
  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('Engine & Components');
  const [price, setPrice] = useState(1500);
  const [stock, setStock] = useState(10);
  const [condition, setCondition] = useState<Product['condition']>('Brand New');
  const [compatibility, setCompatibility] = useState('Toyota Hilux Revo 2018-2022');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(
    paymentMethods.filter(p => p.enabled).map(p => p.id)
  );

  // Local state for editing merchant payment accounts
  const [accountInputs, setAccountInputs] = useState<Record<string, { accountNumber: string; accountName: string; enabled: boolean }>>(() => {
    const initial: Record<string, { accountNumber: string; accountName: string; enabled: boolean }> = {};
    paymentMethods.filter(p => p.enabled).forEach(pm => {
      const existing = merchant.paymentAccounts?.[pm.id];
      initial[pm.id] = {
        accountNumber: existing?.accountNumber || pm.accountNumber,
        accountName: existing?.accountName || merchant.ownerName,
        enabled: !!existing || true
      };
    });
    return initial;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPartNumber('');
    setPrice(2500);
    setStock(15);
    setCompatibility('Toyota Vitz 2015-2020');
    setDescription('');
    setSelectedPaymentMethods(paymentMethods.filter(p => p.enabled).map(p => p.id));
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPartNumber(prod.partNumber);
    setCategory(prod.category);
    setPrice(prod.price);
    setStock(prod.stock);
    setCondition(prod.condition);
    setCompatibility(prod.compatibility.join(', '));
    setDescription(prod.description);
    setImageUrl(prod.imageUrl);
    setSelectedPaymentMethods(prod.enabledPaymentMethods);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const compArray = compatibility.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        partNumber,
        category,
        price: Number(price),
        stock: Number(stock),
        condition,
        compatibility: compArray,
        description,
        imageUrl,
        enabledPaymentMethods: selectedPaymentMethods
      });
    } else {
      addProduct({
        merchantId: merchant.id,
        merchantName: merchant.name,
        name,
        partNumber,
        category,
        price: Number(price),
        stock: Number(stock),
        condition,
        compatibility: compArray,
        description,
        imageUrl,
        enabledPaymentMethods: selectedPaymentMethods
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleMerchantPm = (pmId: string) => {
    const current = accountInputs[pmId] || { accountNumber: '', accountName: merchant.ownerName, enabled: false };
    const newEnabled = !current.enabled;
    setAccountInputs(prev => ({
      ...prev,
      [pmId]: { ...current, enabled: newEnabled }
    }));
    if (newEnabled) {
      updateMerchantPaymentAccount(merchant.id, pmId, current.accountNumber || 'Pending Account #', current.accountName);
    }
  };

  const handleAccountFieldChange = (pmId: string, field: 'accountNumber' | 'accountName', value: string) => {
    const current = accountInputs[pmId] || { accountNumber: '', accountName: merchant.ownerName, enabled: true };
    const updated = { ...current, [field]: value };
    setAccountInputs(prev => ({ ...prev, [pmId]: updated }));
    updateMerchantPaymentAccount(merchant.id, pmId, updated.accountNumber, updated.accountName);
  };

  // Commission calculations (10% owed to admin within 3 days)
  const merchantVerifiedOrders = merchantOrders.filter(o => o.paymentStatus === 'verified');
  const totalCommissionOwed = merchantVerifiedOrders.reduce((sum, o) => sum + o.commission, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Merchant Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" /> Merchant Portal (Payment Verifier & Store Owner) • {merchant.city}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{merchant.name}</h1>
          <p className="text-slate-400 text-sm mt-1">Owner: {merchant.ownerName} | Rating: ★ {merchant.rating} ({merchantProducts.length} Active Parts)</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition transform active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Auto Part
        </button>
      </div>

      {/* COMMISSION & 3-DAY PAYOUT TO ADMIN NOTICE */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4" /> Platform 10% Commission (3-Day Max Remittance Window)
            </div>
            <h3 className="text-lg font-bold text-white">Total Commission Owed to Website Owner: <span className="text-amber-400">ETB {totalCommissionOwed.toLocaleString()}</span></h3>
            <p className="text-xs text-slate-400">
              Per platform policy, you must remit the 10% website commission within 3 days of receiving customer funds to the designated admin payout account below.
            </p>
          </div>
          <button
            onClick={() => {
              const unpaidOrders = merchantVerifiedOrders.filter(o => o.commissionStatus !== 'paid');
              if (unpaidOrders.length === 0) {
                alert('All verified orders have already had their 10% commission remitted to admin.');
                return;
              }
              const txRef = prompt(`Enter Transaction Reference / Receipt Number for payment to Admin (${adminPM?.name} - ${adminPM?.accountNumber}):`, `TX-${Math.floor(100000 + Math.random() * 900000)}`);
              if (txRef) {
                unpaidOrders.forEach(ord => payOrderCommission(ord.id, txRef));
                alert(`Successfully remitted 10% commission for ${unpaidOrders.length} order(s) to admin via ${adminPM?.name}. Supervision ledger updated!`);
              }
            }}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center gap-2 flex-shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" /> Remit 10% Commission to Admin
          </button>
        </div>

        {/* Admin Selected Commission Payment Method Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Admin-Selected Commission Payment Method:</div>
            <div className="text-white font-extrabold text-sm">{adminPM?.name || 'Telebirr'} ({adminPM?.type?.replace('_', ' ')})</div>
            <div className="text-slate-400">{adminPM?.instructions}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-right space-y-0.5 flex-shrink-0">
            <div className="text-slate-400">Account Name: <strong className="text-white">{adminPM?.accountName}</strong></div>
            <div className="text-slate-400">Account / Phone: <strong className="text-amber-400 font-mono text-sm">{adminPM?.accountNumber}</strong></div>
          </div>
        </div>
      </div>

      {/* STORE PAYMENT METHODS CONFIGURATION */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Settings className="w-4 h-4" /> Vendor Financial Controls
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Store Payment Methods & Account Setup</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Toggle on/off your preferred payment gateways from the admin-enabled list, and provide your exact account number or mobile phone number for direct buyer remittances.
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-mono font-bold rounded-full border border-amber-500/30 flex-shrink-0">
            {paymentMethods.filter(p => p.enabled).length} Admin Enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.filter(p => p.enabled).map(pm => {
            const accData = accountInputs[pm.id] || { accountNumber: merchant.paymentAccounts?.[pm.id]?.accountNumber || '', accountName: merchant.paymentAccounts?.[pm.id]?.accountName || merchant.ownerName, enabled: true };
            const isEnabled = accData.enabled;

            return (
              <div 
                key={pm.id} 
                className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
                  isEnabled 
                    ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/5' 
                    : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${pm.logoBg}`}></div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm sm:text-base">{pm.name}</h3>
                      <span className="text-[10px] text-amber-400 font-mono uppercase">{pm.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleMerchantPm(pm.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isEnabled 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isEnabled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Active (ON)
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-slate-400" /> Disabled (OFF)
                      </>
                    )}
                  </button>
                </div>

                {isEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 animate-fadeIn">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        value={accData.accountName}
                        onChange={e => handleAccountFieldChange(pm.id, 'accountName', e.target.value)}
                        placeholder="Store Name"
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Account / Phone Number</label>
                      <input
                        type="text"
                        value={accData.accountNumber}
                        onChange={e => handleAccountFieldChange(pm.id, 'accountNumber', e.target.value)}
                        placeholder={pm.type === 'mobile_money' ? '+251 91 000 0000' : '1000...'}
                        className="w-full bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Store Inventory</span>
            <Package className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-white">{merchantProducts.length} Items Listed</div>
          <p className="text-xs text-emerald-400 mt-1">Live in marketplace catalog</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Incoming Store Orders</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-white">{merchantOrders.length} Orders</div>
          <p className="text-xs text-amber-400 mt-1">Merchant receipt verification required</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Store Rating</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-400">★ {merchant.rating} / 5.0</div>
          <p className="text-xs text-slate-400 mt-1">Verified local merchant</p>
        </div>
      </div>

      {/* Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Inventory CRUD */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" /> Inventory & Granular Payment Settings
            </h2>
            <span className="text-xs text-slate-400 font-mono">Full CRUD Enabled</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {merchantProducts.map(prod => (
              <div key={prod.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{prod.name}</h3>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-2 mt-1">
                      <span className="text-amber-400 font-mono">Part #{prod.partNumber}</span>
                      <span>•</span>
                      <span>{prod.category}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Stock: {prod.stock}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Payment methods enabled for this item: <strong className="text-white">{prod.enabledPaymentMethods.length} gateways</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-white">ETB {prod.price.toLocaleString()}</div>
                    <span className="text-xs text-slate-400">{prod.condition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition border border-slate-700"
                      title="Edit Product & Payment Toggles"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id);
                      }}
                      className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition border border-red-500/30"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Processing & Merchant Receipt Verification */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" /> Order Processing & Verification
            </h2>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">{merchantOrders.length}</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {merchantOrders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No incoming orders for this store yet.</p>
            ) : (
              merchantOrders.map(order => (
                <div key={order.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold">{order.id}</span>
                      <h4 className="font-bold text-white text-xs">{order.buyerName}</h4>
                      <p className="text-[11px] text-slate-400">{order.shippingAddress}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                    {order.items.filter(i => i.merchantId === merchant.id).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{item.quantity}x {item.productName}</span>
                        <span className="font-bold">ETB {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-800 pt-1 mt-1 flex justify-between text-amber-400 font-bold">
                      <span>10% Commission Owed to Admin:</span>
                      <span>ETB {order.commission.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => setSelectedReceipt({
                        orderId: order.id,
                        imageUrl: order.receiptImage || '',
                        buyerName: order.buyerName,
                        totalAmount: order.totalAmount,
                        paymentMethod: order.selectedPaymentMethodName
                      })}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 transition"
                    >
                      View Buyer Payment Receipt
                    </button>

                    {order.paymentStatus === 'pending_verification' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => verifyOrderReceipt(order.id, 'verified')}
                          className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow"
                        >
                          Verify Payment
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:', 'Invalid receipt screenshot.');
                            if (reason !== null) verifyOrderReceipt(order.id, 'rejected', reason);
                          }}
                          className="py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition shadow"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">Fulfillment:</span>
                      <select
                        value={order.fulfillmentStatus}
                        onChange={(e) => updateFulfillmentStatus(order.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-bold"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                {editingProduct ? 'Edit Auto Part & Payment Settings' : 'List New Auto Part'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Part Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Toyota Hilux Shock Absorber"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Part Number / OEM Code</label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={e => setPartNumber(e.target.value)}
                    placeholder="e.g. TOY-48510-0K430"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Price (ETB)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Original Used">Original Used (Jap)</option>
                    <option value="OEM Replacement">OEM Replacement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Compatibility (comma separated)</label>
                <input
                  type="text"
                  value={compatibility}
                  onChange={e => setCompatibility(e.target.value)}
                  placeholder="e.g. Toyota Vitz 2012-2018, Toyota Yaris"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  placeholder="Detailed part specifications..."
                  required
                />
              </div>

              {/* Granular Payment Settings per Product */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-500" /> Granular Payment Gateway Toggles (Admin Enabled)
                    </h4>
                    <p className="text-xs text-slate-400">Select which of the admin-enabled payment methods are accepted for this specific part ad.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {paymentMethods.filter(p => p.enabled).map(pm => {
                    const isSelected = selectedPaymentMethods.includes(pm.id);
                    return (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPaymentMethods(selectedPaymentMethods.filter(id => id !== pm.id));
                          } else {
                            setSelectedPaymentMethods([...selectedPaymentMethods, pm.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected ? 'bg-amber-500/10 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate">{pm.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
                >
                  {editingProduct ? 'Update Part' : 'Publish Part'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL VIEWER */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-amber-400">{selectedReceipt.orderId}</span>
                <h3 className="text-lg font-bold text-white">Buyer Receipt Verification</h3>
              </div>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div><span className="text-slate-400">Buyer:</span> <strong className="text-white">{selectedReceipt.buyerName}</strong></div>
              <div><span className="text-slate-400">Payment Gateway:</span> <strong className="text-amber-400">{selectedReceipt.paymentMethod}</strong></div>
              <div><span className="text-slate-400">Total Amount:</span> <strong className="text-emerald-400">ETB {selectedReceipt.totalAmount.toLocaleString()}</strong></div>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-black flex items-center justify-center h-72">
              <img src={selectedReceipt.imageUrl} alt="Receipt Screenshot" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  verifyOrderReceipt(selectedReceipt.orderId, 'verified');
                  setSelectedReceipt(null);
                }}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Verify Payment
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason:', 'Invalid receipt screenshot.');
                  if (reason !== null) {
                    verifyOrderReceipt(selectedReceipt.orderId, 'rejected', reason);
                    setSelectedReceipt(null);
                  }
                }}
                className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Reject Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
