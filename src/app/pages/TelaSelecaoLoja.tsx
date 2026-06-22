import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Clock, Star, ChevronRight, Search, Wifi, WifiOff } from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';
import { stores } from '../data/stores';

// Tela para o cliente escolher qual unidade do Raízes do Nordeste ele quer visitar ou pedir.


const CHANNEL_ICONS: Record<string, string> = {
  app: '📱', totem: '🖥️', balcao: '🧑‍🍳', pickup: '🛍️',
};
const CHANNEL_LABELS: Record<string, string> = {
  app: 'App', totem: 'Totem', balcao: 'Balcão', pickup: 'Retirada',
};

export function TelaSelecaoLoja() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todas' | 'PE' | 'CE' | 'BA' | 'RN'>('todas');

  const filtered = stores.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todas' || s.state === filter;
    return matchSearch && matchFilter;
  });

  const handleSelect = (store: typeof stores[0]) => {
    if (!store.isOpen) return;
    dispatch({ type: 'SET_STORE', payload: store });
    navigate('/channel-selection');
  };

  return (
    <ScreenWrapper scrollable hasBottomNav={false}>
      {/* Cabaçalho */}
      <div
        className="px-5 pt-14 pb-5"
        style={{ background: 'linear-gradient(to bottom, #F8EDD5, #FFF4DC)' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <span style={{ fontSize: '28px' }}>🗺️</span>
          <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '22px', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Escolha a unidade
          </h1>
        </div>
        <p className="text-[#795548] text-sm mb-5">
          Selecione a unidade Raízes do Nordeste mais próxima
        </p>

        {/* Procurar */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cidade ou bairro..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
          />
        </div>

        {/* Filtros de estado */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {(['todas', 'PE', 'CE', 'BA', 'RN'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
              style={{
                background: filter === f ? 'var(--color-primary)' : '#FFFFFF',
                color: filter === f ? 'white' : 'var(--color-muted)',
              }}
            >
              {f === 'todas' ? 'Todas' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-2 pb-4">
        {/* Contar */}
        <p className="text-[#BCAAA4] text-xs mb-3">
          {filtered.filter(s => s.isOpen).length} unidades abertas
        </p>

        {filtered.map((store, i) => (
          <motion.button
            key={store.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={store.isOpen ? { scale: 0.98 } : {}}
            onClick={() => handleSelect(store)}
            disabled={!store.isOpen}
            className="w-full text-left mb-3 p-4 rounded-2xl"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${store.isOpen ? 'rgba(185,78,47,0.2)' : 'rgba(92,61,30,0.2)'}`,
              opacity: store.isOpen ? 1 : 0.55,
            }}
          >
            {/* Topo */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[#4E342E] font-bold text-sm">{store.name}</h3>
                  {store.isOpen ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#2E7D3220', color: '#2E7D32' }}>
                      Aberta
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(198,40,40,0.15)', color: 'var(--color-secondary)' }}>
                      Fechada
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-[#B94E2F]" />
                  <span className="text-[#795548] text-xs">{store.address} — {store.neighborhood}, {store.city}/{store.state}</span>
                </div>
              </div>
              <ChevronRight size={16} className={store.isOpen ? 'text-[#B94E2F]' : 'text-[#BCAAA4]'} />
            </div>

            {/* Linha meta */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star size={11} fill='var(--color-accent)' stroke="none" />
                <span className="text-[#F2B74B] text-xs font-semibold">{store.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-[#795548]" />
                <span className="text-[#795548] text-xs">{store.waitTime}</span>
              </div>
              {store.distance && store.distance !== '–' && (
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-[#795548]" />
                  <span className="text-[#795548] text-xs">{store.distance}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                {store.type === 'completa'
                  ? <Wifi size={11} className="text-[#2E7D32]" />
                  : <WifiOff size={11} className="text-[#F2B74B]" />}
                <span className="text-xs" style={{ color: store.type === 'completa' ? '#2E7D32' : 'var(--color-accent)' }}>
                  {store.type === 'completa' ? 'Cozinha completa' : 'Formato reduzido'}
                </span>
              </div>
            </div>

            {/* Canais */}
            <div className="flex gap-2 flex-wrap">
              {store.channels.map(ch => (
                <span
                  key={ch}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'rgba(185,78,47,0.12)', color: 'var(--color-muted)' }}
                >
                  {CHANNEL_ICONS[ch]} {CHANNEL_LABELS[ch]}
                </span>
              ))}
            </div>

            {/* Aviso indisponível */}
            {store.unavailableCategories && store.unavailableCategories.length > 0 && (
              <p className="text-[#F2B74B] text-[10px] mt-2">
                ⚠️ Cardápio reduzido: {store.unavailableCategories.join(', ')} indisponíveis
              </p>
            )}
          </motion.button>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: '48px' }}>🔍</span>
            <p className="text-[#795548] text-sm mt-4">Nenhuma unidade encontrada</p>
          </div>
        )}

        <p className="text-center text-[#BCAAA4] text-xs mt-2">
          Novas unidades chegando em breve 🌵
        </p>
      </div>
    </ScreenWrapper>
  );
}
