'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Wrench, ShieldCheck, Store, ShoppingCart, UserCheck, Package, LayoutDashboard, Search, Home, Menu, X, LogIn, LogOut } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

export const Header: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const { currentUser, switchUserRole, cart, activeTab, setActiveTab, orders } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const merchantPendingCount = orders.filter(o => 
    currentUser.merchantId && 
    o.items.some(item => item.merchantId === currentUser.merchantId) && 
    o.paymentStatus === 'pending_verification'
  ).length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isGuest = currentUser.role === 'guest';

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-xl">
        {/* Top Bar / Sign In Bar (No role switcher shown to visitors) */}
        <div className="bg-slate-950 px-3 sm:px-4 py-2 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>EthioParts Ethiopia's #1 Certified Auto Parts Marketplace</span>
          </div>

          <div className="flex items-center gap-3">
            {isGuest ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 shadow"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-slate-300">
                  Welcome, <strong className="text-amber-400">{currentUser.name}</strong> ({currentUser.role})
                </span>
                <button
                  onClick={() => switchUserRole('guest' as any)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Ethio<span className="text-amber-500">Parts</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono border border-amber-500/30">ET</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden xs:block">Genuine Auto Parts for Ethiopian Roads</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {currentUser.role === 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'admin' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard (Supervisor)
              </button>
            ) : currentUser.role === 'merchant' ? (
              <button
                onClick={() => setActiveTab('merchant')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  activeTab === 'merchant' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Merchant Dashboard
                {merchantPendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full font-bold animate-bounce">
                    {merchantPendingCount}
                  </span>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === 'home' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Marketplace Home
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === 'catalog' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Parts Catalog & Vehicles
                </button>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === 'tracking' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders & Receipts
                </button>
              </>
            )}
          </nav>

          {/* Right Action / Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {currentUser.role !== 'admin' && currentUser.role !== 'merchant' && (
              <button
                onClick={onOpenCart}
                className="relative px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95 text-xs sm:text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden xs:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-slate-900">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-2 animate-fadeIn">
            {isGuest && (
              <button
                onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 transition flex items-center gap-2.5"
              >
                <LogIn className="w-4 h-4" /> Sign In / Register
              </button>
            )}

            {currentUser.role === 'admin' ? (
              <button
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                  activeTab === 'admin' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5"><LayoutDashboard className="w-4 h-4" /> Admin Dashboard (Supervisor)</span>
              </button>
            ) : currentUser.role === 'merchant' ? (
              <button
                onClick={() => { setActiveTab('merchant'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                  activeTab === 'merchant' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5"><LayoutDashboard className="w-4 h-4" /> Merchant Dashboard</span>
                {merchantPendingCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full font-bold">
                    {merchantPendingCount} pending
                  </span>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2.5 ${
                    activeTab === 'home' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Marketplace Home
                </button>
                <button
                  onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2.5 ${
                    activeTab === 'catalog' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Parts Catalog & Vehicles
                </button>
                <button
                  onClick={() => { setActiveTab('tracking'); setMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2.5 ${
                    activeTab === 'tracking' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders & Receipts
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
