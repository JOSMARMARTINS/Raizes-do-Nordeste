import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { categories } from '../data/products';

// Tela que lista todas as categorias do nosso cardápio para facilitar a navegação do cliente.


export function TelaCategorias() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScreenWrapper>
      <Header title="Categorias" showCart />

      <div className="px-5 pt-4 pb-4">
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar categoria..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={14} className="text-[#795548]" />
            </button>
          )}
        </div>

        {/* Opção de todos os itens */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/menu/all')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, #B94E2F20, #C6282810)', border: '1px solid rgba(185,78,47,0.3)' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#B94E2F20' }}>
            <span style={{ fontSize: '26px' }}>🍽️</span>
          </div>
          <div className="flex-1 text-left">
            <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px' }}>
              Todos os pratos
            </h3>
            <p className="text-[#795548] text-xs">{categories.reduce((s, c) => s + c.count, 0)} itens no cardápio</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <span className="text-white text-xs">→</span>
          </div>
        </motion.button>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/menu/${cat.id}`)}
              className="p-4 rounded-2xl text-left"
              style={{ background: '#FFFFFF', border: `1px solid ${cat.color}25` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${cat.color}20` }}
              >
                <span style={{ fontSize: '24px' }}>{cat.icon}</span>
              </div>
              <h3 className="text-[#4E342E] font-bold text-sm mb-1">{cat.name}</h3>
              <p className="text-[#795548] text-xs">{cat.count} itens</p>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: '48px' }}>🔍</span>
            <p className="text-[#795548] text-sm mt-4">Nenhuma categoria encontrada</p>
          </div>
        )}
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
