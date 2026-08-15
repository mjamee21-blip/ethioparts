'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Filter, Eye, ShoppingCart, Star, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '@/types';

export const BuyerCatalog: React.FC<{ onSelectProduct: (p: Product) => void }> = ({ onSelectProduct }) => {
  const { products, categories, merchants } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMerchant, setSelectedMerchant] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.compatibility.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesMerchant = selectedMerchant === 'All' || p.merchantId === selectedMerchant;
    const matchesCondition = selectedCondition === 'All' || p.condition === selectedCondition;
    const matchesPrice = p.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesMerchant && matchesCondition && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Catalog Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white">Ethiopian Auto Parts Catalog</h1>
        <p className="text-slate-400 text-sm mt-1">Filter by vehicle make, model, category, condition, and merchant hub across Ethiopia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500" /> Advanced Filters
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedMerchant('All');
                setSelectedCondition('All');
                setMaxPrice(20000);
              }}
              className="text-xs text-amber-400 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Search Part or Vehicle</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Hilux, Vitz, Brake pad..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Merchant Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Merchant Store</label>
            <select
              value={selectedMerchant}
              onChange={e => setSelectedMerchant(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Merchants</option>
              {merchants.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.city})</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Part Condition</label>
            <select
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Original Used">Original Used (Jap)</option>
              <option value="OEM Replacement">OEM Replacement</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Max Price</span>
              <span className="text-amber-400 font-bold">ETB {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={30000}
              step={500}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400">Showing <strong className="text-white">{filteredProducts.length}</strong> certified auto parts</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <h3 className="text-lg font-bold text-white">No matching parts found</h3>
              <p className="text-xs text-slate-400">Try adjusting your search filters or make selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
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
                        <span className="truncate max-w-[120px]">{product.merchantName}</span>
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
          )}
        </div>
      </div>
    </div>
  );
};
