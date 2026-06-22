import { useNavigate } from 'react-router';
import { Star, Plus, Clock } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const navigate = useNavigate();

  if (horizontal) {
    return (
      <button
        onClick={() => navigate(`/product/${product.id}`)}
        className="flex gap-3 p-3 rounded-2xl w-full text-left active:opacity-80 transition-opacity"
        style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.12)' }}
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[#4E342E] font-bold text-sm leading-tight line-clamp-1">{product.name}</h3>
            {product.popular && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(185,78,47,0.2)', color: '#B94E2F' }}>
                + pedido
              </span>
            )}
          </div>
          <p className="text-[#795548] text-xs mt-0.5 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star size={10} fill="#F2B74B" stroke="none" />
                <span className="text-[#F2B74B] text-xs font-semibold">{product.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-[#795548]" />
                <span className="text-[#795548] text-xs">{product.prepTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                {product.originalPrice && (
                  <span className="text-[#795548] text-xs line-through block text-right">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[#B94E2F] font-bold text-sm">R$ {product.price.toFixed(2)}</span>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#B94E2F' }}>
                <Plus size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="rounded-2xl overflow-hidden text-left active:opacity-80 transition-opacity flex-shrink-0"
      style={{ width: '160px', background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.12)' }}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.originalPrice && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#B94E2F', color: 'white' }}>
            OFERTA
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-[#4E342E] font-bold text-xs leading-tight line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={10} fill="#F2B74B" stroke="none" />
          <span className="text-[#F2B74B] text-[10px] font-semibold">{product.rating}</span>
          <span className="text-[#795548] text-[10px]">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-[#795548] text-[10px] line-through block">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[#B94E2F] font-bold text-sm">R$ {product.price.toFixed(2)}</span>
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#B94E2F' }}>
            <Plus size={14} className="text-white" />
          </div>
        </div>
      </div>
    </button>
  );
}
