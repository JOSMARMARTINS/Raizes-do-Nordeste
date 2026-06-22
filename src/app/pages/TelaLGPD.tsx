import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Shield, Star, Gift, BarChart2, Bell, Lock, Check, ChevronDown } from 'lucide-react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useApp } from '../store/AppContext';

// Tela de termos de uso e política de privacidade (adequação à LGPD).


interface ConsentItem {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  hint: string;
  defaultOn: boolean;
}

const CONSENTS: ConsentItem[] = [
  {
    id: 'loyalty',
    icon: Star,
    iconColor: 'var(--color-accent)',
    title: 'Programa de Fidelidade',
    description: 'Permitir o uso dos meus dados para acumular pontos, liberar benefícios e descontos personalizados.',
    hint: 'Usado para calcular pontos e vantagens.',
    defaultOn: true,
  },
  {
    id: 'offers',
    icon: Gift,
    iconColor: 'var(--color-primary)',
    title: 'Ofertas Personalizadas',
    description: 'Autorizar campanhas baseadas no histórico de compras, frequência de consumo, idade e preferências.',
    hint: 'Baseado no seu perfil de consumo.',
    defaultOn: true,
  },
  {
    id: 'analytics',
    icon: BarChart2,
    iconColor: '#2980B9',
    title: 'Melhoria da Experiência',
    description: 'Permitir análise dos pedidos para melhorar produtos, recomendações e atendimento.',
    hint: 'Dados agregados e não identificáveis.',
    defaultOn: true,
  },
  {
    id: 'marketing',
    icon: Bell,
    iconColor: '#8E44AD',
    title: 'Comunicações Promocionais',
    description: 'Receber novidades, cupons e campanhas especiais por e-mail, SMS ou notificações.',
    hint: 'Você pode cancelar a qualquer momento.',
    defaultOn: false,
  },
  {
    id: 'anonymous',
    icon: Lock,
    iconColor: '#2E7D32',
    title: 'Uso de Dados Anônimos',
    description: 'Permitir utilização de dados sem identificação pessoal para relatórios e melhoria dos serviços.',
    hint: 'Impossível identificar o titular.',
    defaultOn: true,
  },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative flex-shrink-0"
      style={{ width: '44px', height: '24px' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ background: on ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ left: on ? '22px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export function TelaLGPD() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [consents, setConsents] = useState<Record<string, boolean>>(
    Object.fromEntries(CONSENTS.map(c => [c.id, c.defaultOn]))
  );
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const setConsent = (id: string, val: boolean) => {
    setConsents(prev => ({ ...prev, [id]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_LGPD',
      payload: { lgpdConsent: true, marketingConsent: consents['marketing'] },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRevokeAll = () => {
    setConsents(Object.fromEntries(CONSENTS.map(c => [c.id, false])));
    setSaved(false);
  };

  const activeCount = Object.values(consents).filter(Boolean).length;

  return (
    <ScreenWrapper hasBottomNav={false}>
      {/* Cabeçalho */}
      <div className="px-5 pt-14 pb-4" style={{ background: 'linear-gradient(to bottom, #F8EDD5, #FFF4DC)' }}>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0"
            style={{ border: '1px solid rgba(185,78,47,0.15)' }}
          >
            <ArrowLeft size={18} className="text-[#4E342E]" />
          </button>
          <div>
            <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: '18px', fontWeight: 800, color: 'var(--color-foreground)' }}>
              Gerenciar Consentimentos
            </h1>
            <p className="text-[#795548] text-xs">Controle como seus dados são utilizados</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Cartão de aviso LGPD */}
        <div
          className="p-4 rounded-2xl mb-6 flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(185,78,47,0.08), rgba(242,183,75,0.06))', border: '1px solid rgba(185,78,47,0.2)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(185,78,47,0.12)' }}
          >
            <Shield size={20} className="text-[#B94E2F]" />
          </div>
          <p className="text-[#795548] text-xs leading-relaxed flex-1">
            Você controla suas permissões conforme a{' '}
            <span className="text-[#B94E2F] font-semibold">Lei Geral de Proteção de Dados (LGPD)</span>.
            Altere seus consentimentos quando desejar.
          </p>
        </div>

        {/* Selo de contagem ativa */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '16px' }}>🔒</span>
            <p style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px' }}>
              Preferências de Privacidade
            </p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(185,78,47,0.1)', color: 'var(--color-primary)' }}
          >
            {activeCount}/{CONSENTS.length} ativos
          </span>
        </div>

        {/* Cartões de consentimento */}
        <div className="flex flex-col gap-3 mb-6">
          {CONSENTS.map(({ id, icon: Icon, iconColor, title, description, hint }) => {
            const on = consents[id];
            const expanded = expandedId === id;
            return (
              <motion.div
                key={id}
                layout
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${on ? 'rgba(185,78,47,0.2)' : 'rgba(188,170,164,0.3)'}`,
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Icone */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${iconColor}18` }}
                    >
                      <Icon size={18} style={{ color: iconColor }} />
                    </div>

                    {/*Título + alternância */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#4E342E] font-bold text-sm">{title}</p>
                      <p className="text-[#BCAAA4] text-[10px] mt-0.5">{hint}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Toggle on={on} onChange={v => setConsent(id, v)} />
                      <button onClick={() => setExpandedId(expanded ? null : id)}>
                        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={16} className="text-[#BCAAA4]" />
                        </motion.div>
                      </button>
                    </div>
                  </div>

                  {/* Descrição expandida*/}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#795548] text-xs leading-relaxed mt-3 pt-3" style={{ borderTop: '1px solid rgba(185,78,47,0.08)' }}>
                          {description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: on ? '#2E7D32' : 'var(--color-muted-foreground)' }} />
                          <p className="text-[10px] font-semibold" style={{ color: on ? '#2E7D32' : 'var(--color-muted-foreground)' }}>
                            {on ? 'Consentimento ativo' : 'Consentimento revogado'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Seção de Segurança */}
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: '16px' }}>⚙️</span>
          <p style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, color: 'var(--color-foreground)', fontSize: '15px' }}>
            Segurança dos Dados
          </p>
        </div>

        <div
          className="p-4 rounded-2xl mb-6"
          style={{ background: 'rgba(41,128,185,0.06)', border: '1px solid rgba(41,128,185,0.2)' }}
        >
          <p className="text-[#4E342E] font-semibold text-sm mb-3">Seus dados são protegidos através de:</p>
          {[
            'Criptografia de informações',
            'Controle de acesso por perfil',
            'Auditoria de operações administrativas',
            'Conformidade com LGPD',
          ].map(item => (
            <div key={item} className="flex items-center gap-2.5 mb-2 last:mb-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(46,125,50,0.15)' }}>
                <Check size={11} className="text-[#2E7D32]" />
              </div>
              <p className="text-[#795548] text-xs">{item}</p>
            </div>
          ))}
        </div>

        {/* Botão de salvar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-3"
          style={{
            background: saved
              ? 'linear-gradient(135deg, #2E7D32, #388E3C)'
              : 'linear-gradient(135deg, #B94E2F, #C62828)',
            boxShadow: '0 8px 24px rgba(185,78,47,0.35)',
          }}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <Check size={18} className="text-white" />
                <span className="text-white font-bold">Preferências Salvas!</span>
              </motion.div>
            ) : (
              <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <Shield size={18} className="text-white" />
                <span className="text-white font-bold">Salvar Preferências</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Revogar tudo */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRevokeAll}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-3"
          style={{ background: '#FFFFFF', border: '1px solid rgba(198,40,40,0.3)' }}
        >
          <span className="text-[#C62828] font-semibold text-sm">Revogar Todos os Consentimentos</span>
        </motion.button>

        <p className="text-center text-[#BCAAA4] text-[10px] mb-6">
          Você pode alterar essas escolhas a qualquer momento.
        </p>
      </div>
    </ScreenWrapper>
  );
}
