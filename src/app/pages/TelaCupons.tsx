import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Tag, X, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';
import { coupons } from '../data/products';

// Tela dedicada para o cliente inserir e validar cupons de desconto.


export function TelaCupons() {
  const navigate = useNavigate();
  const { state, dispatch, cartTotal } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [applied, setApplied] = useState('');

  const applyCode = (inputCode: string) => {
    const upper = inputCode.toUpperCase();
    const coupon = coupons.find(c => c.id === upper);
    if (!coupon) { setError('Cupom inválido ou expirado'); return; }
    if (cartTotal < coupon.minOrder) { setError(`Pedido mínimo de R$ ${coupon.minOrder.toFixed(2)}`); return; }
    const discountValue = coupon.type === 'percent' ? (cartTotal * coupon.discount / 100) :
      coupon.type === 'fixed' ? coupon.discount : 6.99;
    dispatch({ type: 'APPLY_COUPON', payload: { code: upper, discount: discountValue } });
    setApplied(upper);
    setError('');
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Cupons e Descontos" showBack />

      <div className="px-5 pt-4">
        {/* Entrada */}
        <div className="mb-6">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider mb-2 block">Código do Cupom</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Ex: NORDESTE10"
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm uppercase"
                style={{ background: '#FFFFFF', border: `1px solid ${error ? 'var(--color-secondary)' : 'rgba(185,78,47,0.2)'}` }}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => applyCode(code)}
              disabled={!code}
              className="px-5 py-4 rounded-2xl font-bold text-sm"
              style={{ background: code ? 'var(--color-primary)' : 'var(--color-border)', color: 'white' }}
            >
              Aplicar
            </motion.button>
          </div>
          {error && <p className="text-[#C62828] text-xs mt-2">{error}</p>}
        </div>

        {applied && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{ background: 'rgba(46,125,50,0.15)', border: '1px solid rgba(46,125,50,0.3)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#2E7D32' }}>
              <Check size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[#2E7D32] font-bold text-sm">Cupom aplicado!</p>
              <p className="text-[#795548] text-xs">{applied}</p>
            </div>
          </motion.div>
        )}

        {/* Cupons disponível */}
        <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '16px', marginBottom: '16px' }}>
          Cupons Disponíveis
        </h3>

        <div className="flex flex-col gap-3">
          {coupons.map(coupon => {
            const canUse = cartTotal >= coupon.minOrder;
            return (
              <div
                key={coupon.id}
                className="p-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1px dashed rgba(185,78,47,0.25)', opacity: canUse ? 1 : 0.5 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span
                      className="font-bold tracking-widest px-3 py-1 rounded-lg text-sm"
                      style={{ background: '#B94E2F20', color: 'var(--color-primary)', fontFamily: 'monospace' }}
                    >
                      {coupon.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#B94E2F] font-bold text-sm">
                      {coupon.type === 'percent' ? `${coupon.discount}% OFF` :
                       coupon.type === 'fixed' ? `R$ ${coupon.discount} OFF` : 'FRETE GRÁTIS'}
                    </p>
                  </div>
                </div>
                <p className="text-[#795548] text-xs mb-3">{coupon.description}</p>
                {coupon.minOrder > 0 && (
                  <p className="text-[#BCAAA4] text-xs mb-3">Mínimo: R$ {coupon.minOrder.toFixed(2)}</p>
                )}
                <button
                  onClick={() => canUse && applyCode(coupon.id)}
                  disabled={!canUse || state.appliedCoupon === coupon.id}
                  className="w-full py-2 rounded-xl text-sm font-bold"
                  style={{
                    background: state.appliedCoupon === coupon.id ? '#2E7D32' : canUse ? '#B94E2F20' : '#FFFFFF',
                    color: state.appliedCoupon === coupon.id ? 'white' : canUse ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                    border: `1px solid ${state.appliedCoupon === coupon.id ? '#2E7D32' : canUse ? '#B94E2F40' : 'transparent'}`,
                  }}
                >
                  {state.appliedCoupon === coupon.id ? '✓ Aplicado' : canUse ? 'Usar cupom' : 'Pedido insuficiente'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenWrapper>
  );
}
