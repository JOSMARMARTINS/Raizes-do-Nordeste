import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TrendingUp, Package, AlertTriangle, Users, LogOut, ChevronRight, BarChart2 } from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';
import { products } from '../data/products';

// Painel do gerente da unidade, com acesso a relatórios e gestão de equipe.


type Tab = 'visao' | 'pedidos' | 'cardapio';

export function TelaGerente() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<Tab>('visao');
  const [disabledProducts, setDisabledProducts] = useState<Set<string>>(new Set());

  const toggleProduct = (id: string) => {
    setDisabledProducts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const user = state.user;
  const totalRevenue = state.orders.filter(o => o.paymentStatus === 'confirmado').reduce((s, o) => s + o.total, 0);
  const deliveryOrders = state.orders.filter(o => o.channel === 'delivery');
  const pickupOrders = state.orders.filter(o => o.channel === 'pickup');
  const dineInOrders = state.orders.filter(o => o.channel === 'dine-in');
  const activeOrders = state.orders.filter(o => !['entregue', 'cancelado'].includes(o.status));
  const canceledOrders = state.orders.filter(o => o.status === 'cancelado');

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'visao', label: 'Visão Geral' },
    { id: 'pedidos', label: 'Pedidos' },
    { id: 'cardapio', label: 'Cardápio' },
  ];

  return (
    <ScreenWrapper hasBottomNav={false}>
      {/* Cabeçalho */}
      <div className="px-5 pt-14 pb-4" style={{ background: 'linear-gradient(to bottom, #F8EDD5, #FFF4DC)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#795548] text-xs">Gerente da Unidade</p>
            <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '20px', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {user?.name.split(' ')[0]} 👋
            </h1>
            {user?.storeId && (
              <p className="text-[#B94E2F] text-xs font-semibold">{state.selectedStore?.name || 'Unidade Boa Vista'}</p>
            )}
          </div>
          <div className="flex items-center gap-2">

            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #B94E2F, #C62828)',
                boxShadow: '0 4px 12px rgba(185,78,47,0.3)',
              }}
            >
              <BarChart2 
                size={13} 
                className="text-white" 
              />

              <span className="text-white text-xs font-bold">
                Aplicativo de Pedidos
              </span>
            </button>

            <button onClick={handleLogout} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FFFFFF' }}>
              <LogOut size={16} className="text-[#C62828]" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-3">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-2xl" style={{ background: '#FFFFFF' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: tab === t.id ? 'linear-gradient(135deg, #B94E2F, #C62828)' : 'transparent',
                color: tab === t.id ? 'white' : 'var(--color-muted)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'visao' && (
          <div className="flex flex-col gap-4">
            {/* Cartao de receita */}
            <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)' }}>
              <p className="text-white/70 text-xs mb-1">Receita Total (confirmada)</p>
              <p style={{ fontFamily: "var(--font-family-display)", fontSize: '32px', fontWeight: 800, color: 'white' }}>
                R$ {totalRevenue.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-white/60" />
                <span className="text-white/60 text-xs">{state.orders.length} pedidos registrados</span>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pedidos Ativos', value: activeOrders.length, icon: '🔄', color: '#2980B9' },
                { label: 'Cancelamentos', value: canceledOrders.length, icon: '⚠️', color: 'var(--color-secondary)' },
                { label: 'Delivery', value: deliveryOrders.length, icon: '🛵', color: 'var(--color-primary)' },
                { label: 'Retirada', value: pickupOrders.length, icon: '🛍️', color: '#8B4513' },
              ].map(k => (
                <div key={k.label} className="p-3 rounded-xl" style={{ background: '#FFFFFF' }}>
                  <span style={{ fontSize: '22px', display: 'block', marginBottom: '4px' }}>{k.icon}</span>
                  <p className="font-bold text-lg" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-[#BCAAA4] text-[11px]">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Detalhamento do canal */}
            <div className="p-4 rounded-2xl" style={{ background: '#FFFFFF' }}>
              <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '14px', marginBottom: '12px' }}>
                Pedidos por Canal
              </h3>
              {[
                { label: 'Delivery', count: deliveryOrders.length, icon: '🛵' },
                { label: 'Retirada', count: pickupOrders.length, icon: '🛍️' },
                { label: 'No local', count: dineInOrders.length, icon: '🍽️' },
              ].map(c => {
                const pct = state.orders.length > 0 ? (c.count / state.orders.length) * 100 : 0;
                return (
                  <div key={c.label} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-[#795548] text-xs">{c.icon} {c.label}</span>
                      <span className="text-[#4E342E] text-xs font-bold">{c.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'var(--color-primary)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alertas */}
            {canceledOrders.length > 0 && (
              <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(198,40,40,0.08)', border: '1px solid rgba(198,40,40,0.2)' }}>
                <AlertTriangle size={18} className="text-[#C62828] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#C62828] font-bold text-sm">Atenção</p>
                  <p className="text-[#795548] text-xs">{canceledOrders.length} pedido(s) cancelado(s) hoje. Verifique os motivos.</p>
                </div>
              </div>
            )}

            {/* Atalho para atendentes */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/atendente')}
              className="w-full flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.12)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#B94E2F20' }}>
                <Users size={18} className="text-[#B94E2F]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#4E342E] font-semibold text-sm">Painel do Atendente</p>
                <p className="text-[#795548] text-xs">Gerenciar fila de pedidos</p>
              </div>
              <ChevronRight size={16} className="text-[#BCAAA4]" />
            </motion.button>
          </div>
        )}

        {tab === 'pedidos' && (
          <div className="flex flex-col gap-3 mb-6">
            {state.orders.length === 0 ? (
              <div className="text-center py-12">
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📭</span>
                <p className="text-[#795548] text-sm">Nenhum pedido registrado</p>
              </div>
            ) : (
              state.orders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.1)' }}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[#4E342E] font-bold text-sm">#{order.id}</p>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: order.paymentStatus === 'confirmado' ? '#2E7D3220' : order.paymentStatus === 'negado' ? '#C6282820' : '#F2B74B20', color: order.paymentStatus === 'confirmado' ? '#2E7D32' : order.paymentStatus === 'negado' ? 'var(--color-secondary)' : 'var(--color-accent)' }}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#795548] text-xs mb-1">{order.items.length} iten(s) · {order.channel}</p>
                  <p className="text-[#B94E2F] font-bold">R$ {order.total.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'cardapio' && (
          <div className="flex flex-col gap-2 mb-6">
            <div className="p-3 rounded-xl mb-2" style={{ background: 'rgba(242,183,75,0.1)', border: '1px solid rgba(242,183,75,0.3)' }}>
              <p className="text-[#795548] text-xs">Ative/desative produtos para sua unidade. Alterações refletem imediatamente no cardápio.</p>
            </div>
            {disabledProducts.size > 0 && (
              <div className="p-3 rounded-xl mb-1 flex items-center justify-between" style={{ background: 'rgba(198,40,40,0.07)', border: '1px solid rgba(198,40,40,0.2)' }}>
                <p className="text-[#C62828] text-xs font-semibold">{disabledProducts.size} produto(s) desativado(s) nesta unidade</p>
                <button onClick={() => setDisabledProducts(new Set())} className="text-[#C62828] text-[10px] font-bold underline">Reativar todos</button>
              </div>
            )}
            {products.map(p => {
              const active = !disabledProducts.has(p.id);
              return (
                <motion.div
                  key={p.id}
                  layout
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: active ? '#FFFFFF' : 'rgba(188,170,164,0.08)',
                    border: `1px solid ${active ? 'rgba(185,78,47,0.08)' : 'rgba(188,170,164,0.25)'}`,
                    opacity: active ? 1 : 0.7,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ filter: active ? 'none' : 'grayscale(1)' }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#4E342E] text-sm font-semibold line-clamp-1">{p.name}</p>
                    <p className="text-[#BCAAA4] text-xs">R$ {p.price.toFixed(2)}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleProduct(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
                    style={{
                      background: active ? '#2E7D3220' : '#C6282820',
                      color: active ? '#2E7D32' : 'var(--color-secondary)',
                      border: `1px solid ${active ? '#2E7D3240' : '#C6282840'}`,
                    }}
                  >
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-[#2E7D32]' : 'bg-[#C62828]'}`} />
                    {active ? 'Ativo' : 'Inativo'}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}
