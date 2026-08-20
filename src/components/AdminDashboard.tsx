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
    updateMerchantStatus, 
    addCategory, 
    deleteProduct,
    adminCommissionPaymentMethodId,
    setAdminCommissionPaymentMethodId,
    updatePaymentMethodConfig,
    platformCommissionRate,
    setPlatformCommissionRate
  } = useApp();

  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'payments' | 'supervision' | 'merchants' | 'catalog'>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<{ orderId: string; imageUrl: string; buyerName: string; totalAmount: number; paymentMethod: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [pmEdits, setPmEdits] = useState<Record<string, { name: string; accountNumber: string; accountName: string }>>({});
  const [commissionRateInput, setCommissionRateInput] = useState(platformCommissionRate);

  const selectedAdminPM = paymentMethods.find(p => p.id === adminCommissionPaymentMethodId);

  const [adminAccNameInput, setAdminAccNameInput] = useState(selectedAdminPM?.accountName || 'EthioParts Admin');
  const [adminAccNumberInput, setAdminAccNumberInput] = useState(selectedAdminPM?.accountNumber || '+251 91 100 2030');

  // Sync inputs when selected gateway changes
  React.useEffect(() => {
    if (selectedAdminPM) {
      setAdminAccNameInput(selectedAdminPM.accountName);
      setAdminAccNumberInput(selectedAdminPM.accountNumber);
    }
  }, [adminCommissionPaymentMethodId]);

  React.useEffect(() => {
    setCommissionRateInput(platformCommissionRate);
  }, [platformCommissionRate]);

  // Statistics calculation
  const totalOrdersValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommission = orders.filter(o => o.paymentStatus === 'verified').reduce((sum, o) => sum + o.commission, 0);
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Admin Control Center (Supervisor Role)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Platform Supervision & Commission Management</h1>
          <p className="text-slate-400 text-sm mt-1">Supervise all merchant transactions, manage global payment methods, and designate commission payout accounts.</p>
        </div>
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-medium flex-wrap gap-1">
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
            onClick={() => setAdminSubTab('supervision')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${adminSubTab === 'supervision' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            <Clock className="w-3.5 h-3.5" /> Supervision ({orders.length})
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
              <p className="text-xs text-slate-400 mt-1">Due within 3 days max from merchants</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-sm font-medium">Total Platform Orders</span>
                <Package className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-white">{orders.length} Orders</div>
              <p className="text-xs text-amber-400 mt-1">Verified by store merchants</p>
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

          {/* Platform Commission Rate Setting */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Platform Commission Rate (%)
            </h3>
            <p className="text-xs text-slate-400">
              Enter the commission percentage charged on all marketplace orders (e.g. 10 for 10%, 5 for 5%).
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="w-full sm:w-48">
                <label className="block text-xs font-medium text-slate-300 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={commissionRateInput}
                  onChange={e => setCommissionRateInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-bold text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setPlatformCommissionRate(commissionRateInput);
                  alert(`Platform commission rate updated to ${commissionRateInput}% successfully!`);
                }}
                className="w-full sm:w-auto mt-0 sm:mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
              >
                Save Commission Rate
              </button>
            </div>
          </div>

          {/* Admin Commission Payment Account Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" /> Admin Commission Payout Account (Designated for Merchants)
            </h3>
            <p className="text-xs text-slate-400">
              Select which payment gateway merchants must use to remit the 10% platform commission within 3 days of receiving customer funds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-950 p-5 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Commission Gateway</label>
                <select
                  value={adminCommissionPaymentMethodId}
                  onChange={e => setAdminCommissionPaymentMethodId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 font-bold"
                >
                  {paymentMethods.filter(p => p.enabled).map(pm => (
                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={adminAccNameInput}
                  onChange={e => setAdminAccNameInput(e.target.value)}
                  placeholder="EthioParts Admin"
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Number / Mobile Phone</label>
                <input
                  type="text"
                  value={adminAccNumberInput}
                  onChange={e => setAdminAccNumberInput(e.target.value)}
                  placeholder="+251 91 100 2030"
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  updatePaymentMethodConfig(adminCommissionPaymentMethodId, selectedAdminPM?.name || 'Telebirr', adminAccNumberInput, adminAccNameInput);
                  alert(`Admin commission payout account details saved successfully for ${selectedAdminPM?.name}!`);
                }}
                className="py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
              >
                Save Admin Details
              </button>
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
              Enable or disable each of the top 10 payment methods globally. Merchants can select a subset of these for their specific product ads.
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

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-3">
                    <div className="font-bold text-amber-400 uppercase font-mono text-[11px]">Gateway Configuration</div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Method Name</label>
                        <input
                          type="text"
                          value={pmEdits[pm.id]?.name !== undefined ? pmEdits[pm.id].name : pm.name}
                          onChange={e => setPmEdits(prev => ({ ...prev, [pm.id]: { name: e.target.value, accountNumber: pmEdits[pm.id]?.accountNumber !== undefined ? pmEdits[pm.id].accountNumber : pm.accountNumber, accountName: pmEdits[pm.id]?.accountName !== undefined ? pmEdits[pm.id].accountName : pm.accountName } }))}
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Account Name</label>
                          <input
                            type="text"
                            value={pmEdits[pm.id]?.accountName !== undefined ? pmEdits[pm.id].accountName : pm.accountName}
                            onChange={e => setPmEdits(prev => ({ ...prev, [pm.id]: { name: pmEdits[pm.id]?.name !== undefined ? pmEdits[pm.id].name : pm.name, accountNumber: pmEdits[pm.id]?.accountNumber !== undefined ? pmEdits[pm.id].accountNumber : pm.accountNumber, accountName: e.target.value } }))}
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">{pm.type === 'mobile_money' ? 'Mobile Phone #' : 'Bank Account #'}</label>
                          <input
                            type="text"
                            value={pmEdits[pm.id]?.accountNumber !== undefined ? pmEdits[pm.id].accountNumber : pm.accountNumber}
                            onChange={e => setPmEdits(prev => ({ ...prev, [pm.id]: { name: pmEdits[pm.id]?.name !== undefined ? pmEdits[pm.id].name : pm.name, accountNumber: e.target.value, accountName: pmEdits[pm.id]?.accountName !== undefined ? pmEdits[pm.id].accountName : pm.accountName } }))}
                            className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-mono rounded-lg px-3 py-2 text-xs font-bold"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const ed = pmEdits[pm.id];
                          const name = ed?.name !== undefined ? ed.name : pm.name;
                          const num = ed?.accountNumber !== undefined ? ed.accountNumber : pm.accountNumber;
                          const accName = ed?.accountName !== undefined ? ed.accountName : pm.accountName;
                          updatePaymentMethodConfig(pm.id, name, num, accName);
                          alert(`Updated ${name} gateway successfully!`);
                        }}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition"
                      >
                        Save Gateway Settings
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{pm.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUPERVISION & TRANSACTIONS LEDGER (Read-only for Admin) */}
      {adminSubTab === 'supervision' && (
        <div className="space-y-6">
          {selectedReceipt && (
            <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold">{selectedReceipt.orderId}</span>
                  <h3 className="text-lg font-extrabold text-white">Supervision Receipt Inspector (Inline View)</h3>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition"
                >
                  Close Inspector
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div><span className="text-slate-400">Buyer:</span> <strong className="text-white text-sm">{selectedReceipt.buyerName}</strong></div>
                  <div><span className="text-slate-400">Payment Gateway:</span> <strong className="text-amber-400">{selectedReceipt.paymentMethod}</strong></div>
                  <div><span className="text-slate-400">Total Amount:</span> <strong className="text-emerald-400 text-sm">ETB {selectedReceipt.totalAmount.toLocaleString()}</strong></div>
                  <p className="text-slate-400 pt-2 leading-relaxed">Admin oversight mode: Showing verified transaction slip uploaded by customer.</p>
                </div>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-black flex items-center justify-center h-64">
                  <img src={selectedReceipt.imageUrl} alt="Receipt Screenshot" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-white">Platform Transactions & Supervision Ledger</h2>
            <p className="text-slate-400 text-sm">
              As Admin, you supervise all marketplace transactions. Payment verification is handled directly by each store merchant.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Total (ETB)</th>
                    <th className="p-3">10% Commission</th>
                    <th className="p-3">Commission Status</th>
                    <th className="p-3">Payment Gateway</th>
                    <th className="p-3">Merchant Payment Status</th>
                    <th className="p-3">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-850/50">
                      <td className="p-3 font-mono font-medium text-amber-400">{order.id}</td>
                      <td className="p-3">{order.buyerName}</td>
                      <td className="p-3 font-semibold">ETB {order.totalAmount.toLocaleString()}</td>
                      <td className="p-3 text-amber-400 font-bold">
                        ETB {order.commission.toLocaleString()}
                      </td>
                      <td className="p-3 text-xs">
                        {order.paymentStatus !== 'verified' ? (
                          <span className="text-slate-500 italic">Owed after verification</span>
                        ) : order.commissionStatus === 'paid' ? (
                          <span className="text-emerald-400 font-bold flex flex-col">
                            <span>Paid (remitted)</span>
                            <span className="text-[10px] font-mono text-slate-400">Ref: {order.commissionTxRef}</span>
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold flex flex-col">
                            <span>Pending (3 days max)</span>
                            <span className="text-[10px] text-slate-400">Due soon</span>
                          </span>
                        )}
                      </td>
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
                          Inspect Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

    </div>
  );
};
