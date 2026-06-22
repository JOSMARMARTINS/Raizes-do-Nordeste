import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useApp, MOCK_CREDENTIALS } from '../store/AppContext';

// Tela de login inicial, a porta de entrada para os clientes e funcionários do sistema.


export function TelaLogin() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [email, setEmail] = useState('josmar@email.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Preencha todos os campos.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    const user = MOCK_CREDENTIALS[email.toLowerCase().trim()];
    if (!user) {
      setError('E-mail ou senha incorretos.');
      setLoading(false);
      return;
    }
    dispatch({ type: 'LOGIN', payload: user });
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'gerente') navigate('/gerente');
    else if (user.role === 'atendente') navigate('/atendente');
    else navigate('/store-selection');
    setLoading(false);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-background-alt to-background"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Decoração do topo da tela com nossa marca e logo */}
      <div className="relative h-48 flex items-end justify-center pb-6 flex-shrink-0">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--color-primary)_0%,transparent_70%)] opacity-25"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div
            className="w-20 h-20 rounded-[24px] flex items-center justify-center shadow-xl bg-gradient-to-br from-primary to-secondary shadow-primary/40"
          >
            <span style={{ fontSize: '44px' }}>🌵</span>
          </div>
          <h2 className="text-[22px] font-extrabold text-foreground mt-3" style={{ fontFamily: 'var(--font-family-display)' }}>
            Raízes do <span className="text-primary">Nordeste</span>
          </h2>
        </motion.div>
      </div>

      {/* Formulário principal onde o usuário vai fazer o login */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-6 pt-6 pb-8"
      >
        <h1 className="text-[26px] font-extrabold text-foreground mb-1.5" style={{ fontFamily: 'var(--font-family-display)' }}>
          Bem-vindo de volta! 👋
        </h1>
        <p className="text-muted text-sm mb-8">Entre na sua conta para continuar</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-white bg-destructive/80 border border-destructive">
            {error}
          </div>
        )}

        {/* Campo para digitar o e-mail ou CPF */}
        <div className="mb-4">
          <label className="text-muted text-xs font-semibold uppercase tracking-wider mb-2 block">E-mail ou CPF</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-foreground placeholder:text-muted-foreground outline-none text-sm bg-white border border-border-subtle focus:border-primary/50"
            />
          </div>
        </div>

        {/* Campo de senha, com aquele botãozinho de mostrar/esconder */}
        <div className="mb-2">
          <label className="text-muted text-xs font-semibold uppercase tracking-wider mb-2 block">Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-4 rounded-2xl text-foreground placeholder:text-muted-foreground outline-none text-sm bg-white border border-border-subtle focus:border-primary/50"
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <button onClick={() => navigate('/forgot-password')} className="text-primary text-sm font-semibold hover:underline">
            Esqueci minha senha
          </button>
        </div>

        {/* O botão principal para entrar no sistema */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 ${loading ? 'bg-muted-foreground' : 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/35'}`}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : 'Entrar'}
        </motion.button>

        {/* Divisor visual bonitinho na tela */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted text-xs">ou entre com</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Botões para login rápido com as redes sociais */}
        <div className="flex gap-3 mb-8">
          {[{ icon: '🇬', label: 'Google' }, { icon: '🔵', label: 'Facebook' }].map(s => (
            <button
              key={s.label}
              className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-foreground font-semibold text-sm active:opacity-70 bg-white border border-border-subtle hover:bg-gray-50 transition-colors"
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <p className="text-center text-muted text-sm mb-5">
          Não tem conta?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline">
            Criar conta
          </button>
        </p>

        {/* Opção para quem quer só dar uma olhadinha sem fazer login */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={() => { dispatch({ type: 'LOGIN_GUEST' }); navigate('/store-selection'); }}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 active:opacity-70 border border-muted/50 hover:bg-black/5 transition-colors"
        >
          <span style={{ fontSize: '16px' }}>👤</span>
          <span className="text-muted font-semibold text-sm">Continuar sem login</span>
        </button>

        <p className="text-center text-muted-foreground text-[10px] mt-2 leading-relaxed px-4">
          Sem conta, algumas funções como favoritos e histórico de pedidos ficam indisponíveis.
        </p>

        {/* Diquinha marota para facilitar os testes (senhas de demonstração) */}
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-dashed border-primary/20">
          <p className="text-muted-foreground text-[9px] font-semibold uppercase tracking-wider mb-1.5">Credenciais de demonstração</p>
          {[
            { label: 'Cliente', email: 'josmar@email.com' },
            { label: 'Atendente', email: 'atendente@raizes.com' },
            { label: 'Gerente', email: 'gerente@raizes.com' },
            { label: 'Admin', email: 'admin@raizes.com' },
          ].map(c => (
            <button
              key={c.email}
              onClick={() => { setEmail(c.email); setPassword('123456'); }}
              className="flex items-center justify-between w-full py-1 px-0"
            >
              <span className="text-primary text-[10px] font-semibold">{c.label}</span>
              <span className="text-muted-foreground text-[10px]">{c.email}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
