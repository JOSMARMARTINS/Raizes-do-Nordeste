import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela de sucesso exibida logo após o cliente finalizar o pagamento do pedido.


export function TelaConfirmacaoPedido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();
  const orderId = (location.state as any)?.orderId;
  const order = state.orders.find(o => o.id === orderId);

  useEffect(() => {
    if (!orderId) navigate('/home');
  }, [orderId, navigate]);

  return (
    <ScreenWrapper scrollable={false} hasBottomNav={false}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        {/* Confete / animação de sucesso */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['var(--color-primary)', 'var(--color-accent)', '#2E7D32', 'var(--color-secondary)', 'var(--color-foreground)'][i % 5],
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              animate={{ y: [0, 900], rotate: [0, 360 * 3], opacity: [1, 0] }}
              transition={{ duration: 2.5 + Math.random(), delay: Math.random() * 0.5, ease: 'easeIn' }}
            />
          ))}
        </div>

        {/* ìcone de sucesso */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #2E7D32, #1E8449)', boxShadow: '0 20px 60px rgba(46,125,50,0.4)' }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: '56px' }}
          >
            ✅
          </motion.span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
          <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '28px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px' }}>
            Pedido Confirmado!
          </h1>
          <p className="text-[#795548] text-sm mb-6">
            Seu pedido foi recebido e já está sendo preparado com muito carinho 🌵
          </p>

          {order && (
            <div className="p-5 rounded-2xl mb-6 w-full" style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.15)' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-[#795548] text-xs mb-1">Número do pedido</p>
                  <p className="text-[#B94E2F] font-bold text-base font-mono">#{order.id}</p>
                </div>
                <div className="text-left">
                  <p className="text-[#795548] text-xs mb-1">Tempo estimado</p>
                  <p className="text-[#4E342E] font-bold text-base">⏱ {order.estimatedTime} min</p>
                </div>
                <div className="text-left">
                  <p className="text-[#795548] text-xs mb-1">Total pago</p>
                  <p className="text-[#4E342E] font-bold text-base">R$ {order.total.toFixed(2)}</p>
                </div>
                <div className="text-left">
                  <p className="text-[#795548] text-xs mb-1">Pontos ganhos</p>
                  <p className="text-[#F2B74B] font-bold text-base">+{order.pointsEarned} ⭐</p>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de progresso */}
          <div className="flex items-center justify-between mb-8 w-full">
            {['Recebido', 'Preparando', 'A caminho', 'Entregue'].map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1" style={{ width: '20%' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: i === 0 ? 'var(--color-primary)' : '#FFFFFF',
                    border: `2px solid ${i === 0 ? 'var(--color-primary)' : 'rgba(185,78,47,0.2)'}`,
                  }}
                >
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span className="text-[10px] text-center" style={{ color: i === 0 ? 'var(--color-primary)' : 'var(--color-muted)' }}>{step}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/order-tracking', { state: { orderId } })}
              className="w-full py-4 rounded-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: '0 8px 24px rgba(185,78,47,0.35)' }}
            >
              Acompanhar Pedido 📍
            </motion.button>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-2xl font-semibold text-sm"
              style={{ color: 'var(--color-muted)', background: '#FFFFFF' }}
            >
              Voltar ao Início
            </button>
          </div>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}
