import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CreditCard, Smartphone, Banknote, ChevronRight, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela final de checkout, onde o cliente escolhe a forma de pagamento (Pix, Cartão, Dinheiro).


const paymentMethods = [
  { id: 'pix', icon: Smartphone, label: 'PIX', sub: 'Pagamento instantâneo', bonus: '5% de desconto' },
  { id: 'credit', icon: CreditCard, label: 'Cartão de Crédito', sub: 'Até 12x sem juros', bonus: null },
  { id: 'debit', icon: CreditCard, label: 'Cartão de Débito', sub: 'Débito à vista', bonus: null },
  { id: 'cash', icon: Banknote, label: 'Dinheiro', sub: 'Troco na entrega', bonus: null },
];

type GatewayStep = 'idle' | 'requesting' | 'processing' | 'confirmed' | 'failed';

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function CardForm({ data, onChange }: { data: CardData; onChange: (d: CardData) => void }) {
  const raw = data.number.replace(/\s/g, '');
  const brand = raw.startsWith('4') ? 'Visa' : raw.startsWith('5') ? 'Mastercard' : raw.startsWith('3') ? 'Amex' : '';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="mt-3 p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'rgba(185,78,47,0.04)', border: '1px solid rgba(185,78,47,0.15)' }}>
        {/* Mini card preview */}
        <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4E342E, #795548)' }}>
          <div className="absolute right-4 top-0 bottom-0 flex items-center opacity-20">
            <span style={{ fontSize: '56px' }}>💳</span>
          </div>
          <p className="text-white font-mono text-sm tracking-widest mb-3">
            {data.number || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/50 text-[9px] uppercase">Titular</p>
              <p className="text-white text-xs font-semibold uppercase">{data.name || 'SEU NOME'}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[9px] uppercase">Validade</p>
              <p className="text-white text-xs font-mono">{data.expiry || 'MM/AA'}</p>
            </div>
            {brand && <span className="text-white/70 text-xs font-bold">{brand}</span>}
          </div>
        </div>

        {/* Number */}
        <div>
          <label className="text-[#795548] text-[10px] font-semibold uppercase tracking-wider block mb-1">Número do Cartão</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={data.number}
            onChange={e => onChange({ ...data, number: formatCardNumber(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm font-mono"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
          />
        </div>

        {/* Name */}
        <div>
          <label className="text-[#795548] text-[10px] font-semibold uppercase tracking-wider block mb-1">Nome no Cartão</label>
          <input
            type="text"
            placeholder="Como está no cartão"
            value={data.name}
            onChange={e => onChange({ ...data, name: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2.5 rounded-xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
          />
        </div>

        {/* Expiry + CVV */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[#795548] text-[10px] font-semibold uppercase tracking-wider block mb-1">Validade</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={data.expiry}
              onChange={e => onChange({ ...data, expiry: formatExpiry(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm font-mono"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
          <div className="flex-1">
            <label className="text-[#795548] text-[10px] font-semibold uppercase tracking-wider block mb-1">CVV</label>
            <input
              type="password"
              inputMode="numeric"
              placeholder="•••"
              maxLength={4}
              value={data.cvv}
              onChange={e => onChange({ ...data, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              className="w-full px-3 py-2.5 rounded-xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm font-mono"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
        </div>

        <p className="text-[#BCAAA4] text-[10px] text-center">
          🔒 Dados criptografados · Nunca armazenados pela Raízes do Nordeste
        </p>
      </div>
    </motion.div>
  );
}

const PIX_KEY = '12.345.678/0001-99';
const PIX_PAYLOAD = '00020126580014br.gov.bcb.pix0136raizesnordeste@pix.com.br5204000053039865802BR5925Raizes do Nordeste Gastron6009Sao Paulo62070503***6304ABCD';

function PixPanel({ amount }: { amount: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_PAYLOAD).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="mt-3 p-4 rounded-2xl flex flex-col items-center gap-3" style={{ background: 'rgba(46,125,50,0.05)', border: '1px solid rgba(46,125,50,0.2)' }}>

        {/* QR Code — SVG estático representativo */}
        <div className="p-3 rounded-2xl bg-white shadow-sm">
          <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            {/* Background */}
            <rect width="160" height="160" fill="white"/>
            {/* Top-left finder */}
            <rect x="10" y="10" width="42" height="42" fill="#1A1A1A" rx="3"/>
            <rect x="16" y="16" width="30" height="30" fill="white" rx="2"/>
            <rect x="22" y="22" width="18" height="18" fill="#1A1A1A" rx="1"/>
            {/* Top-right finder */}
            <rect x="108" y="10" width="42" height="42" fill="#1A1A1A" rx="3"/>
            <rect x="114" y="16" width="30" height="30" fill="white" rx="2"/>
            <rect x="120" y="22" width="18" height="18" fill="#1A1A1A" rx="1"/>
            {/* Bottom-left finder */}
            <rect x="10" y="108" width="42" height="42" fill="#1A1A1A" rx="3"/>
            <rect x="16" y="114" width="30" height="30" fill="white" rx="2"/>
            <rect x="22" y="120" width="18" height="18" fill="#1A1A1A" rx="1"/>
            {/* Timing patterns */}
            {[62,68,74,80,86,92,98].map((x, i) => i % 2 === 0 && <rect key={x} x={x} y="62" width="5" height="5" fill="#1A1A1A"/>)}
            {[62,68,74,80,86,92,98].map((y, i) => i % 2 === 0 && <rect key={y} x="62" y={y} width="5" height="5" fill="#1A1A1A"/>)}
            {/* Data modules — pattern representativo */}
            {[[62,10],[68,10],[80,10],[86,10],[62,16],[74,16],[80,16],[62,22],[68,22],[86,22],
              [62,108],[74,108],[86,108],[68,114],[80,114],[62,120],[74,120],[86,120],
              [108,62],[114,62],[126,62],[132,62],[108,68],[120,68],[108,74],[120,74],[132,74],[114,80],[126,80],
              [68,62],[80,62],[68,68],[74,74],[80,68],[86,62],[92,68],[98,62],[92,74],
              [68,80],[80,80],[92,80],[98,86],[74,92],[86,92],[68,98],[80,98],[92,98],
              [108,86],[120,86],[132,86],[108,92],[126,92],[114,98],[132,98],
              [68,108],[86,114],[92,108],[98,114],[74,120],[92,126],[98,120],
              [108,108],[120,108],[132,108],[114,114],[126,114],[108,120],[132,120],[120,126],[108,132],[126,132]
            ].map(([x, y], i) => <rect key={i} x={x} y={y} width="5" height="5" fill="#1A1A1A"/>)}
          </svg>
        </div>

        {/* Company name */}
        <div className="text-center">
          <p className="text-[#4E342E] font-bold text-sm">Raízes do Nordeste</p>
          <p className="text-[#795548] text-xs">Gastronomia Digital LTDA</p>
          <p className="text-[#2E7D32] font-bold text-base mt-1">R$ {amount.toFixed(2)}</p>
        </div>

        {/* Chave PIX */}
        <div className="w-full p-3 rounded-xl flex items-center justify-between gap-2" style={{ background: '#FFFFFF', border: '1px solid rgba(46,125,50,0.25)' }}>
          <div className="flex-1 min-w-0">
            <p className="text-[#BCAAA4] text-[10px] font-semibold uppercase tracking-wider">Chave PIX (CNPJ)</p>
            <p className="text-[#4E342E] text-sm font-mono font-semibold truncate">{PIX_KEY}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0"
            style={{
              background: copied ? 'rgba(46,125,50,0.15)' : '#2E7D3220',
              color: copied ? '#2E7D32' : '#2E7D32',
              border: '1px solid rgba(46,125,50,0.3)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </motion.button>
        </div>

        {/* Copia e cola */}
        <button
          onClick={handleCopy}
          className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          style={{ background: copied ? 'rgba(46,125,50,0.12)' : 'rgba(46,125,50,0.08)', color: '#2E7D32', border: '1px solid rgba(46,125,50,0.2)' }}
        >
          <Copy size={13} />
          {copied ? 'Código copiado!' : 'Copiar código Pix (copia e cola)'}
        </button>

        <p className="text-[#BCAAA4] text-[10px] text-center">
          Abra o app do seu banco · Escaneie o QR Code ou cole o código · Confirme o pagamento
        </p>
      </div>
    </motion.div>
  );
}

// Simula a chamada a um gateway de pagamento externo (tipo PagSeguro, MercadoPago)
async function callPaymentGateway(method: string, amount: number): Promise<{ success: boolean; ref: string }> {
  // Step 1 – request sent to gateway (simulated latency)
  await new Promise(r => setTimeout(r, 1200));
  // Step 2 – gateway processes
  await new Promise(r => setTimeout(r, 1000));
  // 95% success rate simulation
  const success = Math.random() > 0.05;
  return { success, ref: `GW-${method.toUpperCase()}-${Date.now().toString(36).toUpperCase()}` };
}

export function TelaPagamento() {
  const navigate = useNavigate();
  const { state, dispatch, cartTotal } = useApp();
  const [method, setMethod] = useState('pix');
  const [gatewayStep, setGatewayStep] = useState<GatewayStep>('idle');
  const [cardData, setCardData] = useState<CardData>({ number: '', name: '', expiry: '', cvv: '' });

  const loyaltyDiscount = state.isAuthenticated ? (cartTotal * state.loyaltyDiscount) / 100 : 0;
  const deliveryFee = (state.orderChannel === 'delivery' && cartTotal < 60) ? 6.99 : 0;
  const couponDiscount = state.couponDiscount;
  const pixDiscount = method === 'pix' ? cartTotal * 0.05 : 0;
  const total = cartTotal - couponDiscount - pixDiscount - loyaltyDiscount + deliveryFee;
  const pointsEarned = Math.floor(total);
  const defaultAddress = state.user?.addresses.find(a => a.isDefault);

  const handleConfirm = async () => {
    setGatewayStep('requesting');
    const orderId = `RN${Date.now().toString().slice(-6)}`;

    // Registra o pedido como "pendente" no sistema ANTES de chamar o gateway de pagamento
    dispatch({
      type: 'ADD_ORDER',
      payload: {
        id: orderId,
        items: state.cart,
        total,
        status: 'recebido',
        createdAt: new Date(),
        estimatedTime: state.orderChannel === 'pickup' ? 15 : 35,
        address: defaultAddress,
        paymentMethod: method,
        paymentStatus: 'pendente',
        couponApplied: state.appliedCoupon || undefined,
        discount: couponDiscount + pixDiscount + loyaltyDiscount,
        deliveryFee,
        pointsEarned,
        channel: state.orderChannel || 'delivery',
        storeId: state.selectedStore?.id || 'rcf-01',
        storeName: state.selectedStore?.name || 'Unidade Boa Vista',
      },
    });

    setGatewayStep('processing');

    // Chama o gateway de pagamento externo (desacoplado do sistema principal)
    const result = await callPaymentGateway(method, total);

    // Atualiza o pedido no nosso sistema com a resposta que veio do gateway
    dispatch({
      type: 'UPDATE_PAYMENT_STATUS',
      payload: { orderId, status: result.success ? 'confirmado' : 'negado', ref: result.ref },
    });

    if (result.success) {
      setGatewayStep('confirmed');
      dispatch({ type: 'ADD_POINTS', payload: pointsEarned });
      dispatch({ type: 'CLEAR_CART' });
      setTimeout(() => navigate('/order-confirmation', { state: { orderId } }), 800);
    } else {
      setGatewayStep('failed');
    }
  };

  const loading = gatewayStep === 'requesting' || gatewayStep === 'processing';

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Pagamento" showBack />

      <div className="px-5 pt-4">
        {/* Address */}
        <div className="mb-5">
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '12px' }}>
            Endereço de Entrega
          </h3>
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.15)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#B94E2F20' }}>
              <MapPin size={18} className="text-[#B94E2F]" />
            </div>
            {defaultAddress ? (
              <div className="flex-1 text-left">
                <p className="text-[#4E342E] font-semibold text-sm">{defaultAddress.label}</p>
                <p className="text-[#795548] text-xs">{defaultAddress.street}, {defaultAddress.number} — {defaultAddress.neighborhood}</p>
                <p className="text-[#795548] text-xs">{defaultAddress.city}, {defaultAddress.state}</p>
              </div>
            ) : (
              <p className="text-[#795548] text-sm">Adicionar endereço</p>
            )}
            <ChevronRight size={16} className="text-[#795548]" />
          </button>
        </div>

        {/* Payment methods */}
        <div className="mb-5">
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '12px' }}>
            Forma de Pagamento
          </h3>
          <div className="flex flex-col gap-2">
            {paymentMethods.map(({ id, icon: Icon, label, sub, bonus }) => (
              <div key={id}>
                <button
                  onClick={() => setMethod(id)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl"
                  style={{
                    background: method === id ? 'rgba(185,78,47,0.1)' : '#FFFFFF',
                    border: `1px solid ${method === id ? 'var(--color-primary)' : 'rgba(185,78,47,0.12)'}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: method === id ? '#B94E2F20' : 'var(--color-border)' }}
                  >
                    <Icon size={18} className={method === id ? 'text-[#B94E2F]' : 'text-[#795548]'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-sm ${method === id ? 'text-[#4E342E]' : 'text-[#795548]'}`}>{label}</p>
                    <p className="text-[#BCAAA4] text-xs">{sub}</p>
                  </div>
                  {bonus && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#2E7D3220', color: '#2E7D32' }}>
                      {bonus}
                    </span>
                  )}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: method === id ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
                  >
                    {method === id && <div className="w-2.5 h-2.5 rounded-full bg-[#B94E2F]" />}
                  </div>
                </button>
                <AnimatePresence>
                  {method === id && (id === 'credit' || id === 'debit') && (
                    <CardForm data={cardData} onChange={setCardData} />
                  )}
                  {method === id && id === 'pix' && (
                    <PixPanel amount={total} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="p-4 rounded-2xl mb-5" style={{ background: '#FFFFFF' }}>
          <h3 style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px', marginBottom: '12px' }}>
            Resumo
          </h3>
          <div className="space-y-2.5">
            {state.cart.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-[#795548] text-xs line-clamp-1 flex-1 mr-4">{item.quantity}x {item.product.name}</span>
                <span className="text-[#4E342E] text-xs font-medium">R$ {item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
            <div className="h-px bg-[#FFF0D0]" />
            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#2E7D32] text-xs">Cupom ({state.appliedCoupon})</span>
                <span className="text-[#2E7D32] text-xs">-R$ {couponDiscount.toFixed(2)}</span>
              </div>
            )}
            {pixDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#2E7D32] text-xs">Desconto PIX (5%)</span>
                <span className="text-[#2E7D32] text-xs">-R$ {pixDiscount.toFixed(2)}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#F2B74B] text-xs">⭐ Desconto fidelidade ({state.loyaltyDiscount}%)</span>
                <span className="text-[#F2B74B] text-xs">-R$ {loyaltyDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#795548] text-xs">Entrega</span>
              <span className="text-xs font-medium" style={{ color: deliveryFee === 0 ? '#2E7D32' : 'var(--color-foreground)' }}>
                {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="h-px bg-[#FFF0D0]" />
            <div className="flex justify-between">
              <span className="text-[#4E342E] font-bold">Total</span>
              <span className="text-[#B94E2F] font-bold">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Points info */}
        {state.isAuthenticated && (
          <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(242,183,75,0.1)', border: '1px solid rgba(242,183,75,0.2)' }}>
            <span style={{ fontSize: '20px' }}>⭐</span>
            <p className="text-[#F2B74B] text-xs">Você ganhará <strong>{pointsEarned} pontos</strong> neste pedido</p>
          </div>
        )}

        {/* Gateway info */}
        <div className="mb-5 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(41,128,185,0.08)', border: '1px solid rgba(41,128,185,0.2)' }}>
          <ShieldCheck size={16} className="text-[#2980B9] flex-shrink-0" />
          <p className="text-[#795548] text-xs leading-relaxed">
            Pagamento processado por <strong className="text-[#4E342E]">gateway externo seguro</strong>. A Raízes do Nordeste não armazena dados do seu cartão.
          </p>
        </div>

        {/* Gateway status overlay */}
        <AnimatePresence>
          {gatewayStep !== 'idle' && gatewayStep !== 'confirmed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-4 rounded-2xl"
              style={{
                background: gatewayStep === 'failed' ? 'rgba(198,40,40,0.15)' : 'rgba(41,128,185,0.12)',
                border: `1px solid ${gatewayStep === 'failed' ? 'rgba(198,40,40,0.3)' : 'rgba(41,128,185,0.25)'}`,
              }}
            >
              {gatewayStep === 'requesting' && (
                <div className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-[#2980B9] border-t-transparent rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-[#4E342E] font-semibold text-sm">Solicitando pagamento...</p>
                    <p className="text-[#795548] text-xs">Enviando para o gateway externo</p>
                  </div>
                </div>
              )}
              {gatewayStep === 'processing' && (
                <div className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-[#F2B74B] border-t-transparent rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-[#4E342E] font-semibold text-sm">Aguardando confirmação...</p>
                    <p className="text-[#795548] text-xs">Gateway processando a transação</p>
                  </div>
                </div>
              )}
              {gatewayStep === 'failed' && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ fontSize: '22px' }}>❌</span>
                    <div>
                      <p className="text-[#C62828] font-bold text-sm">Pagamento recusado</p>
                      <p className="text-[#795548] text-xs">O gateway retornou negativa. Tente outro método.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGatewayStep('idle')}
                    className="flex items-center gap-2 text-[#B94E2F] text-sm font-semibold"
                  >
                    <RefreshCw size={14} /> Tentar novamente
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={loading || gatewayStep === 'confirmed'}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 mb-6"
          style={{ background: loading ? 'var(--color-border)' : 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: loading ? 'none' : '0 8px 24px rgba(185,78,47,0.4)' }}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span className="text-white font-bold">
                {gatewayStep === 'requesting' ? 'Solicitando...' : 'Aguardando gateway...'}
              </span>
            </>
          ) : (
            <span className="text-white font-bold text-base">Confirmar Pedido · R$ {total.toFixed(2)}</span>
          )}
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}
