import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  BarChart3, Package, ShoppingBag, Tag, FileText, Users,
  TrendingUp, AlertTriangle, ChevronRight, LogOut, Store,
} from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela principal do painel administrativo, onde os gerentes e franqueadores têm a visão geral do negócio.


const MOCK_METRICS = {
  totalRevenue: 48_320.50,
  todayRevenue: 2_140.80,
  totalOrders: 1_247,
  todayOrders: 58,
  activeStores: 5,
  avgTicket: 38.75,
  cancelRate: 2.1,
  topProduct: 'Carne de Sol com Macaxeira',
};

const STORE_METRICS = [
  { id: 'rcf-01', name: 'Boa Vista (PE)', revenue: 18_400, orders: 480, status: 'ok' },
  { id: 'rcf-02', name: 'Boa Viagem (PE)', revenue: 14_200, orders: 370, status: 'ok' },
  { id: 'for-01', name: 'Meireles (CE)', revenue: 8_100, orders: 210, status: 'alert' },
  { id: 'ssa-01', name: 'Pelourinho (BA)', revenue: 4_800, orders: 125, status: 'ok' },
  { id: 'nat-01', name: 'Ponta Negra (RN)', revenue: 2_820, orders: 62, status: 'closed' },
];

const RECENT_ORDERS = [
  { id: 'RN001293', store: 'Boa Vista', total: 52.40, status: 'entregue', channel: 'delivery', time: '14:32' },
  { id: 'RN001292', store: 'Boa Viagem', total: 38.90, status: 'preparando', channel: 'pickup', time: '14:28' },
  { id: 'RN001291', store: 'Meireles', total: 71.00, status: 'recebido', channel: 'delivery', time: '14:25' },
  { id: 'RN001290', store: 'Pelourinho', total: 22.00, status: 'cancelado', channel: 'dine-in', time: '14:20' },
];

const STATUS_COLOR: Record<string, string> = {
  entregue: '#2E7D32', preparando: 'var(--color-accent)', recebido: 'var(--color-primary)', cancelado: 'var(--color-secondary)',
};

