import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Package, Star, Settings, FileText, ChevronRight, LogOut, Edit3, User } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela de perfil do cliente, um atalho para ver histórico, dados e configurações.


export function TelaPerfil() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const user = state.user;

  const isStaff = user?.role === 'atendente' || user?.role === 'gerente' || user?.role === 'admin';

  const menuItems = [
    { icon: Package, label: 'Meus Pedidos', sub: `${state.orders.length} pedidos realizados`, path: '/order-tracking', color: 'var(--color-primary)' },
    { icon: User, label: 'Meus Dados', sub: 'Dados cadastrais e endereços', path: '/my-data', color: '#2980B9' },
    ...(!isStaff ? [{ icon: Star, label: 'Programa de Fidelidade', sub: `${user?.points || 0} pontos · ${user?.level}`, path: '/loyalty', color: 'var(--color-accent)' }] : []),
    { icon: Settings, label: 'Configurações', sub: 'Notificações', path: '/settings', color: '#8E44AD' },
    { icon: FileText, label: 'Termos e Privacidade (LGPD)', sub: `Consentimento: ${user?.lgpdConsent ? '✓ Aceito' : 'Pendente'}`, path: '/lgpd', color: '#2E7D32' },
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <ScreenWrapper>
      <Header title="Perfil" showCart />

      <div className="px-5 pt-4">
        {/* Cartão de usuário */}
        <div
          className="p-5 rounded-2xl mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFFFFF, #FFF0D0)' }}
        >
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 opacity-10">
            <span style={{ fontSize: '120px' }}>🌵</span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)' }}
            >
              <span style={{ fontSize: '32px' }}>
                {user?.name.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1">
              <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '18px', fontWeight: 800, color: 'var(--color-foreground)' }}>
                {user?.name || 'Usuário'}
              </h2>
              <p className="text-[#795548] text-xs mb-1">{user?.email}</p>
              {!isStaff && (
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: '12px' }}>🤠</span>
                  <span className="text-[#B94E2F] text-xs font-semibold">{user?.level}</span>
                  <span className="text-[#795548] text-xs">• {user?.points} pts</span>
                </div>
              )}
              {isStaff && (
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: '12px' }}>🏪</span>
                  <span className="text-[#B94E2F] text-xs font-semibold capitalize">{user?.role}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Edit3 size={16} className="text-[#4E342E]" />
            </button>
          </div>
        </div>

        {/* Atalho do painel da equipe*/}
        {state.user?.role && ['admin', 'gerente', 'atendente'].includes(state.user.role) && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(state.user?.role === 'atendente' ? '/atendente' : state.user?.role === 'gerente' ? '/gerente' : '/admin')}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 mb-6"
            style={{
              background: state.user.role === 'admin'
                ? 'linear-gradient(135deg, #C62828, #B94E2F)'
                : 'linear-gradient(135deg, #B94E2F, #C62828)',
              boxShadow: '0 8px 24px rgba(185,78,47,0.35)',
            }}
          >
            <span style={{ fontSize: '20px' }}>
              {state.user.role === 'admin' ? '🏢' : state.user.role === 'gerente' ? '🏪' : '🧑‍💼'}
            </span>
            <span className="text-white font-bold text-base">
              {state.user.role === 'admin' ? 'Painel da Franqueadora' : state.user.role === 'gerente' ? 'Painel do Gerente' : 'Painel do Atendente'}
            </span>
          </motion.button>
        )}

        {/* Estatísticas */}
        <div className={`grid gap-3 mb-6 ${isStaff ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {[
            { label: 'Pedidos', value: state.orders.length.toString(), icon: '📦', staffOnly: false },
            ...(!isStaff ? [
              { label: 'Pontos', value: (user?.points || 0).toLocaleString(), icon: '⭐', staffOnly: false },
              { label: 'Nível', value: user?.level || 'N/A', icon: '🏆', staffOnly: false },
            ] : []),
          ].map(stat => (
            <div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: '#FFFFFF' }}>
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>{stat.icon}</span>
              <p className="text-[#4E342E] font-bold text-sm">{stat.value}</p>
              <p className="text-[#795548] text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 mb-6">
          {menuItems.map(({ icon: Icon, label, sub, path, color }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(path)}
              className="flex items-center gap-3 p-4 rounded-2xl w-full text-left"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.1)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-[#4E342E] font-semibold text-sm">{label}</p>
                <p className="text-[#795548] text-xs">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-[#BCAAA4]" />
            </motion.button>
          ))}
        </div>

        {/* Sair */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 mb-6"
          style={{ background: 'rgba(198,40,40,0.15)', border: '1px solid rgba(198,40,40,0.3)' }}
        >
          <LogOut size={18} className="text-[#C62828]" />
          <span className="text-[#C62828] font-bold">Sair da Conta</span>
        </motion.button>


        <p className="text-center text-[#BCAAA4] text-xs mb-4">
          Raízes do Nordeste v1.0.0 · Todos os direitos reservados
        </p>
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
