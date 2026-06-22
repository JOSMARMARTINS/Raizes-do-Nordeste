import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Phone, Lock, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Header } from '../components/Header';

// Tela de cadastro para novos clientes criarem sua conta no aplicativo.


export function TelaCadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', cpf: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleRegister = async () => {
    if (!agreed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  if (success) {
    return (
      <div className="absolute inset-0 bg-[#FFF4DC] flex flex-col items-center justify-center px-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #2E7D32, #1E8449)' }}>
            <span style={{ fontSize: '48px' }}>✅</span>
          </div>
        </motion.div>
        <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: '24px', fontWeight: 800, color: 'var(--color-foreground)', textAlign: 'center' }}>
          Conta criada!
        </h2>
        <p className="text-[#795548] text-sm text-center mt-2">Bem-vindo(a) à família Raízes do Nordeste 🌵</p>
      </div>
    );
  }

  const fields = [
    { key: 'name', label: 'Nome Completo', icon: User, type: 'text', placeholder: 'Seu nome' },
    { key: 'email', label: 'E-mail', icon: Mail, type: 'email', placeholder: 'seu@email.com' },
    { key: 'cpf', label: 'CPF', icon: CreditCard, type: 'text', placeholder: '000.000.000-00' },
    { key: 'phone', label: 'Telefone', icon: Phone, type: 'tel', placeholder: '(00) 00000-0000' },
  ];

  return (
    <div className="absolute inset-0 bg-[#FFF4DC] flex flex-col">
      <Header title="Criar Conta" showBack />
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'none' }}>
        <p className="text-[#795548] text-sm mb-6">Junte-se a nós e descubra os sabores do Nordeste</p>

        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className="mb-4">
            <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider mb-2 block">{label}</label>
            <div className="relative">
              <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
              <input
                type={type}
                value={(form as any)[key]}
                onChange={update(key)}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
                style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
              />
            </div>
          </div>
        ))}

        <div className="mb-4">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider mb-2 block">Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-11 pr-12 py-4 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#795548]">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider mb-2 block">Confirmar Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#795548]" />
            <input
              type="password"
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="Repita sua senha"
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-8">
          <button
            onClick={() => setAgreed(!agreed)}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: agreed ? 'var(--color-primary)' : '#FFFFFF', border: `1px solid ${agreed ? 'var(--color-primary)' : 'rgba(185,78,47,0.3)'}` }}
          >
            {agreed && <span className="text-white text-xs">✓</span>}
          </button>
          <p className="text-[#795548] text-xs leading-relaxed">
            Li e aceito os{' '}
            <button onClick={() => navigate('/lgpd')} className="text-[#B94E2F] font-semibold">
              Termos de Uso e Política de Privacidade (LGPD)
            </button>
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRegister}
          disabled={loading || !agreed}
          className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center"
          style={{
            background: loading || !agreed ? 'var(--color-border)' : 'linear-gradient(135deg, #B94E2F, #C62828)',
            boxShadow: agreed ? '0 8px 24px rgba(185,78,47,0.35)' : 'none',
          }}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : 'Criar Conta'}
        </motion.button>

        <p className="text-center text-[#795548] text-sm mt-6 pb-4">
          Já tem conta?{' '}
          <button onClick={() => navigate('/login')} className="text-[#B94E2F] font-bold">
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
