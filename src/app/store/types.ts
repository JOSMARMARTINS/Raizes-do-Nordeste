import { Product } from '../data/products';
import { Store, OrderChannel } from '../data/stores';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: Record<string, string>;
  selectedExtras: string[];
  totalPrice: number;
  notes?: string;
}

export type UserRole = 'cliente' | 'atendente' | 'gerente' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  points: number;
  level: string;
  totalSpent: number;
  orderCount: number;
  lgpdConsent: boolean;
  lgpdConsentDate?: string;
  marketingConsent: boolean;
  avatar?: string;
  addresses: Address[];
  segment?: 'frequente' | 'ocasional' | 'novo';
  role: UserRole;
  storeId?: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'recebido' | 'preparando' | 'saiu' | 'entregue' | 'cancelado';
  createdAt: Date;
  estimatedTime: number;
  address?: Address;
  paymentMethod: string;
  paymentStatus: 'pendente' | 'confirmado' | 'negado' | 'cancelado';
  paymentGatewayRef?: string;
  couponApplied?: string;
  discount: number;
  deliveryFee: number;
  pointsEarned: number;
  channel: OrderChannel;
  storeId: string;
  storeName: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  cart: CartItem[];
  orders: Order[];
  notifications: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  selectedStore: Store | null;
  orderChannel: OrderChannel | null;
  loyaltyDiscount: number;
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGIN_GUEST' }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'UPDATE_PAYMENT_STATUS'; payload: { orderId: string; status: Order['paymentStatus']; ref?: string } }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'REDEEM_POINTS'; payload: number }
  | { type: 'SET_STORE'; payload: Store }
  | { type: 'SET_CHANNEL'; payload: OrderChannel }
  | { type: 'SET_LOYALTY_DISCOUNT'; payload: number }
  | { type: 'UPDATE_LGPD'; payload: { lgpdConsent: boolean; marketingConsent: boolean } }
  | { type: 'UPDATE_PROFILE'; payload: { name: string; email: string; phone: string; cpf: string } };
