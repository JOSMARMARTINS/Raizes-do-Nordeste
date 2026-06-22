import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Bell, Search, Star, ChevronRight, Flame, Clock, LogOut } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { BottomNav } from '../components/BottomNav';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ProductCard } from '../components/ProductCard';
import { products, categories, promotions } from '../data/products';

// Tela inicial principal do aplicativo, a "vitrine" da nossa loja com destaques e promoções.


export function TelaInicial() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [promoIndex, setPromoIndex] = useState(0);

  const user = state.user;
  const popularProducts = products.filter(p => p.popular);
  const newProducts = products.slice(2, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <ScreenWrapper>
      {/* Cabeçalho principal com saudação e atalhos rápidos */}
      <div className="px-5 pt-14 pb-4 bg-gradient-to-b from-background-alt to-background">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-muted text-xs font-medium">{greeting},</p>
            <h1 className="text-[20px] font-extrabold text-foreground" style={{ fontFamily: 'var(--font-family-display)' }}>
              {user?.name.split(' ')[0] || 'Visitante'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {(user?.role === 'atendente' || user?.role === 'gerente' || user?.role === 'admin') ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'gerente' ? '/gerente' : '/atendente')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30"
              >
                <span className="text-[13px]">
                  {user.role === 'admin' ? '🏢' : user.role === 'gerente' ? '🏪' : '🧑'}
                </span>
                <span className="text-white text-xs font-bold">
                  {user.role === 'admin' ? 'Franqueadora' : user.role === 'gerente' ? 'Painel do Gerente' : 'Painel do Atendente'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/loyalty')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30"
              >
                <Star size={12} className="fill-accent text-accent" stroke="none" />
                <span className="text-accent text-xs font-bold">{user?.points || 0} pts</span>
              </button>
            )}
            <button
              onClick={() => { }}
              className="w-9 h-9 rounded-xl flex items-center justify-center relative bg-white"
            >
              <Bell size={18} className="text-foreground" />
              {state.notifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white">
              <LogOut size={18} className="text-secondary" />
            </button>
          </div>
        </div>
        {/* Seleção de loja e tipo de pedido (retirada, delivery, mesa) */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button onClick={() => navigate('/store-selection')} className="flex items-center gap-1.5">
            <MapPin size={13} className="text-primary" />
            <span className="text-foreground text-xs font-medium">
              {state.selectedStore ? state.selectedStore.name.replace('Unidade ', '') : 'Selecionar unidade'}
            </span>
            <ChevronRight size={11} className="text-muted" />
          </button>
          {state.orderChannel && (
            <button onClick={() => navigate('/channel-selection')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25"
            >
              <span className="text-[10px]">
                {state.orderChannel === 'delivery' ? '🛵' : state.orderChannel === 'pickup' ? '🛍️' : '🍽️'}
              </span>
              <span className="text-primary text-[10px] font-semibold capitalize">
                {state.orderChannel === 'dine-in' ? 'No local' : state.orderChannel === 'pickup' ? 'Retirada' : 'Delivery'}
              </span>
              <ChevronRight size={9} className="text-primary" />
            </button>
          )}
        </div>

        {/* Campo de busca geral do aplicativo */}
        <button
          onClick={() => navigate('/categories')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-border-subtle"
        >
          <Search size={16} className="text-muted" />
          <span className="text-muted-foreground text-sm">Buscar pratos nordestinos...</span>
        </button>
      </div>

      <div className="px-5">
        {/* Banner promocional rotativo com destaques */}
        <div className="mb-6 mt-5">
          <div className="relative h-36 rounded-2xl overflow-hidden" onClick={() => navigate('/menu/all')}>
            <img
              src={promotions[promoIndex].image}
              alt={promotions[promoIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 60%)` }} />
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 w-fit bg-primary text-white">
                {promotions[promoIndex].discount}
              </span>
              <h3 className="text-[18px] font-extrabold text-white" style={{ fontFamily: 'var(--font-family-display)' }}>
                {promotions[promoIndex].title}
              </h3>
              <p className="text-white text-xs opacity-80">{promotions[promoIndex].subtitle}</p>
            </div>
          </div>
          {/* Indicadores de qual banner está ativo no momento (pontinhos) */}
          <div className="flex justify-center gap-1.5 mt-3">
            {promotions.map((_, i) => (
              <button key={i} onClick={() => setPromoIndex(i)}>
                <div className={`h-1.5 rounded-full transition-all ${i === promoIndex ? 'w-4 bg-primary' : 'w-1.5 bg-border'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Lista de categorias do cardápio para facilitar a navegação */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-extrabold text-foreground" style={{ fontFamily: 'var(--font-family-display)' }}>Categorias</h2>
            <button onClick={() => navigate('/categories')} className="text-primary text-xs font-semibold flex items-center gap-1">
              Ver todas <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(`/menu/${cat.id}`)}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                >
                  <span style={{ fontSize: '26px' }}>{cat.icon}</span>
                </div>
                <span className="text-[#795548] text-[10px] font-semibold">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Seção com os produtos mais populares e pedidos pela galera */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-primary" />
              <h2 className="text-[17px] font-extrabold text-foreground" style={{ fontFamily: 'var(--font-family-display)' }}>Mais Pedidos</h2>
            </div>
            <button onClick={() => navigate('/menu/all')} className="text-primary text-xs font-semibold flex items-center gap-1">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {popularProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        {/* Novidades e lançamentos no cardápio */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent" />
              <h2 className="text-[17px] font-extrabold text-foreground" style={{ fontFamily: 'var(--font-family-display)' }}>Novidades</h2>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {newProducts.map(p => <ProductCard key={p.id} product={p} horizontal />)}
          </div>
        </div>

        {/* Banner secundário sobre o programa de fidelidade (oculto para funcionários) */}
        {user?.role !== 'atendente' && user?.role !== 'gerente' && user?.role !== 'admin' && <div
          className="mb-6 rounded-2xl overflow-hidden p-5 flex items-center justify-between bg-gradient-to-br from-secondary to-red-900"
        >
          <div>
            <p className="text-white/70 text-xs mb-1">Programa de Fidelidade</p>
            <h3 className="text-[16px] font-extrabold text-white" style={{ fontFamily: 'var(--font-family-display)' }}>
              Ganhe pontos em<br />cada pedido! ⭐
            </h3>
            <button
              onClick={() => navigate('/loyalty')}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              Ver meus pontos
            </button>
          </div>
          <span style={{ fontSize: '64px', opacity: 0.8 }}>🏆</span>
        </div>}
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