const NAV_ITEMS = [
  { icon: BarChart3, label: 'Dashboard', path: '/admin', color: 'var(--color-primary)' },
  { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders', color: 'var(--color-accent)' },
  { icon: Package, label: 'Estoque', path: '/admin/stock', color: '#2980B9' },
  { icon: Tag, label: 'Promoções', path: '/admin/promos', color: '#2E7D32' },
  { icon: FileText, label: 'Relatórios', path: '/admin/reports', color: '#8E44AD' },
  { icon: Users, label: 'Usuários', path: '/admin/users', color: 'var(--color-secondary)' },
];

export function PainelAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'unidades' | 'pedidos'>('visao-geral');
  const { state } = useApp();

  // RN13: Bloqueio de segurança - Apenas funcionários (admin/gerente/atendente) podem acessar o painel
  if (state.isAuthenticated && state.user?.role === 'cliente') {
    navigate('/home');
    return null;
  }
  if (!state.isAuthenticated && !state.isGuest) {
    navigate('/login');
    return null;
  }

  return (
    <ScreenWrapper>
      {/* Cabaçalho do admonistrador */}
      <div
        className="px-5 pt-14 pb-4"
        style={{ background: 'linear-gradient(135deg, #F5EAD5, #FFFFFF)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C62828, #B94E2F)' }}
            >
              <Store size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[#795548] text-xs">Painel Franqueadora</p>
              <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '18px', fontWeight: 800, color: 'var(--color-foreground)' }}>
                Raízes do Nordeste
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(198,40,40,0.15)', border: '1px solid rgba(198,40,40,0.3)' }}
          >
            <LogOut size={16} className="text-[#C62828]" />
          </button>
        </div>

        {/* Navegação rápida */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(({ icon: Icon, label, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', minWidth: '60px' }}
            >
              <Icon size={20} style={{ color }} />
              <span className="text-[#795548] text-[9px] font-semibold whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Receita Hoje', value: `R$ ${MOCK_METRICS.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: `Total: R$ ${(MOCK_METRICS.totalRevenue / 1000).toFixed(1)}k`, icon: '💰', color: '#2E7D32' },
            { label: 'Pedidos Hoje', value: MOCK_METRICS.todayOrders.toString(), sub: `Total: ${MOCK_METRICS.totalOrders}`, icon: '📦', color: 'var(--color-primary)' },
            { label: 'Ticket Médio', value: `R$ ${MOCK_METRICS.avgTicket.toFixed(2)}`, sub: 'Últimos 30 dias', icon: '🎟️', color: 'var(--color-accent)' },
            { label: 'Taxa Cancel.', value: `${MOCK_METRICS.cancelRate}%`, sub: 'Abaixo da meta (3%)', icon: '⚠️', color: MOCK_METRICS.cancelRate < 3 ? '#2E7D32' : 'var(--color-secondary)' },
          ].map(kpi => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl"
              style={{ background: '#FFFFFF', border: `1px solid ${kpi.color}20` }}
            >
              <div className="flex items-start justify-between mb-2">
                <span style={{ fontSize: '22px' }}>{kpi.icon}</span>
                <TrendingUp size={14} style={{ color: kpi.color }} />
              </div>
              <p style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: '18px', color: kpi.color }}>
                {kpi.value}
              </p>
              <p className="text-[#BCAAA4] text-[10px] mt-0.5">{kpi.label}</p>
              <p className="text-[#795548] text-[10px]">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Guias */}
        <div className="flex gap-1 p-1 rounded-2xl mb-5" style={{ background: '#FFFFFF' }}>
          {[
            { key: 'visao-geral', label: 'Visão Geral' },
            { key: 'unidades', label: 'Unidades' },
            { key: 'pedidos', label: 'Pedidos' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--color-muted)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Visão geral */}
        {activeTab === 'visao-geral' && (
          <div>
            {/* Produto principal */}
            <div
              className="p-4 rounded-2xl mb-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(185,78,47,0.15), rgba(198,40,40,0.08))', border: '1px solid rgba(185,78,47,0.2)' }}
            >
              <span style={{ fontSize: '32px' }}>🏆</span>
              <div>
                <p className="text-[#795548] text-xs">Produto mais vendido hoje</p>
                <p className="text-[#4E342E] font-bold text-sm">{MOCK_METRICS.topProduct}</p>
              </div>
            </div>

            {/* Receita por canal */}
            <div className="p-4 rounded-2xl mb-4" style={{ background: '#FFFFFF' }}>
              <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '14px', marginBottom: '12px' }}>
                Receita por Canal
              </h3>
              {[
                { label: 'Delivery', pct: 52, amount: 'R$ 25.126,66', icon: '🛵' },
                { label: 'Retirada', pct: 30, amount: 'R$ 14.496,15', icon: '🛍️' },
                { label: 'Balcão', pct: 18, amount: 'R$ 8.697,69', icon: '🧑‍🍳' },
              ].map(ch => (
                <div key={ch.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#795548] text-xs">{ch.icon} {ch.label}</span>
                    <span className="text-[#4E342E] text-xs font-semibold">{ch.pct}% · {ch.amount}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ch.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(to right, #B94E2F, #F2B74B)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts */}
            <div className="p-4 rounded-2xl mb-4" style={{ background: 'rgba(242,183,75,0.08)', border: '1px solid rgba(242,183,75,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-[#F2B74B]" />
                <span className="text-[#F2B74B] font-bold text-sm">Alertas Operacionais</span>
              </div>
              {[
                { msg: 'Estoque de tapioca baixo — Meireles (CE)', color: 'var(--color-accent)' },
                { msg: '3 cancelamentos auditáveis hoje em Boa Vista', color: 'var(--color-secondary)' },
                { msg: 'Produto sazonal "Canjica" ativo até 30/06', color: '#2E7D32' },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: alert.color }} />
                  <p className="text-[#795548] text-xs leading-relaxed">{alert.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unidades tab */}
        {activeTab === 'unidades' && (
          <div className="flex flex-col gap-3 mb-4">
            {STORE_METRICS.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: `1px solid rgba(185,78,47,0.12)` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#4E342E] font-bold text-sm">{s.name}</h3>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: s.status === 'ok' ? '#2E7D32' : s.status === 'alert' ? 'var(--color-accent)' : 'var(--color-secondary)' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[#BCAAA4] text-[10px]">Receita (mês)</p>
                    <p className="text-[#2E7D32] font-bold text-sm">R$ {s.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[#BCAAA4] text-[10px]">Pedidos (mês)</p>
                    <p className="text-[#B94E2F] font-bold text-sm">{s.orders}</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full mt-3" style={{ background: 'var(--color-border)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(s.revenue / 18400) * 100}%`, background: 'linear-gradient(to right, #B94E2F, #F2B74B)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pedidos tab */}
        {activeTab === 'pedidos' && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#795548] text-xs">Pedidos recentes (todas unidades)</p>
              <button className="text-[#B94E2F] text-xs flex items-center gap-1">
                Ver todos <ChevronRight size={12} />
              </button>
            </div>
            {RECENT_ORDERS.map(order => (
              <div
                key={order.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: '#FFFFFF' }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STATUS_COLOR[order.status] || 'var(--color-muted)' }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#4E342E] font-bold text-xs font-mono">#{order.id}</span>
                    <span className="text-[#BCAAA4] text-[10px]">{order.store}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${STATUS_COLOR[order.status]}20`, color: STATUS_COLOR[order.status] }}>
                      {order.status}
                    </span>
                    <span className="text-[#BCAAA4] text-[10px]">{order.channel} · {order.time}</span>
                  </div>
                </div>
                <span className="text-[#B94E2F] font-bold text-sm">R$ {order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Nota de auditoria */}
        <div
          className="p-3 rounded-xl mb-6 flex items-start gap-2"
          style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.2)' }}
        >
          <span style={{ fontSize: '14px' }}>🔒</span>
          <p className="text-[#795548] text-[10px] leading-relaxed">
            Ações sensíveis (cancelamentos, descontos manuais, ajustes de estoque) são auditadas e rastreadas por usuário e unidade, conforme política da franqueadora.
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
}
