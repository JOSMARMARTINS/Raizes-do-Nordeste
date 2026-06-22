import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Lojinha de recompensas onde o cliente pode trocar seus pontos por pratos ou brindes.


const redeemItems = [
  { id: '1', name: 'Cajuína Grátis', desc: 'Uma Cajuína 350ml', points: 100, icon: '🥤', value: 'R$ 9,90', price: 0 },
  { id: '2', name: 'Tapioca Grátis', desc: 'Tapioca de qualquer sabor', points: 180, icon: '🥞', value: 'R$ 18,90', price: 0 },
  { id: '3', name: 'Frete Grátis', desc: '1 entrega gratuita', points: 80, icon: '🛵', value: 'R$ 6,99', price: 0 },
  { id: '4', name: 'Cuscuz Grátis', desc: 'Cuscuz com ovo e manteiga', points: 160, icon: '🌾', value: 'R$ 16,90', price: 0 },
  { id: '5', name: '10% no próximo pedido', desc: 'Desconto em qualquer pedido', points: 250, icon: '🎟️', value: '10% OFF', price: 0 },
  { id: '6', name: 'Baião de Dois Grátis', desc: 'Prato completo', points: 320, icon: '🍛', value: 'R$ 32,50', price: 0 },
];

export function TelaResgatarPontos() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const points = state.user?.points || 0;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmed, setConfirmed] = useState(false);

  const selectedItems = redeemItems.filter(i => selected.has(i.id));
  const totalPointsCost = selectedItems.reduce((s, i) => s + i.points, 0);
  const canFinish = selected.size > 0 && totalPointsCost <= points;

  const toggle = (item: typeof redeemItems[0]) => {
    if (points < item.points) return;
    const next = new Set(selected);
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      // Verifica se a adição do item vai ultrapassar o limite de pontos que o cliente tem
      const newTotal = totalPointsCost + item.points;
      if (newTotal > points) return;
      next.add(item.id);
    }
    setSelected(next);
  };

  const handleFinish = () => {
    if (!canFinish) return;

    // Adiciona cada item resgatado ao carrinho como um produto gratuito
    selectedItems.forEach(item => {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          product: {
            id: `redeem-${item.id}`,
            name: `${item.name} (resgate)`,
            description: item.desc,
            price: 0,
            image: '',
            category: 'resgate',

            rating: 5,
            reviewCount: 0,
            prepTime: '0 min',
            tags: ['resgate'],
            points: 0,

            available: true,
            popular: false,
            options: [],
            extras: [],
          },


          quantity: 1,
          selectedOptions: {},
          selectedExtras: [],
          totalPrice: 0,
          notes: `Resgatado com ${item.points} pts`,
        },
      });
    });

    // Desconta os pontos do saldo do cliente após o resgate
    dispatch({ type: 'REDEEM_POINTS', payload: totalPointsCost });

    setConfirmed(true);
    setTimeout(() => navigate('/cart'), 1800);
  };

  if (confirmed) {
    return (
      <ScreenWrapper hasBottomNav={false}>
        <div className="flex flex-col items-center justify-center h-full px-8 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <span style={{ fontSize: '80px', display: 'block' }}>🎉</span>
          </motion.div>
          <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '22px', fontWeight: 800, color: 'var(--color-foreground)', marginTop: '16px' }}>
            Resgate confirmado!
          </h2>
          <p className="text-[#795548] text-sm mt-2">Os itens foram adicionados ao seu carrinho.</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Resgatar Pontos" showBack />

      <div className="px-5 pt-4">
        {/* Balance */}
        <div
          className="flex items-center justify-between p-4 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, rgba(242,183,75,0.15), rgba(185,78,47,0.1))', border: '1px solid rgba(242,183,75,0.3)' }}
        >
          <div>
            <p className="text-[#795548] text-xs">Pontos disponíveis</p>
            <p style={{ fontFamily: "var(--font-family-display)", fontSize: '28px', fontWeight: 800, color: 'var(--color-accent)' }}>
              {points.toLocaleString()} <span className="text-lg">pts</span>
            </p>
          </div>
          {selected.size > 0 && (
            <div className="text-right">
              <p className="text-[#795548] text-xs">Selecionado</p>
              <p style={{ fontFamily: "var(--font-family-display)", fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)' }}>
                -{totalPointsCost} pts
              </p>
              <p className="text-[#2E7D32] text-xs font-semibold">{points - totalPointsCost} restantes</p>
            </div>
          )}
          {selected.size === 0 && <span style={{ fontSize: '40px' }}>⭐</span>}
        </div>

        {selected.size > 0 && (
          <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.2)' }}>
            <ShoppingCart size={14} className="text-[#2E7D32] flex-shrink-0" />
            <p className="text-[#2E7D32] text-xs">
              <strong>{selected.size} item(s)</strong> selecionado(s) · Toque em "Finalizar Resgate" para adicionar ao carrinho
            </p>
          </div>
        )}

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {redeemItems.map(item => {
            const canSelect = points >= item.points;
            const isSelected = selected.has(item.id);
            const wouldExceed = !isSelected && (totalPointsCost + item.points) > points;

            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: canSelect && !wouldExceed ? 0.96 : 1 }}
                onClick={() => toggle(item)}
                className="p-4 rounded-2xl relative overflow-hidden cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(185,78,47,0.08)' : '#FFFFFF',
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : canSelect && !wouldExceed ? 'rgba(185,78,47,0.2)' : 'rgba(188,170,164,0.3)'}`,
                  opacity: (!canSelect || wouldExceed) && !isSelected ? 0.5 : 1,
                }}
              >
                {/* verificação do selo */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      <Check size={12} className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>{item.icon}</span>
                <h3 className="text-[#4E342E] font-bold text-xs leading-tight mb-1">{item.name}</h3>
                <p className="text-[#795548] text-[10px] mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
  
                  <div className="flex flex-col">
                    <span className="text-[#BCAAA4] text-[10px] font-semibold line-through">
                      {item.value}
                    </span>

                    <span className="text-[#2E7D32] text-[10px] font-bold">
                      GRÁTIS
                    </span>
                  </div>

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: isSelected ? 'var(--color-primary)' : canSelect && !wouldExceed ? '#B94E2F20' : 'var(--color-border)',
                      color: isSelected ? 'white' : canSelect && !wouldExceed ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                    }}
                  >
                    {item.points} pts
                  </span>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Informação */}
        <div className="p-4 rounded-2xl mb-5" style={{ background: 'rgba(185,78,47,0.08)', border: '1px solid rgba(185,78,47,0.15)' }}>
          <h4 className="text-[#4E342E] font-semibold text-sm mb-2">Como funciona?</h4>
          <ul className="space-y-1.5">
            {[
              'Selecione um ou mais itens para resgatar',
              'Os itens serão adicionados ao seu carrinho',
              'Cada R$ 1 em pedidos = 1 ponto',
              'Pontos não expiram',
            ].map(tip => (
              <li key={tip} className="text-[#795548] text-xs flex items-start gap-2">
                <span className="text-[#B94E2F] mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Botão de concluir resgate */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleFinish}
          disabled={!canFinish}
          className="w-full py-4 rounded-2xl flex items-center justify-between px-5 mb-6"
          style={{
            background: canFinish ? 'linear-gradient(135deg, #B94E2F, #C62828)' : 'var(--color-border)',
            boxShadow: canFinish ? '0 8px 24px rgba(185,78,47,0.4)' : 'none',
          }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} style={{ color: canFinish ? 'white' : 'var(--color-muted-foreground)' }} />
            <span className="font-bold" style={{ color: canFinish ? 'white' : 'var(--color-muted-foreground)' }}>
              {selected.size > 0 ? `Finalizar Resgate (${selected.size} item${selected.size > 1 ? 's' : ''})` : 'Selecione itens para resgatar'}
            </span>
          </div>
          {canFinish && (
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">-{totalPointsCost} pts</span>
              <ChevronRight size={16} className="text-white" />
            </div>
          )}
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}
