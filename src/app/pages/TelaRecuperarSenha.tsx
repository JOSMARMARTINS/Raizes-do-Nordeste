import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { Header } from '../components/Header';

// Fluxo para recuperação de senha caso o cliente tenha esquecido.


export function TelaRecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'sent'>('input');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setStep('sent');
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 bg-[#FFF4DC] flex flex-col">
      <Header title="Recuperar Senha" showBack />

      <div className="flex-1 px-6 py-8 flex flex-col">
        {step === 'input' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
              style={{ background: 'linear-gradient(135deg, rgba(185,78,47,0.2), rgba(185,78,47,0.1))', border: '1px solid rgba(185,78,47,0.3)' }}>
              <Mail size={36} className="text-[#B94E2F]" />
            </div>

            <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '24px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Esqueceu a senha?
            </h2>
            <p className="text-[#795548] text-sm mb-8 leading-relaxed">
              Informe seu e-mail ou CPF cadastrado e enviaremos um link para redefinir sua senha.
            </p>

            <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider mb-2 block">E-mail ou CPF</label>
            <div className="relative mb-8">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
                style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={!email || loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)', boxShadow: '0 8px 24px rgba(185,78,47,0.35)' }}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : 'Enviar Link'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center mt-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #2E7D32, #1E8449)', boxShadow: '0 12px 40px rgba(46,125,50,0.4)' }}>
                <span style={{ fontSize: '48px' }}>📧</span>
              </div>
            </motion.div>
            <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '24px', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px' }}>
              E-mail enviado!
            </h2>
            <p className="text-[#795548] text-sm leading-relaxed mb-8">
              Verifique sua caixa de entrada em <span className="text-[#B94E2F]">{email}</span> e siga as instruções para redefinir sua senha.
            </p>
            <button onClick={() => navigate('/login')} className="text-[#B94E2F] font-bold text-sm">
              Voltar ao Login
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
