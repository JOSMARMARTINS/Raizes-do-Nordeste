import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, ChevronLeft } from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';
import { OrderChannel } from '../data/stores';

// Tela onde o cliente escolhe se quer comer no local, retirar no balcão ou pedir delivery.


interface ChannelOption {
  id: OrderChannel;
  icon: string;
  label: string;
  sub: string;
  available: (store: ReturnType<typeof useApp>['state']['selectedStore']) => boolean;
  eta: string;
}

const CHANNELS: ChannelOption[] = [
  {
    id: 'delivery',
    icon: '🛵',
    label: 'Delivery',
    sub: 'Receba em casa ou no trabalho',
    available: (s) => !!s?.allowsDelivery,
    eta: '20–45 min',
  },
  {
    id: 'pickup',
    icon: '🛍️',
    label: 'Retirada (Pick-up)',
    sub: 'Retire na loja sem fila',
    available: (s) => !!s?.allowsPickup,
    eta: '10–20 min',
  },
  {
    id: 'dine-in',
    icon: '🍽️',
    label: 'Comer no local',
    sub: 'Peça pelo app e retire no balcão',
    available: (s) => !!s?.allowsDineIn,
    eta: '5–15 min',
  },
];

export function TelaSelecaoCanal() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const store = state.selectedStore;

  const handleSelect = (channel: OrderChannel) => {
    dispatch({ type: 'SET_CHANNEL', payload: channel });
    navigate('/home');
  };

  return (
    <ScreenWrapper scrollable={false} hasBottomNav={false}>
      {/* Cabeçalho */}
      <div
        className="px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(to bottom, #F8EDD5, #FFF4DC)' }}
      >
        <button onClick={() => navigate('/store-selection')} className="flex items-center gap-1.5 mb-4">
          <ChevronLeft size={16} className="text-[#795548]" />
          <span className="text-[#795548] text-sm">Trocar unidade</span>
        </button>

        {store && (
          <div
            className="flex items-center gap-3 p-3 rounded-2xl mb-5"
            style={{ background: 'rgba(185,78,47,0.1)', border: '1px solid rgba(185,78,47,0.2)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#B94E2F20' }}>
              <MapPin size={18} className="text-[#B94E2F]" />
            </div>
            <div>
              <p className="text-[#4E342E] font-bold text-sm">{store.name}</p>
              <p className="text-[#795548] text-xs">{store.neighborhood} — {store.city}/{store.state}</p>
            </div>
          </div>
        )}

        <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '22px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '6px' }}>
          Como deseja receber?
        </h1>
        <p className="text-[#795548] text-sm">Escolha a forma de recebimento do seu pedido</p>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-3">
        {CHANNELS.map((ch, i) => {
          const available = ch.available(store);
          return (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={available ? { scale: 0.97 } : {}}
              onClick={() => available && handleSelect(ch.id)}
              disabled={!available}
              className="flex items-center gap-4 p-5 rounded-2xl text-left w-full"
              style={{
                background: available ? '#FFFFFF' : '#F5EDD0',
                border: `1px solid ${available ? 'rgba(185,78,47,0.25)' : 'rgba(92,61,30,0.2)'}`,
                opacity: available ? 1 : 0.45,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: available ? 'rgba(185,78,47,0.12)' : '#FFFFFF' }}
              >
                <span style={{ fontSize: '32px' }}>{ch.icon}</span>
              </div>
              <div className="flex-1">
                <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: available ? 'var(--color-foreground)' : 'var(--color-muted-foreground)', fontSize: '16px' }}>
                  {ch.label}
                </h3>
                <p className="text-[#795548] text-xs mt-0.5">{ch.sub}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#B94E2F20', color: 'var(--color-primary)' }}>
                    ⏱ {ch.eta}
                  </span>
                  {!available && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(198,40,40,0.15)', color: 'var(--color-secondary)' }}>
                      Indisponível nesta unidade
                    </span>
                  )}
                </div>
              </div>
              {available && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                  <span className="text-white text-sm">→</span>
                </div>
              )}
            </motion.button>
          );
        })}

        {/* Caixa de informações */}
        <div
          className="mt-2 p-4 rounded-2xl"
          style={{ background: 'rgba(242,183,75,0.08)', border: '1px solid rgba(242,183,75,0.15)' }}
        >
          <p className="text-[#F2B74B] text-xs leading-relaxed">
            💡 <strong>Dica:</strong> A retirada é mais rápida e ainda garante os mesmos pontos de fidelidade!
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
}
