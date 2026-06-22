import { useNavigate, useLocation } from 'react-router';
import { Home, Search, ShoppingBag, Star, User } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, state } = useApp();
  const isStaff = state.user?.role === 'atendente' || state.user?.role === 'gerente';

  const tabs = [
    { icon: Home, label: 'Início', path: '/home' },
    { icon: Search, label: 'Buscar', path: '/categories' },
    { icon: ShoppingBag, label: 'Carrinho', path: '/cart', badge: cartCount },
    ...(!isStaff ? [{ icon: Star, label: 'Pontos', path: '/loyalty' }] : []),
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex items-center justify-around pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] px-2 md:max-w-6xl lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px]"
      style={{
        background: 'linear-gradient(to top, #F2E5C0 0%, #FFF4DC 100%)',
        borderTop: '1px solid rgba(185,78,47,0.15)',
      }}
    >
      {tabs.map(({ icon: Icon, label, path, badge }) => {
        const active = location.pathname === path || (path === '/home' && location.pathname === '/');
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 px-3 py-1 relative"
          >
            <div className="relative">
              <Icon
                size={22}
                className={active ? 'text-[#B94E2F]' : 'text-[#795548]'}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {badge && badge > 0 && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#B94E2F] text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${active ? 'text-[#B94E2F]' : 'text-[#795548]'}`}>
              {label}
            </span>
            {active && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B94E2F]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
