import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela onde o cliente acompanha em tempo real o status do pedido (preparando, a caminho, etc).


const STATUS_STEPS = [
  { key: 'recebido', label: 'Pedido Recebido', sub: 'Seu pedido foi confirmado', icon: '📋', color: 'var(--color-primary)' },
  { key: 'preparando', label: 'Preparando', sub: 'A cozinha está preparando', icon: '👨‍🍳', color: 'var(--color-accent)' },
  { key: 'saiu', label: 'Saiu para Entrega', sub: 'O entregador está a caminho', icon: '🛵', color: '#2980B9' },
  { key: 'entregue', label: 'Entregue!', sub: 'Bom apetite! 😋', icon: '🏠', color: '#2E7D32' },
];

export function TelaAcompanhamentoPedido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  const orderId = (location.state as any)?.orderId;
  const order = state.orders.find(o => o.id === orderId) || state.orders[0];

  const currentIndex = STATUS_STEPS.findIndex(s => s.key === order?.status) || 0;
  const [timeLeft, setTimeLeft] = useState(order?.estimatedTime || 35);

  useEffect(() => {
    if (timeLeft <= 0 || !order) return;
    const t = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 60000);
    return () => clearInterval(t);
  }, [timeLeft, order]);

  // Simula a progressão do status do pedido (como se a cozinha estivesse preparando)
  useEffect(() => {
    if (!order || order.status === 'entregue') return;
    const steps: Array<'preparando' | 'saiu' | 'entregue'> = ['preparando', 'saiu', 'entregue'];
    const nextIndex = currentIndex + 1;
    if (nextIndex < STATUS_STEPS.length) {
      const t = setTimeout(() => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: steps[currentIndex] || 'preparando' } });
      }, 10000);
      return () => clearTimeout(t);
    }
  }, [order?.status, currentIndex]);

  if (!order) {
    return (
      <ScreenWrapper hasBottomNav={false}>
        <Header title="Acompanhar Pedido" showBack />
        <div className="flex flex-col items-center justify-center px-8 pt-20">
          <p className="text-[#795548]">Nenhum pedido encontrado</p>
        </div>
      </ScreenWrapper>
    );
  }

  const currentStep = STATUS_STEPS[currentIndex];

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Acompanhar Pedido" showBack />

      <div className="px-5 pt-4">
        {/* Estadp principal*/}
        <motion.div
          key={order.status}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl mb-5 flex items-center gap-4"
          style={{ background: `${currentStep.color}15`, border: `1px solid ${currentStep.color}30` }}
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '40px' }}
          >
            {currentStep.icon}
          </motion.span>
          <div>
            <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '18px', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {currentStep.label}
            </h2>
            <p className="text-[#795548] text-sm">{currentStep.sub}</p>
          </div>
        </motion.div>

        {/* Número e hora do pedido */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 p-4 rounded-2xl" style={{ background: '#FFFFFF' }}>
            <p className="text-[#795548] text-xs mb-1">Pedido</p>
            <p className="text-[#B94E2F] font-bold font-mono text-sm">#{order.id}</p>
          </div>
          <div className="flex-1 p-4 rounded-2xl" style={{ background: '#FFFFFF' }}>
            <p className="text-[#795548] text-xs mb-1">Tempo estimado</p>
            <p className="text-[#4E342E] font-bold text-sm">⏱ {timeLeft} min</p>
          </div>
        </div>

        {/* linha do tempo */}
        <div className="mb-5 p-4 rounded-2xl" style={{ background: '#FFFFFF' }}>
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '16px' }}>
            Etapas do Pedido
          </h3>
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-5 top-3 bottom-3 w-0.5" style={{ background: 'var(--color-border)' }} />
            <div
              className="absolute left-5 top-3 w-0.5 transition-all duration-1000"
              style={{
                background: 'linear-gradient(to bottom, #B94E2F, #F2B74B)',
                height: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />

            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              return (
                <div key={step.key} className="flex items-start gap-4 mb-5 last:mb-0">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 relative"
                    style={{
                      background: done ? step.color : 'var(--color-border)',
                      border: `2px solid ${done ? step.color : 'var(--color-muted-foreground)'}`,
                    }}
                    animate={active ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span style={{ fontSize: '16px' }}>{step.icon}</span>
                  </motion.div>
                  <div className="pt-1">
                    <p className={`font-semibold text-sm ${done ? 'text-[#4E342E]' : 'text-[#BCAAA4]'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs ${done ? 'text-[#795548]' : 'text-[#BCAAA4]'}`}>{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Espaço reservado para mapa de entrega */}
        <div
          className="mb-5 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ height: '140px', background: 'linear-gradient(135deg, #FFFFFF, #FFF4DC)', border: '1px solid rgba(185,78,47,0.15)' }}
        >
          <div className="flex flex-col items-center gap-3">
            <MapPin size={32} className="text-[#B94E2F]" />
            <p className="text-[#795548] text-xs">Mapa de acompanhamento</p>
          </div>
        </div>

        {/* Enderesso */}
        <div className="mb-5 p-4 rounded-2xl" style={{ background: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-[#B94E2F]" />
            <span className="text-[#4E342E] font-semibold text-sm">Endereço de entrega</span>
          </div>
          <p className="text-[#795548] text-xs">{order.address?.street}, {order.address?.number}</p>
          <p className="text-[#795548] text-xs">{order.address?.neighborhood} — {order.address?.city}, {order.address?.state}</p>
        </div>

        {/* Contato */}
        <div className="flex gap-3 mb-6">
          <button
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
            style={{ background: '#B94E2F20', color: 'var(--color-primary)', border: '1px solid rgba(185,78,47,0.3)' }}
          >
            <Phone size={16} />
            Ligar
          </button>
          <button
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
            style={{ background: '#FFFFFF', color: 'var(--color-muted)', border: '1px solid rgba(185,78,47,0.12)' }}
          >
            <MessageCircle size={16} />
            Mensagem
          </button>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full py-3 rounded-2xl font-semibold text-sm text-[#795548] mb-4"
          style={{ background: '#FFFFFF' }}
        >
          Ir para Início
        </button>
      </div>
    </ScreenWrapper>
  );
}
