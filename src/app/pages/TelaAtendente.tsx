import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  ChevronRight,
  Plus,
  User,
  Star,
  Store,
} from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Painel exclusivo para o atendente, focado em gerenciar os pedidos que estão chegando na loja.


const statusColors: Record<string, string> = {
  recebido: '#2980B9',
  preparando: 'var(--color-accent)',
  saiu: 'var(--color-primary)',
  entregue: '#2E7D32',
  cancelado: 'var(--color-secondary)',
};

const statusLabel: Record<string, string> = {
  recebido: 'Recebido',
  preparando: 'Preparando',
  saiu: 'Saiu p/ entrega',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const nextStatus: Record<string, string> = {
  recebido: 'preparando',
  preparando: 'saiu',
  saiu: 'entregue',
};

function formatCPF(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function TelaAtendente() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [tab, setTab] = useState<'ativos' | 'historico'>('ativos');
  const [cpf, setCpf] = useState('');
  const [cpfFeedback, setCpfFeedback] = useState<'idle' | 'found' | 'notfound'>('idle');

  const user = state.user;

  const ativos = state.orders.filter(o => !['entregue', 'cancelado'].includes(o.status));
  const historico = state.orders.filter(o => ['entregue', 'cancelado'].includes(o.status));

  const handleAdvance = (orderId: string, current: string) => {
    const next = nextStatus[current];

    if (next) {
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { orderId, status: next as any },
      });
    }
  };

  const handleCancel = (orderId: string) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: 'cancelado' },
    });
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleCpfLookup = () => {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length < 11) return;

    setCpfFeedback(digits === '00000000000' ? 'notfound' : 'found');
  };

  const handleNewOrder = () => {
    navigate('/store-selection');
  };

  return (
    <ScreenWrapper hasBottomNav={false}>
      {/* Cabaçalho */}
      <div
        className="px-5 pt-14 pb-4"
        style={{ background: 'linear-gradient(to bottom, #F8EDD5, #FFF4DC)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[#795548] text-xs">Painel do Atendente</p>

            <h1
              style={{
                fontFamily: "var(--font-family-display)",
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--color-foreground)',
              }}
            >
              {user?.name.split(' ')[0]} 👋
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {(user?.role === 'gerente' || user?.role === 'admin') && (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/gerente')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #B94E2F, #C62828)',
                  boxShadow: '0 4px 12px rgba(185,78,47,0.3)',
                }}
              >


                <span className="text-white text-xs font-bold">
                  {user.role === 'admin' ? 'Franqueadora' : ' 🏪 Painel do Gerente'}
                </span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{
                background: 'rgba(198,40,40,0.1)',
                color: 'var(--color-secondary)',
              }}
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        </div>

        {/* CPF do cliente */}
        <div
          className="p-4 rounded-2xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(185,78,47,0.15)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <User size={14} className="text-[#B94E2F]" />
            <p className="text-[#4E342E] font-semibold text-sm">CPF do Cliente</p>
            <span className="text-[10px] text-[#BCAAA4] font-medium">(opcional)</span>
          </div>

          <p className="text-[#795548] text-xs mb-3">
            Informe o CPF para que o cliente acumule pontos no pedido.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={e => {
                setCpf(formatCPF(e.target.value));
                setCpfFeedback('idle');
              }}
              className="flex-1 px-3 py-2.5 rounded-xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm font-mono"
              style={{
                background: 'var(--color-background)',
                border: `1px solid ${cpfFeedback === 'found'
                  ? '#2E7D32'
                  : cpfFeedback === 'notfound'
                    ? 'var(--color-secondary)'
                    : 'rgba(185,78,47,0.2)'
                  }`,
              }}
            />

            <button
              onClick={handleCpfLookup}
              disabled={cpf.replace(/\D/g, '').length < 11}
              className="px-4 py-2.5 rounded-xl text-xs font-bold"
              style={{
                background: cpf.replace(/\D/g, '').length === 11 ? 'var(--color-primary)' : 'var(--color-border)',
                color: cpf.replace(/\D/g, '').length === 11 ? 'white' : 'var(--color-muted-foreground)',
              }}
            >
              Buscar
            </button>
          </div>

          <AnimatePresence>
            {cpfFeedback !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 mt-2"
              >
                {cpfFeedback === 'found' ? (
                  <>
                    <Star size={12} fill='var(--color-accent)' stroke="none" />
                    <p className="text-[#2E7D32] text-xs font-semibold">
                      Cliente encontrado! Os pontos serão adicionados após o pedido.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle size={12} className="text-[#C62828]" />
                    <p className="text-[#C62828] text-xs">
                      CPF não encontrado. O pedido seguirá sem acúmulo de pontos.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Ativos', value: ativos.length, icon: '🔄', color: '#2980B9' },
            {
              label: 'Entregues',
              value: historico.filter(o => o.status === 'entregue').length,
              icon: '✅',
              color: '#2E7D32',
            },
            {
              label: 'Cancelados',
              value: historico.filter(o => o.status === 'cancelado').length,
              icon: '❌',
              color: 'var(--color-secondary)',
            },
          ].map(s => (
            <div
              key={s.label}
              className="p-2.5 rounded-xl text-center"
              style={{ background: '#FFFFFF' }}
            >
              <span style={{ fontSize: '18px', display: 'block' }}>{s.icon}</span>
              <p className="font-bold text-sm" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[#BCAAA4] text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Abas */}
        <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: '#FFFFFF' }}>
          {(['ativos', 'historico'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg, #B94E2F, #C62828)' : 'transparent',
                color: tab === t ? 'white' : 'var(--color-muted)',
              }}
            >
              {t === 'ativos' ? `Ativos (${ativos.length})` : 'Histórico'}
            </button>
          ))}
        </div>

        {/* Lista de pedidos */}
        <div className="flex flex-col gap-3">
          {(tab === 'ativos' ? ativos : historico).length === 0 ? (
            <div className="text-center py-12">
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>
                📭
              </span>
              <p className="text-[#795548] text-sm">
                Nenhum pedido {tab === 'ativos' ? 'ativo' : 'no histórico'}
              </p>
            </div>
          ) : (
            (tab === 'ativos' ? ativos : historico).map(order => (
              <motion.div
                key={order.id}
                layout
                className="p-4 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(185,78,47,0.1)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[#4E342E] font-bold text-sm">#{order.id}</p>
                    <p className="text-[#795548] text-xs">
                      {order.channel === 'delivery'
                        ? '🛵 Delivery'
                        : order.channel === 'pickup'
                          ? '🛍️ Retirada'
                          : '🍽️ No local'}
                    </p>
                  </div>

                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      background: `${statusColors[order.status]}20`,
                      color: statusColors[order.status],
                    }}
                  >
                    {statusLabel[order.status]}
                  </span>
                </div>

                <div className="mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-[#795548] text-xs">
                      {item.quantity}x {item.product.name}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#795548] text-xs">
                    <Clock size={11} />
                    <span>~{order.estimatedTime} min</span>
                  </div>

                  <p className="text-[#B94E2F] font-bold text-sm">
                    R$ {order.total.toFixed(2)}
                  </p>
                </div>

                {nextStatus[order.status] && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                      style={{
                        background: 'rgba(198,40,40,0.1)',
                        color: 'var(--color-secondary)',
                      }}
                    >
                      <XCircle size={13} />
                      Cancelar
                    </button>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAdvance(order.id, order.status)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #B94E2F, #C62828)',
                      }}
                    >
                      <RefreshCw size={13} />
                      Avançar → {statusLabel[nextStatus[order.status]]}
                    </motion.button>
                  </div>
                )}

                {order.status === 'entregue' && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle size={14} className="text-[#2E7D32]" />
                    <span className="text-[#2E7D32] text-xs font-semibold">
                      Concluído
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Novo pedido */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNewOrder}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 mt-6 mb-6"
          style={{
            background: 'linear-gradient(135deg, #B94E2F, #C62828)',
            boxShadow: '0 8px 24px rgba(185,78,47,0.35)',
          }}
        >
          <Plus size={18} className="text-white" />
          <ShoppingBag size={18} className="text-white" />
          <span className="text-white font-bold">Registrar Novo Pedido</span>
          <ChevronRight size={16} className="text-white" />
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}