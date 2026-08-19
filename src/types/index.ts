export type UserRole = 'admin' | 'merchant' | 'buyer' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  merchantId?: string; // If role is merchant
  status?: 'active' | 'pending' | 'suspended';
  phone?: string;
  verified?: boolean;
  joinedDate?: string;
}

export interface Merchant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  totalProducts: number;
  joinedDate: string;
  paymentAccounts?: Record<string, { accountNumber: string; accountName: string }>;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  code: string;
  type: 'mobile_money' | 'bank_transfer';
  accountName: string;
  accountNumber: string; // or phone number
  instructions: string;
  enabled: boolean; // Global admin toggle
  logoBg: string;
}

export interface Product {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  partNumber: string;
  category: string;
  price: number; // in ETB
  stock: number;
  compatibility: string[]; // e.g. ["Toyota Vitz 2018-2022", "Toyota Yaris"]
  condition: 'Brand New' | 'Original Used' | 'OEM Replacement';
  description: string;
  imageUrl: string;
  enabledPaymentMethods: string[]; // Payment method IDs enabled specifically for this product (subset of global enabled)
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  partNumber: string;
  price: number;
  quantity: number;
  merchantId: string;
  imageUrl: string;
}

export interface AdminCommissionAccount {
  paymentMethodId: string;
  accountName: string;
  accountNumber: string; // phone number or bank account number
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  commission: number; // 10%
  totalAmount: number;
  selectedPaymentMethodId: string;
  selectedPaymentMethodName: string;
  receiptImage?: string; // Base64 or URL of uploaded receipt screenshot
  paymentStatus: 'pending_verification' | 'verified' | 'rejected';
  fulfillmentStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  rejectionReason?: string;
  commissionStatus?: 'unpaid' | 'pending_verification' | 'paid' | 'rejected';
  commissionPaidAt?: string;
  commissionTxRef?: string;
  commissionReceiptImage?: string;
}
