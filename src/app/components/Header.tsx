import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, ShoppingBag } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showBell?: boolean;
  right?: ReactNode;
  transparent?: boolean;
}

export function Header({ title, showBack = false, showCart = false, showBell = false, right, transparent = false }: HeaderProps) {
  const navigate = useNavigate();
  const { cartCount, state } = useApp();

  return (
    <div
      className={`flex items-center px-5 py-3 pt-14 ${transparent ? 'bg-transparent' : 'bg-[#FFF4DC]'}`}
      style={transparent ? {} : { borderBottom: '1px solid rgba(185,78,47,0.08)' }}
    >
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-3 w-9 h-9 rounded-xl bg-[#FFFFFF] flex items-center justify-center active:opacity-70"
        >
          <ArrowLeft size={20} className="text-[#4E342E]" />
        </button>
      )}
      {title && (
        <h1
          className="flex-1 text-[#4E342E] font-bold"
          style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px' }}
        >
          {title}
        </h1>
      )}
      {!title && <div className="flex-1" />}
      <div className="flex items-center gap-2">
        {showBell && (
          <button
            onClick={() => {}}
            className="w-9 h-9 rounded-xl bg-[#FFFFFF] flex items-center justify-center relative active:opacity-70"
          >
            <Bell size={18} className="text-[#4E342E]" />
            {state.notifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B94E2F]" />
            )}
          </button>
        )}
        {showCart && (
          <button
            onClick={() => navigate('/cart')}
            className="w-9 h-9 rounded-xl bg-[#FFFFFF] flex items-center justify-center relative active:opacity-70"
          >
            <ShoppingBag size={18} className="text-[#4E342E]" />
            {cartCount > 0 && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#B94E2F] text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        )}
        {right}
      </div>
    </div>
  );
}