import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela do carrinho de compras. Aqui o cliente revisa o que pediu, aplica cupons e vê o total antes de pagar.


export function TelaCarrinho() {
  const navigate = useNavigate();
  const { state, dispatch, cartTotal } = useApp();
  const { cart, appliedCoupon, couponDiscount } = state;

  // Verifica se o cliente resgatou Frete Grátis com pontos
  const hasFreeDelivery = cart.some(
    item => item.product.name.includes('Frete Grátis')
  );

  // Calcula o valor do pedido
  const deliveryFee = hasFreeDelivery || cartTotal >= 60 ? 0 : 6.99;
  const discount = couponDiscount;
  const total = cartTotal - discount + deliveryFee;

  // Exibe aviso quando o carrinho não posui intens
  if (cart.length === 0) {
    return (
      <ScreenWrapper>
        <Header title="Carrinho" showBack />
        <div className="flex flex-col items-center justify-center px-8 pt-20">

          {/*icone de carrinho vazio*/}
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <span style={{ fontSize: '80px' }}>🛒</span>
          </motion.div>
          <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '22px', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '16px', textAlign: 'center' }}>
            Carrinho vazio
          </h2>
          <p className="text-[#795548] text-sm text-center mt-2 mb-8">
            Adicione pratos nordestinos deliciosos ao seu pedido
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/home')}
            className="px-8 py-4 rounded-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)' }}
          >
            Explorar Cardápio
          </motion.button>
        </div>
        <BottomNav />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Meu Pedido" showBack />

      {/*Lista de produtos adicionados*/}
      <div className="px-5 pt-4">
        {/* Items */}
        <div className="mb-5">
          <AnimatePresence>
            {cart.map((item, i) => (
              <motion.div
                key={`${item.product.id}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex gap-3 mb-3 p-3 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.12)' }}
              >
                {/* Foto do produto ou ícone de recompensa */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#FFF4DC] flex items-center justify-center">

                  {item.product.id.startsWith('redeem') ? (
                    // Produtos resgatados por pontos
                    <span style={{ fontSize: '34px' }}>

                      {item.product.name.includes('Cajuína') && '🥤'}
                      {item.product.name.includes('Tapioca') && '🥞'}
                      {item.product.name.includes('Frete') && '🛵'}
                      {item.product.name.includes('Cuscuz') && '🌾'}
                      {item.product.name.includes('10%') && '🎟️'}
                      {item.product.name.includes('Baião') && '🍛'}

                    </span>
                  ) : (
                    // Produtos normais do cardápio
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                </div>
                {/* Informações do produto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#4E342E] font-bold text-sm line-clamp-1">{item.product.name}</h3>
                  {Object.values(item.selectedOptions).length > 0 && (
                    <p className="text-[#795548] text-xs mt-0.5">
                      {Object.values(item.selectedOptions).join(', ')}
                    </p>
                  )}
                  {/* Quantidade e valor */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#B94E2F] font-bold text-sm">R$ {item.totalPrice.toFixed(2)}</span>

                    {/* Controle de quantidade */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.product.id, quantity: item.quantity - 1 } })}
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--color-border)' }}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={10} className="text-[#C62828]" />
                        ) : (
                          <Minus size={10} className="text-[#795548]" />
                        )}
                      </button>
                      <span className="text-[#4E342E] font-bold text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.product.id, quantity: item.quantity + 1 } })}
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        <Plus size={10} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Área de Cupm */}
        <button
          onClick={() => navigate('/coupon')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl mb-5"
          style={{ background: '#FFFFFF', border: '1px dashed rgba(185,78,47,0.3)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#B94E2F20' }}>
            <Tag size={16} className="text-[#B94E2F]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#4E342E] text-sm font-semibold">
              {appliedCoupon ? `Cupom: ${appliedCoupon}` : 'Adicionar cupom de desconto'}
            </p>
            {appliedCoupon && <p className="text-[#2E7D32] text-xs">-R$ {discount.toFixed(2)} aplicado</p>}
          </div>
          <ChevronRight size={16} className="text-[#795548]" />
        </button>

        {/* Resumo com subtotal, descontos, entrega e total */}
        <div className="p-4 rounded-2xl mb-5" style={{ background: '#FFFFFF' }}>
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '12px' }}>
            Resumo do Pedido
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#795548] text-sm">Subtotal</span>
              <span className="text-[#4E342E] text-sm font-medium">R$ {cartTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#2E7D32] text-sm">Desconto ({appliedCoupon})</span>
                <span className="text-[#2E7D32] text-sm font-medium">-R$ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#795548] text-sm">Taxa de entrega</span>
              {deliveryFee === 0 ? (
                <span className="text-[#2E7D32] text-sm font-medium">Grátis 🎉</span>
              ) : (
                <span className="text-[#4E342E] text-sm font-medium">R$ {deliveryFee.toFixed(2)}</span>
              )}
            </div>
            <div className="h-px bg-[#FFF0D0]" />
            <div className="flex justify-between">
              <span className="text-[#4E342E] font-bold text-base">Total</span>
              <span className="text-[#B94E2F] font-bold text-base">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {deliveryFee > 0 && (
          <div className="mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(242,183,75,0.1)', border: '1px solid rgba(242,183,75,0.2)' }}>
            <p className="text-[#F2B74B] text-xs">
              ⚡ Adicione mais <strong>R$ {(60 - cartTotal).toFixed(2)}</strong> para ganhar frete grátis!
            </p>
          </div>
        )}

        {/* Botão para adicionar mais produtos */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/menu/all')}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-3"
          style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.25)' }}
        >
          <Plus size={16} className="text-[#B94E2F]" />
          <ShoppingBag size={16} className="text-[#B94E2F]" />
          <span className="text-[#B94E2F] font-bold text-sm">Adicionar Mais Produtos</span>
        </motion.button>

        {/* Finalização do pedido */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/payment')}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 mb-6"
          style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: '0 8px 24px rgba(185,78,47,0.4)' }}
        >
          <span className="text-white font-bold text-base">Finalizar Pedido</span>
          <span className="text-white font-bold text-base">R$ {total.toFixed(2)}</span>
        </motion.button>
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
