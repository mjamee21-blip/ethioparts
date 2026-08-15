'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, CreditCard, Users, Store, Package, CheckCircle2, XCircle, Clock, AlertCircle, Plus, Search, DollarSign, TrendingUp, Check, X } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    paymentMethods, 
    togglePaymentMethod, 
    merchants, 
    users, 
    orders, 
    products, 
    categories, 
    verifyOrderReceipt, 
    updateMerchantStatus, 
    addCategory, 
    deleteProduct 
  } = useApp();

  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'payments' | 'verification' | 'merchants' | 'catalog'>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<{ orderId: string; imageUrl: string; buyerName: string; totalAmount: number; paymentMethod: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Statistics calculation
  const totalOrdersValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommission = orders.filter(o => o.paymentStatus === 'verified').reduce((sum, o) => sum + o.commission, 0);
  const pendingQueue = orders.filter(o => o.paymentStatus === 'pending_verification');
  const activeMerchantsCount = merchants.filter(m => m.status === 'active').length;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory({
      name: newCategoryName,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      description: newCategoryDesc || 'Auto parts category',
      iconName: 'Cog'
    });
    setNewCategoryName('');
    setNewCategoryDesc('');
    alert('New category added successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Admin Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Platform Administration</h1>
          <p className="text-slate-400 text-sm mt-1">Manage Ethiopian payment gateways, merchants, verification queues, and commissions.</p>
        </div>
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setAdminSubTab('overview')}
            className={`px-3 py-2 rounded-lg transition ${adminSubTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setAdminSubTab('payments')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${adminSubTab === 'payments' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payments (10)
          </button>
          <button
            onClick={() => setAdminSubTab('verification')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${adminSubTab === 'verification' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            <Clock className="w-3.5 h-3.5" /> Receipts ({pendingQueue.length})
          </button>
          <button
            onClick={() => setAdminSubTab('merchants')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${adminSubTab === 'merchants' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            <Store className="w-3.5 h-3.5" /> Merchants ({merchants.length})
          </button>
          <button
            onClick={() => setAdminSubTab('catalog')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${adminSubTab === 'catalog' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            <Package className="w-3.5 h-3.5" /> Catalog
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {adminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">Total Gross GMV</span>
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-white">ETB {totalOrdersValue.toLocaleString()}</div>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this month
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">10% Platform Commission</span>
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-400">ETB {totalCommission.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Calculated on verified orders</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">Receipt Verification Queue</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-white">{pendingQueue.length} Orders</div>
              <p className="text-xs text-amber-400 mt-1">Pending manual review</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">Active Merchants</span>
                <Store className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-white">{activeMerchantsCount} / {merchants.length}</div>
              <p className="text-xs text-emerald-400 mt-1">Merkato & Bole hubs</p>
            </div>
          </div>

          {/* Recent Orders & Verification Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" /> Recent Platform Orders & Receipts
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Buyer</th>
                      <th className="p-3">Amount (ETB)</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-850/50">
                        <td className="p-3 font-mono font-medium text-amber-400">{order.id}</td>
                        <td className="p-3">{order.buyerName}</td>
                        <td className="p-3 font-semibold">ETB {order.totalAmount.toLocaleString()}</td>
                        <td className="p-3 text-xs text-slate-300">{order.selectedPaymentMethodName}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            order.paymentStatus === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {order.paymentStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedReceipt({
                              orderId: order.id,
                              imageUrl: order.receiptImage || '',
                              buyerName: order.buyerName,
                              totalAmount: order.totalAmount,
                              paymentMethod: order.selectedPaymentMethodName
                            })}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-medium border border-slate-700 transition"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Payment Toggles Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" /> Top 10 Payment Gateways
              </h3>
              <p className="text-xs text-slate-400">Global toggle switches control availability across all merchants and buyer checkouts.</p>
              
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {paymentMethods.map(pm => (
                  <div key={pm.id} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${pm.enabled ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-slate-600'}`}></div>
                      <div>
                        <div className="text-xs font-bold text-white">{pm.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{pm.code}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePaymentMethod(pm.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        pm.enabled ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {pm.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENTS TAB (Top 10 Ethiopian Payment Methods) */}
      {adminSubTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">Global Offline & Mobile Payment Gateway Configuration</h2>
            <p className="text-slate-400 text-sm mb-6">
              Ethiopia features distinct financial channels. Enable or disable each of the top 10 payment methods globally. Merchants can select a subset of these for their specific product ads.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(pm => (
                <div key={pm.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${pm.logoBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {pm.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{pm.name}</h3>
                        <span className="text-xs text-amber-400 font-mono">{pm.code}</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pm.enabled} 
                        onChange={() => togglePaymentMethod(pm.id)} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400"><span className="text-slate-300 font-medium">Account Name:</span> {pm.accountName}</div>
                    <div className="text-slate-400"><span className="text-slate-300 font-medium">Number / ID:</span> {pm.accountNumber}</div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{pm.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT VERIFICATION QUEUE TAB */}
      {adminSubTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">Receipt Verification Queue</h2>
            <p className="text-slate-400 text-sm mb-6">Review uploaded bank deposit slips and Telebirr/CBE-Birr SMS screenshots submitted by buyers.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold">{order.id}</span>
                      <h3 className="font-bold text-white">{order.buyerName}</h3>
                      <p className="text-xs text-slate-400">{order.buyerPhone}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      order.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      order.paymentStatus === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {order.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400"><span className="text-slate-300 font-medium">Payment Method:</span> {order.selectedPaymentMethodName}</div>
                    <div className="text-slate-400"><span className="text-slate-300 font-medium">Total Amount:</span> <strong className="text-white">ETB {order.totalAmount.toLocaleString()}</strong></div>
                    <div className="text-slate-400"><span className="text-slate-300 font-medium">10% Commission:</span> <strong className="text-amber-400">ETB {order.commission.toLocaleString()}</strong></div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedReceipt({
                        orderId: order.id,
                        imageUrl: order.receiptImage || '',
                        buyerName: order.buyerName,
                        totalAmount: order.totalAmount,
                        paymentMethod: order.selectedPaymentMethodName
                      })}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" /> View Receipt Screenshot
                    </button>

                    {order.paymentStatus === 'pending_verification' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => verifyOrderReceipt(order.id, 'verified')}
                          className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason for buyer:', 'Receipt image unclear or reference number mismatch.');
                            if (reason !== null) verifyOrderReceipt(order.id, 'rejected', reason);
                          }}
                          className="py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-md shadow-red-600/20"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MERCHANTS TAB */}
      {adminSubTab === 'merchants' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">Merchant Oversight & Approvals</h2>
            <p className="text-slate-400 text-sm mb-6">Manage auto parts store owners across Merkato, Bole, and regional cities.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Store Name</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">City / Hub</th>
                    <th className="p-3">Products</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {merchants.map(mch => (
                    <tr key={mch.id} className="hover:bg-slate-850/50">
                      <td className="p-3 font-bold text-white">{mch.name}</td>
                      <td className="p-3 text-slate-300">{mch.ownerName} ({mch.phone})</td>
                      <td className="p-3 text-slate-300">{mch.city}</td>
                      <td className="p-3 font-mono">{mch.totalProducts}</td>
                      <td className="p-3 text-amber-400 font-bold">★ {mch.rating}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          mch.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          mch.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {mch.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {mch.status === 'active' ? (
                          <button
                            onClick={() => updateMerchantStatus(mch.id, 'suspended')}
                            className="px-3 py-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-xs font-medium border border-red-500/30 transition"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => updateMerchantStatus(mch.id, 'active')}
                            className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-medium border border-emerald-500/30 transition"
                          >
                            Approve / Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CATALOG & CATEGORY MANAGEMENT TAB */}
      {adminSubTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" /> Add New Category
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Exhaust Systems"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    value={newCategoryDesc}
                    onChange={e => setNewCategoryDesc(e.target.value)}
                    placeholder="Category details..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
                >
                  Create Category
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" /> Platform Products Oversight ({products.length})
              </h3>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {products.map(prod => (
                  <div key={prod.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="text-amber-400 font-mono">{prod.partNumber}</span>
                          <span>•</span>
                          <span>{prod.merchantName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-white text-sm">ETB {prod.price.toLocaleString()}</div>
                        <span className="text-xs text-emerald-400">Stock: {prod.stock}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id);
                        }}
                        className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition border border-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <h3 className="text-lg font-bold text-white">Receipt Verification Screenshot</h3>
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
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" /> Verify Payment
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason:', 'Invalid transaction reference code.');
                  if (reason !== null) {
                    verifyOrderReceipt(selectedReceipt.orderId, 'rejected', reason);
                    setSelectedReceipt(null);
                  }
                }}
                className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
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
