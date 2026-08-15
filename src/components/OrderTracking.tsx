'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Package, Clock, CheckCircle2, XCircle, Truck, Search } from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const { orders, currentUser } = useApp();

  // If buyer view, show their orders, else show all orders
  const myOrders = currentUser.role === 'buyer' 
    ? orders.filter(o => o.buyerId === currentUser.id || o.buyerName === currentUser.name || true) // Show recent orders for review
    : orders;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white">Order Tracking & Receipt Verification Status</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time tracking of payment verification and fulfillment dispatch across Ethiopian transport hubs.</p>
      </div>

      <div className="space-y-6">
        {myOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-white font-bold text-lg">No orders found</h3>
            <p className="text-xs text-slate-400">Place an order from the parts catalog to track verification and fulfillment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myOrders.map(order => (
              <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-amber-400 font-bold text-lg">{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        order.paymentStatus === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        Payment: {order.paymentStatus.replace('_', ' ')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Fulfillment: {order.fulfillmentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()} • Shipping to: {order.shippingAddress}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Amount</span>
                    <div className="text-xl font-extrabold text-white">ETB {order.totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400">Order Items ({order.items.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                        <div>
                          <h5 className="font-bold text-white text-xs line-clamp-1">{item.productName}</h5>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-amber-400 font-mono">Part #{item.partNumber}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Receipt Verification Info */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-300">
                      Payment Method Used: <strong className="text-amber-400">{order.selectedPaymentMethodName}</strong>
                    </div>
                    {order.paymentStatus === 'pending_verification' && (
                      <p className="text-xs text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Your receipt is in the admin verification queue. Usually verified within 15 minutes.
                      </p>
                    )}
                    {order.paymentStatus === 'verified' && (
                      <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Payment verified! Merchant is preparing your auto parts for dispatch.
                      </p>
                    )}
                    {order.paymentStatus === 'rejected' && (
                      <p className="text-xs text-red-400 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Receipt rejected: {order.rejectionReason || 'Please re-upload a valid transaction slip.'}
                      </p>
                    )}
                  </div>

                  {order.receiptImage && (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-800 bg-black">
                        <img src={order.receiptImage} alt="Receipt" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Receipt Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
