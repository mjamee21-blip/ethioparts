'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, ShieldCheck, Truck, Clock, Award, ArrowRight, ChevronRight, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';

export const BuyerHome: React.FC<{ onSelectProduct: (p: Product) => void; onViewCatalog: () => void }> = ({ onSelectProduct, onViewCatalog }) => {
  const { products, categories, addToCart, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');

  const popularMakes = ['All', 'Toyota', 'Hyundai', 'Isuzu', 'Bajaj'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.compatibility.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMake = selectedMake === 'All' || p.name.toLowerCase().includes(selectedMake.toLowerCase()) || p.compatibility.some(c => c.toLowerCase().includes(selectedMake.toLowerCase()));
    return matchesSearch && matchesMake;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 py-16 px-4 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" /> Ethiopia's #1 Certified Auto Parts Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Genuine Auto Parts for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Ethiopian Roads</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-xl">
              Source verified OEM & brand new suspension, brake systems, filters, and engine components for Toyota Vitz, Hilux, Corolla, Hyundai, Bajaj, and Isuzu with seamless Telebirr & CBE payments.
            </p>

            {/* Intelligent Search Bar */}
            <div className="bg-slate-950 p-2 rounded-2xl border border-slate-700 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-3 px-3 flex-grow">
                <Search className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by part name, OEM number, or vehicle (e.g. Hilux 2020)..."
                  className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-500 py-2.5"
                />
              </div>
              <button
                onClick={onViewCatalog}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>Find Parts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Make Quick Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs text-slate-400 font-medium">Popular Makes:</span>
              {popularMakes.map(make => (
                <button
                  key={make}
                  onClick={() => setSelectedMake(make)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedMake === make ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80"
                alt="Ethiopian Auto Parts Marketplace"
                className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">Verified Merkato Hub</span>
                <h3 className="text-white font-extrabold text-xl">Toyota Hilux Revo Suspension Kit</h3>
                <p className="text-slate-300 text-xs mt-1">Directly imported from certified manufacturers with 10% buyer protection guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Trust & Security Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Parts</h4>
              <p className="text-xs text-slate-400 mt-0.5">Verified OEM & original imports</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Ethiopian Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Merkato, Bole & Regional bus dispatch</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Top 10 Local Gateways</h4>
              <p className="text-xs text-slate-400 mt-0.5">Telebirr, CBE, Awash & M-Pesa</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Instant Verification</h4>
              <p className="text-xs text-slate-400 mt-0.5">Automated & admin receipt review</p>
            </div>
          </div>
        </div>

        {/* Curated Categories */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Curated Categories</h2>
              <p className="text-slate-400 text-sm mt-0.5">Browse parts by vehicle system</p>
            </div>
            <button
              onClick={onViewCatalog}
              className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1 transition"
            >
              View All Catalog <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={onViewCatalog}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 text-center cursor-pointer transition group shadow-lg flex flex-col items-center justify-between space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-950 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-500 flex items-center justify-center transition shadow-md">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition">{cat.name}</h3>
                  <span className="text-[11px] text-slate-400">{cat.productCount} parts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured / Trending Auto Parts */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Trending Auto Parts in Ethiopia</h2>
              <p className="text-slate-400 text-sm mt-0.5">Best selling genuine components for Ethiopian roads</p>
            </div>
            <button
              onClick={onViewCatalog}
              className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1 transition"
            >
              Browse All ({filteredProducts.length}) <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, 6).map(product => (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 border border-slate-800">
                      {product.condition}
                    </div>
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                      Stock: {product.stock}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span className="text-amber-400 font-mono">{product.partNumber}</span>
                      <span>{product.merchantName}</span>
                    </div>

                    <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-amber-400 transition">{product.name}</h3>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400 font-medium">Vehicle Compatibility:</div>
                      <div className="text-slate-300 line-clamp-1">{product.compatibility.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Price</span>
                    <div className="text-xl font-extrabold text-white">ETB {product.price.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Eye className="w-4 h-4" /> View Part
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
