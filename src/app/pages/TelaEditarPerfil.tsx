import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Phone, FileText, Check, X } from 'lucide-react';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela para o cliente atualizar seus dados pessoais (nome, telefone, etc).


function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function TelaEditarPerfil() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const user = state.user;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cpf, setCpf] = useState(user?.cpf || '');
  const [saved, setSaved] = useState(false);

  const canSave = name.trim().length > 0 && email.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    dispatch({ type: 'UPDATE_PROFILE', payload: { name: name.trim(), email: email.trim(), phone, cpf } });
    setSaved(true);
    setTimeout(() => navigate('/profile'), 1200);
  };

  if (saved) {
    return (
      <ScreenWrapper hasBottomNav={false}>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(46,125,50,0.15)' }}
          >
            <Check size={40} className="text-[#2E7D32]" />
          </motion.div>
          <p style={{ fontFamily: "var(--font-family-display)", fontSize: '20px', fontWeight: 800, color: 'var(--color-foreground)' }}>
            Dados salvos!
          </p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper hasBottomNav={false}>
      <Header title="Editar Perfil" showBack />

      <div className="px-5 pt-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B94E2F, #C62828)' }}
          >
            <span style={{ fontSize: '36px' }}>{name.charAt(0).toUpperCase() || '?'}</span>
          </div>
        </div>

        {/* Campo: Nome */}
        <div className="mb-4">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider block mb-1.5">
            Nome completo
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#795548]" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
        </div>

        {/* Campo: E-mail */}
        <div className="mb-4">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider block mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#795548]" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
        </div>

        {/* Campo: Telefone */}
        <div className="mb-4">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider block mb-1.5">
            Telefone
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#795548]" />
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
        </div>

        {/* Campo: CPF */}
        <div className="mb-8">
          <label className="text-[#795548] text-xs font-semibold uppercase tracking-wider block mb-1.5">
            CPF
          </label>
          <div className="relative">
            <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#795548]" />
            <input
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={e => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-[#4E342E] placeholder-[#BCAAA4] outline-none text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-3"
          style={{
            background: canSave ? 'linear-gradient(135deg, #B94E2F, #C62828)' : 'var(--color-border)',
            boxShadow: canSave ? '0 8px 24px rgba(185,78,47,0.35)' : 'none',
          }}
        >
          <Check size={18} style={{ color: canSave ? 'white' : 'var(--color-muted-foreground)' }} />
          <span className="font-bold" style={{ color: canSave ? 'white' : 'var(--color-muted-foreground)' }}>
            Salvar Alterações
          </span>
        </motion.button>

        {/* Botão Cancelar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/profile')}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(185,78,47,0.2)' }}
        >
          <X size={18} className="text-[#795548]" />
          <span className="text-[#795548] font-bold">Cancelar</span>
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}
