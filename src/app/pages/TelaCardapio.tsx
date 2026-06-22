import { useState } from 'react';
import { useParams } from 'react-router';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/products';

// O cardápio digital em si, listando todos os pratos de uma categoria específica.


export function TelaCardapio() {
  const { categoryId } = useParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'popular' | 'price' | 'rating'>('popular');

  const category = categories.find(c => c.id === categoryId);
  const filtered = products
    .filter(p => categoryId === 'all' || p.category === categoryId)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'price' ? a.price - b.price :
      sort === 'rating' ? b.rating - a.rating :
      (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    );

  return (
    <ScreenWrapper>
      <Header
        title={category?.name || 'Cardápio'}
        showBack
        showCart
      />

      <div className="px-5 pt-4">
        {/* Procurar */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar prato..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
          />
        </div>

        {/* Organizar */}
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal size={14} className="text-[#795548]" />
          <span className="text-[#795548] text-xs">Ordenar:</span>
          {[
            { key: 'popular', label: 'Populares' },
            { key: 'rating', label: 'Melhor avaliado' },
            { key: 'price', label: 'Menor preço' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key as any)}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: sort === opt.key ? 'var(--color-primary)' : '#FFFFFF',
                color: sort === opt.key ? 'white' : 'var(--color-muted)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Contar */}
        <p className="text-[#795548] text-xs mb-4">{filtered.length} {filtered.length === 1 ? 'prato' : 'pratos'} encontrados</p>

        {/* Produtos */}
        <div className="flex flex-col gap-3 pb-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} horizontal />)}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <span style={{ fontSize: '48px' }}>😕</span>
            <p className="text-[#4E342E] font-bold text-base mt-4">Nenhum prato encontrado</p>
            <p className="text-[#795548] text-sm text-center mt-2">Tente outro termo de busca</p>
          </div>
        )}
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
