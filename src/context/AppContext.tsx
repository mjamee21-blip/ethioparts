'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Merchant, PaymentMethodConfig, Product, Category, Order, UserRole, OrderItem } from '@/types';
import { INITIAL_USERS, INITIAL_MERCHANTS, INITIAL_PAYMENT_METHODS, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/data/mockData';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  merchants: Merchant[];
  paymentMethods: PaymentMethodConfig[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  switchUserRole: (role: UserRole, merchantId?: string) => void;
  togglePaymentMethod: (id: string) => void;
  verifyOrderReceipt: (orderId: string, status: 'verified' | 'rejected', reason?: string) => void;
  updateFulfillmentStatus: (orderId: string, status: Order['fulfillmentStatus']) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => void;
  updateMerchantStatus: (merchantId: string, status: 'active' | 'suspended') => void;
  addMerchant: (merchant: Omit<Merchant, 'id' | 'rating' | 'totalProducts' | 'joinedDate'>) => void;
  updateMerchantPaymentAccount: (merchantId: string, paymentMethodId: string, accountNumber: string, accountName: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (shippingAddress: string, paymentMethodId: string, receiptImage?: string) => Order;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(INITIAL_PAYMENT_METHODS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  // Default to guest visitor (no dashboards shown until login)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'guest',
    name: 'Guest Visitor',
    email: 'guest@ethioparts.et',
    role: 'guest',
    verified: false
  });
  const [activeTab, setActiveTab] = useState<string>('home');

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('ethioparts_products');
      const savedOrders = localStorage.getItem('ethioparts_orders');
      const savedPayments = localStorage.getItem('ethioparts_payments');
      const savedMerchants = localStorage.getItem('ethioparts_merchants');
      const savedUser = localStorage.getItem('ethioparts_current_user');

      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedPayments) setPaymentMethods(JSON.parse(savedPayments));
      if (savedMerchants) setMerchants(JSON.parse(savedMerchants));
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ethioparts_products', JSON.stringify(products));
      localStorage.setItem('ethioparts_orders', JSON.stringify(orders));
      localStorage.setItem('ethioparts_payments', JSON.stringify(paymentMethods));
      localStorage.setItem('ethioparts_merchants', JSON.stringify(merchants));
      localStorage.setItem('ethioparts_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [products, orders, paymentMethods, merchants, currentUser]);

  const switchUserRole = (role: UserRole, merchantId?: string) => {
    const found = users.find(u => u.role === role && (!merchantId || u.merchantId === merchantId));
    if (found) {
      setCurrentUser(found);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: role === 'admin' ? 'System Administrator' : role === 'merchant' ? 'Merchant Store Owner' : 'Valued Buyer',
        email: `${role}@ethioparts.et`,
        role,
        merchantId: merchantId || (role === 'merchant' ? 'mch-1' : undefined),
        phone: '+251 91 000 1122',
        verified: true,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => pm.id === id ? { ...pm, enabled: !pm.enabled } : pm));
  };

  const verifyOrderReceipt = (orderId: string, status: 'verified' | 'rejected', reason?: string) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? {
      ...ord,
      paymentStatus: status,
      fulfillmentStatus: status === 'verified' ? 'processing' : ord.fulfillmentStatus,
      rejectionReason: reason
    } : ord));
  };

  const updateFulfillmentStatus = (orderId: string, status: Order['fulfillmentStatus']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
    setMerchants(prev => prev.map(m => m.id === newProd.merchantId ? { ...m, totalProducts: m.totalProducts + 1 } : m));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (prod) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setMerchants(prev => prev.map(m => m.id === prod.merchantId ? { ...m, totalProducts: Math.max(0, m.totalProducts - 1) } : m));
    }
  };

  const addCategory = (catData: Omit<Category, 'id' | 'productCount'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      productCount: 0
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateMerchantStatus = (merchantId: string, status: 'active' | 'suspended') => {
    setMerchants(prev => prev.map(m => m.id === merchantId ? { ...m, status } : m));
  };

  const addMerchant = (merchantData: Omit<Merchant, 'id' | 'rating' | 'totalProducts' | 'joinedDate'>) => {
    const newMch: Merchant = {
      ...merchantData,
      id: `mch-${Date.now()}`,
      rating: 5.0,
      totalProducts: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setMerchants(prev => [...prev, newMch]);
  };

  const updateMerchantPaymentAccount = (merchantId: string, paymentMethodId: string, accountNumber: string, accountName: string) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === merchantId) {
        const existingAccounts = m.paymentAccounts || {};
        return {
          ...m,
          paymentAccounts: {
            ...existingAccounts,
            [paymentMethodId]: { accountNumber, accountName }
          }
        };
      }
      return m;
    }));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const createOrder = (shippingAddress: string, paymentMethodId: string, receiptImage?: string): Order => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const commission = Math.round(subtotal * 0.10); // 10% platform commission
    const pm = paymentMethods.find(p => p.id === paymentMethodId);

    const items: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      partNumber: item.product.partNumber,
      price: item.product.price,
      quantity: item.quantity,
      merchantId: item.product.merchantId,
      imageUrl: item.product.imageUrl
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone || '+251 91 000 0000',
      shippingAddress,
      items,
      subtotal,
      commission,
      totalAmount: subtotal,
      selectedPaymentMethodId: paymentMethodId,
      selectedPaymentMethodName: pm ? pm.name : paymentMethodId,
      receiptImage: receiptImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      paymentStatus: 'pending_verification',
      fulfillmentStatus: 'processing',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      merchants,
      paymentMethods,
      categories,
      products,
      orders,
      cart,
      activeTab,
      setActiveTab,
      switchUserRole,
      togglePaymentMethod,
      verifyOrderReceipt,
      updateFulfillmentStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateMerchantStatus,
      addMerchant,
      updateMerchantPaymentAccount,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      createOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
