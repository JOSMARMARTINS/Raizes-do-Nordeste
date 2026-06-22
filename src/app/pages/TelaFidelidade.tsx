import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Star, ChevronRight, Gift } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp, LOYALTY_TIERS } from '../store/AppContext';

// Tela do programa de fidelidade, onde o cliente vê seu nível e benefícios.


const LEVELS = LOYALTY_TIERS.map(t => ({
  name: t.name,
  min: t.min,
  max: t.max === Infinity ? 99999 : t.max,
  icon: t.icon,
  color: t.color,
  discountPct: t.discountPct,
}));

const historyMock = [
  { id: 1, desc: 'Carne de Sol com Macaxeira', points: 38, type: 'earned', date: '10/06' },
  { id: 2, desc: 'Baião de Dois Completo', points: 32, type: 'earned', date: '08/06' },
  { id: 3, desc: 'Resgate: Cajuína Grátis', points: -100, type: 'redeemed', date: '05/06' },
  { id: 4, desc: 'Tapioca de Queijo', points: 18, type: 'earned', date: '03/06' },
  { id: 5, desc: 'Cuscuz com Ovo', points: 16, type: 'earned', date: '01/06' },
];

export function TelaFidelidade() {
  const navigate = useNavigate();
  const { state } = useApp();
  const points = state.user?.points || 0;

  const currentLevel = [...LEVELS].reverse().find(l => points >= l.min) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.min > points);
  const progress = nextLevel ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <ScreenWrapper>
      <Header title="Fidelidade" showCart />

      <div className="px-5 pt-4">
        {/* catão de pontos */}
        <div
          className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${currentLevel.color}, #FFF4DC)` }}
        >
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 opacity-20">
            <span style={{ fontSize: '120px', lineHeight: 1 }}>{currentLevel.icon}</span>
          </div>
          <p className="text-white/70 text-xs mb-1">Seus pontos</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span style={{ fontFamily: "var(--font-family-display)", fontSize: '48px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              {points.toLocaleString()}
            </span>
            <span className="text-white/70 text-sm">pts</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <span style={{ fontSize: '14px' }}>{currentLevel.icon}</span>
              <span className="text-white font-bold text-xs">{currentLevel.name}</span>
            </div>
          </div>
          {nextLevel && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/60 text-xs">{points} pts</span>
                <span className="text-white/60 text-xs">{nextLevel.min} pts para {nextLevel.name}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'white' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Ação dos botões */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/redeem-points')}
            className="p-4 rounded-2xl flex flex-col items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #B94E2F20, #C6282810)', border: '1px solid rgba(185,78,47,0.3)' }}
          >
            <Gift size={24} className="text-[#B94E2F]" />
            <span className="text-[#4E342E] font-bold text-sm">Resgatar</span>
            <span className="text-[#795548] text-xs">Trocar pontos</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu/all')}
            className="p-4 rounded-2xl flex flex-col items-center gap-2"
            style={{ background: 'rgba(242,183,75,0.1)', border: '1px solid rgba(242,183,75,0.3)' }}
          >
            <Star size={24} fill='var(--color-accent)' stroke="none" />
            <span className="text-[#4E342E] font-bold text-sm">Ganhar</span>
            <span className="text-[#795548] text-xs">Fazer pedido</span>
          </motion.button>
        </div>

        {/* Níveis */}
        <div className="mb-6">
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '12px' }}>
            Níveis do Programa
          </h3>
          <div className="flex flex-col gap-2">
            {LEVELS.map(level => {
              const isActive = level.name === currentLevel.name;
              return (
                <div
                  key={level.name}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: isActive ? `${level.color}20` : '#FFFFFF',
                    border: `1px solid ${isActive ? level.color + '40' : 'rgba(185,78,47,0.1)'}`,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{level.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-bold text-sm ${isActive ? 'text-[#4E342E]' : 'text-[#795548]'}`}>{level.name}</p>
                      {level.discountPct > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${level.color}30`, color: level.color }}>
                          {level.discountPct}% OFF em todos pedidos
                        </span>
                      )}
                    </div>
                    <p className="text-[#BCAAA4] text-xs">{level.min.toLocaleString()} – {level.max === 99999 ? '∞' : level.max.toLocaleString()} pts</p>
                  </div>
                  {isActive && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: level.color, color: 'white' }}>
                      Atual
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Historico */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px' }}>
              Histórico
            </h3>
            <button className="text-[#B94E2F] text-xs font-semibold flex items-center gap-1">
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {historyMock.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFFFFF' }}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: h.type === 'earned' ? '#B94E2F20' : '#C6282820' }}
                >
                  <span style={{ fontSize: '16px' }}>{h.type === 'earned' ? '⬆️' : '🎁'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#4E342E] text-xs font-medium line-clamp-1">{h.desc}</p>
                  <p className="text-[#BCAAA4] text-[10px]">{h.date}</p>
                </div>
                <span
                  className="font-bold text-sm"
                  style={{ color: h.type === 'earned' ? '#2E7D32' : 'var(--color-secondary)' }}
                >
                  {h.type === 'earned' ? '+' : ''}{h.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </ScreenWrapper>
  );
}
