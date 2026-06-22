import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Star, Clock, ChevronLeft, Heart, Share2, Plus, Minus } from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';
import { products } from '../data/products';

// Tela de detalhes do prato, onde o cliente pode escolher o tamanho, ponto da carne e adicionar extras.


export function TelaDetalheProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const product = products.find(p => p.id === id) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const extrasTotal = (product.extras || [])
    .filter(e => selectedExtras.includes(e.id))
    .reduce((s, e) => s + e.price, 0);

  const optionExtra = (product.options || []).reduce((sum, opt) => {
    const choice = opt.choices.find(c => c.id === selectedOptions[opt.id]);
    return sum + (choice?.price || 0);
  }, 0);

  const unitPrice = product.price + extrasTotal + optionExtra;
  const total = unitPrice * quantity;

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        quantity,
        selectedOptions,
        selectedExtras,
        totalPrice: total,
      },
    });
    navigate('/cart');
  };

  return (
    <ScreenWrapper scrollable hasBottomNav={false}>
      {/* Imagem */}
      <div className="relative h-72">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(26,12,2,0.8) 100%)' }} />

        {/* Principais ações*/}
        <div className="absolute top-14 left-0 right-0 flex items-center justify-between px-5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <Heart size={18} fill={liked ? 'var(--color-primary)' : 'none'} className={liked ? 'text-[#B94E2F]' : 'text-white'} />
            </button>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <Share2 size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* etiquetas */}
        <div className="absolute bottom-4 left-5 flex gap-2">
          {product.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(185,78,47,0.85)', color: 'white' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        <div className="flex items-start justify-between mb-2">
          <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '22px', fontWeight: 800, color: 'var(--color-foreground)', flex: 1, lineHeight: 1.2 }}>
            {product.name}
          </h1>
          <div className="ml-3">
            {product.originalPrice && (
              <p className="text-[#795548] text-xs line-through text-right">R$ {product.originalPrice.toFixed(2)}</p>
            )}
            <p className="text-[#B94E2F] font-bold text-xl">R$ {product.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star size={12} fill='var(--color-accent)' stroke="none" />
            <span className="text-[#F2B74B] text-sm font-bold">{product.rating}</span>
            <span className="text-[#795548] text-xs">({product.reviewCount} avaliações)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-[#795548]" />
            <span className="text-[#795548] text-xs">{product.prepTime}</span>
          </div>
        </div>

        <p className="text-[#795548] text-sm leading-relaxed mb-6">{product.description}</p>

        {/* Opções */}
        {(product.options || []).map(opt => (
          <div key={opt.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[#4E342E] font-bold text-sm">{opt.name}</h3>
              {opt.required && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#B94E2F20', color: 'var(--color-primary)' }}>
                  Obrigatório
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {opt.choices.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.id]: c.id }))}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: selectedOptions[opt.id] === c.id ? 'var(--color-border-subtle)' : '#FFFFFF',
                    border: `1px solid ${selectedOptions[opt.id] === c.id ? 'var(--color-primary)' : 'rgba(185,78,47,0.12)'}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: selectedOptions[opt.id] === c.id ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
                    >
                      {selectedOptions[opt.id] === c.id && <div className="w-2 h-2 rounded-full bg-[#B94E2F]" />}
                    </div>
                    <span className="text-[#4E342E] text-sm">{c.label}</span>
                  </div>
                  {c.price && <span className="text-[#B94E2F] text-sm font-semibold">+R$ {c.price.toFixed(2)}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Extras */}
        {(product.extras || []).length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#4E342E] font-bold text-sm mb-3">Adicionais (Opcional)</h3>
            <div className="flex flex-col gap-2">
              {(product.extras || []).map(extra => {
                const selected = selectedExtras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => setSelectedExtras(prev => selected ? prev.filter(e => e !== extra.id) : [...prev, extra.id])}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: selected ? 'var(--color-border-subtle)' : '#FFFFFF',
                      border: `1px solid ${selected ? 'var(--color-primary)' : 'rgba(185,78,47,0.12)'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center"
                        style={{ background: selected ? 'var(--color-primary)' : 'transparent', border: `1.5px solid ${selected ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}` }}
                      >
                        {selected && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <span className="text-[#4E342E] text-sm">{extra.name}</span>
                    </div>
                    <span className="text-[#B94E2F] text-sm font-semibold">+R$ {extra.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantidade */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-2xl" style={{ background: '#FFFFFF' }}>
          <span className="text-[#795548] text-sm font-semibold">Quantidade</span>
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: quantity <= 1 ? '#FFFFFF' : '#B94E2F20', border: '1px solid rgba(185,78,47,0.3)' }}
            >
              <Minus size={14} className={quantity <= 1 ? 'text-[#BCAAA4]' : 'text-[#B94E2F]'} />
            </motion.button>
            <span className="text-[#4E342E] font-bold text-lg w-6 text-center">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary)' }}
            >
              <Plus size={14} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Points info */}
        <div className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(242,183,75,0.1)', border: '1px solid rgba(242,183,75,0.2)' }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <p className="text-[#F2B74B] text-xs">
            Você ganha <strong>{product.points * quantity} pontos</strong> neste pedido
          </p>
        </div>

        {/* Adicionar ao carrinho */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5"
          style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: '0 8px 24px rgba(185,78,47,0.4)' }}
        >
          <span className="text-white font-bold text-base">Adicionar ao Carrinho</span>
          <span className="text-white font-bold text-base">R$ {total.toFixed(2)}</span>
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}
