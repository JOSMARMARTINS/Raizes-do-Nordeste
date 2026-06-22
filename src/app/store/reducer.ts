import { AppState, AppAction, CartItem } from './types';
import { getLoyaltyTier } from './loyalty';

function cartItemKey(item: CartItem): string {
  return `${item.product.id}-${JSON.stringify(item.selectedOptions)}-${item.selectedExtras.sort().join(',')}`;
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        isGuest: false,
        user: action.payload,
        loyaltyDiscount: getLoyaltyTier(action.payload.points).discountPct,
      };
    case 'LOGIN_GUEST':
      return { ...state, isAuthenticated: false, isGuest: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, isGuest: false, user: null, cart: [], selectedStore: null, orderChannel: null };
    case 'ADD_TO_CART': {
      const key = cartItemKey(action.payload);
      const existing = state.cart.findIndex(i => cartItemKey(i) === key);
      if (existing >= 0) {
        const updated = [...state.cart];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + action.payload.quantity,
          totalPrice: updated[existing].totalPrice + action.payload.totalPrice,
        };
        return { ...state, cart: updated };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.product.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter(i => i.product.id !== action.payload.productId) };
      }
      return {
        ...state,
        cart: state.cart.map(i =>
          i.product.id === action.payload.productId
            ? { ...i, quantity: action.payload.quantity, totalPrice: (i.totalPrice / i.quantity) * action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], appliedCoupon: null, couponDiscount: 0 };
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload.code, couponDiscount: action.payload.discount };
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: null, couponDiscount: 0 };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
        ),
      };
    case 'UPDATE_PAYMENT_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId
            ? { ...o, paymentStatus: action.payload.status, paymentGatewayRef: action.payload.ref }
            : o
        ),
      };
    case 'ADD_POINTS': {
      if (!state.user) return state;
      const newPoints = state.user.points + action.payload;
      return {
        ...state,
        user: { ...state.user, points: newPoints },
        loyaltyDiscount: getLoyaltyTier(newPoints).discountPct,
      };
    }
    case 'REDEEM_POINTS':
      return state.user
        ? { ...state, user: { ...state.user, points: Math.max(0, state.user.points - action.payload) } }
        : state;
    case 'SET_STORE':
      return { ...state, selectedStore: action.payload };
    case 'SET_CHANNEL':
      return { ...state, orderChannel: action.payload };
    case 'SET_LOYALTY_DISCOUNT':
      return { ...state, loyaltyDiscount: action.payload };
    case 'UPDATE_LGPD':
      return state.user
        ? {
          ...state,
          user: {
            ...state.user,
            lgpdConsent: action.payload.lgpdConsent,
            marketingConsent: action.payload.marketingConsent,
            lgpdConsentDate: new Date().toISOString().split('T')[0],
          },
        }
        : state;
    case 'UPDATE_PROFILE':
      return state.user
        ? { ...state, user: { ...state.user, ...action.payload } }
        : state;
    default:
      return state;
  }
}

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  cart: [],
  orders: [],
  notifications: 3,
  appliedCoupon: null,
  couponDiscount: 0,
  selectedStore: null,
  orderChannel: null,
  loyaltyDiscount: 0,
};
