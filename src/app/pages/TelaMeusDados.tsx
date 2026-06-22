import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Phone, FileText, MapPin, Pencil, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela onde o cliente pode visualizar e gerenciar todos os dados que temos sobre ele.


export function TelaMeusDados() {
  const navigate = useNavigate();
  const { state } = useApp();
  const user = state.user;

  const fields = [
    { label: 'Nome completo', value: user?.name || '—', icon: User },
    { label: 'E-mail', value: user?.email || '—', icon: Mail },
    { label: 'Telefone', value: user?.phone || '—', icon: Phone },
    { label: 'CPF', value: user?.cpf || '—', icon: FileText },
  ];

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Meus Dados" showBack />

      <div className="px-5 pt-4">
        {/* Avatar + nome */}
        <div
          className="p-5 rounded-2xl mb-6 flex items-center gap-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFFFFF, #FFF0D0)' }}
        >
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 opacity-10">
            <span style={{ fontSize: '100px' }}>🌵</span>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)' }}
          >
            <span style={{ fontSize: '32px' }}>{user?.name?.charAt(0) || '?'}</span>
          </div>
          <div className="flex-1">
            <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '18px', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {user?.name || 'Usuário'}
            </h2>
            {user?.role === 'cliente' && (
              <div className="flex items-center gap-1.5 mt-1">
                <span style={{ fontSize: '12px' }}>🤠</span>
                <span className="text-[#B94E2F] text-xs font-semibold">{user?.level}</span>
                <span className="text-[#795548] text-xs">· {user?.points} pts</span>
              </div>
            )}
            {user?.role !== 'cliente' && (
              <span className="text-[#B94E2F] text-xs font-semibold capitalize">{user?.role}</span>
            )}
          </div>
        </div>

        {/* Campos */}
        <div className="flex flex-col gap-3 mb-6">
          {fields.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="p-4 rounded-2xl"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} className="text-[#B94E2F]" />
                <span className="text-[#BCAAA4] text-[10px] font-semibold uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-[#4E342E] text-sm font-semibold pl-5">{value}</p>
            </div>
          ))}
        </div>

        {/* Endereços */}
        <div className="mb-6">
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '10px' }}>
            Endereços salvos
          </h3>
          {user?.addresses && user.addresses.length > 0 ? (
            <div className="flex flex-col gap-2">
              {user.addresses.map(addr => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl flex items-start gap-3"
                  style={{ background: '#FFFFFF', border: `1px solid ${addr.isDefault ? 'rgba(185,78,47,0.3)' : 'rgba(185,78,47,0.1)'}` }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: addr.isDefault ? '#B94E2F20' : 'var(--color-border)' }}
                  >
                    <MapPin size={16} className={addr.isDefault ? 'text-[#B94E2F]' : 'text-[#795548]'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[#4E342E] font-semibold text-sm">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#B94E2F20', color: 'var(--color-primary)' }}>
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-[#795548] text-xs">{addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ''}</p>
                    <p className="text-[#795548] text-xs">{addr.neighborhood} · {addr.city}, {addr.state}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{ background: '#FFFFFF', border: '1px dashed rgba(185,78,47,0.2)' }}
            >
              <MapPin size={16} className="text-[#BCAAA4]" />
              <p className="text-[#BCAAA4] text-sm">Nenhum endereço cadastrado</p>
            </div>
          )}
        </div>

        {/* Botão editar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/profile/edit')}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-3"
          style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: '0 8px 24px rgba(185,78,47,0.35)' }}
        >
          <Pencil size={18} className="text-white" />
          <span className="text-white font-bold">Editar Dados</span>
          <ChevronRight size={16} className="text-white" />
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}
