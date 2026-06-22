// Níveis do programa de fidelidade e suas respectivas porcentagens de desconto
export const LOYALTY_TIERS = [
  { name: 'Caatingueiro', min: 0, max: 499, icon: '🌵', color: '#8B4513', discountPct: 0 },
  { name: 'Sertanejo', min: 500, max: 1499, icon: '🤠', color: '#C62828', discountPct: 3 },
  { name: 'Nordestino', min: 1500, max: 2999, icon: '☀️', color: '#B94E2F', discountPct: 5 },
  { name: 'Mestre', min: 3000, max: 5999, icon: '👑', color: '#F2B74B', discountPct: 8 },
  { name: 'Embaixador', min: 6000, max: Infinity, icon: '🏆', color: '#2E7D32', discountPct: 10 },
];

export function getLoyaltyTier(points: number) {
  return [...LOYALTY_TIERS].reverse().find(t => points >= t.min) || LOYALTY_TIERS[0];
}
